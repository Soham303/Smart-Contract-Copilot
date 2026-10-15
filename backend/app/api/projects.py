from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.core.db.repository import db_repo
from app.core.graph.catalog import catalog_instance

projects_bp = Blueprint("projects", __name__)

@projects_bp.route("", methods=["GET"])
@jwt_required(optional=True)
def list_projects():
    """List all projects for the authenticated user or guest (PRD FR-1.3)."""
    identity = get_jwt_identity() or "guest_user"
    projects = db_repo.list_projects(identity)
    return jsonify({"projects": projects}), 200

@projects_bp.route("", methods=["POST"])
@jwt_required(optional=True)
def create_project():
    """Create project (blank or from template) (PRD FR-1.3)."""
    identity = get_jwt_identity() or "guest_user"
    data = request.get_json() or {}
    name = data.get("name", "Untitled Contract").strip() or "Untitled Contract"
    mode = data.get("mode", "blocks")
    network = data.get("network", "testnet")
    template_id = data.get("templateId")

    initial_graph = None
    if template_id:
        tmpl = catalog_instance.get_template(template_id)
        if tmpl and "graph" in tmpl:
            initial_graph = tmpl["graph"]
            if name == "Untitled Contract":
                name = tmpl.get("name", name)
    elif "graph" in data:
        initial_graph = data["graph"]

    project = db_repo.create_project(
        owner_id=identity,
        name=name,
        mode=mode,
        network=network,
        initial_graph=initial_graph
    )
    return jsonify({"project": project}), 201

@projects_bp.route("/<project_id>", methods=["GET"])
def get_project(project_id: str):
    """Read a specific project and its latest graph version by ID (PRD FR-1.3, FR-1.4)."""
    project = db_repo.get_project(project_id)
    if not project:
        # If demo or special ID, provide default fungible token template
        if project_id in ["demo", "new"]:
            tmpl = catalog_instance.get_template("template_fungible_token")
            return jsonify({
                "project": {
                    "id": project_id,
                    "name": "SkyApes_Token_Vesting",
                    "mode": "blocks",
                    "network": "testnet",
                    "graph": tmpl["graph"] if tmpl else {}
                }
            }), 200
        return jsonify({"error": {"code": "PROJECT_NOT_FOUND", "message": f"Project '{project_id}' not found"}}), 404

    latest_graph_ver = db_repo.get_latest_graph_version(project_id)
    graph_data = latest_graph_ver["graph"] if latest_graph_ver else None

    result = dict(project)
    result["graph"] = graph_data
    return jsonify({"project": result}), 200

@projects_bp.route("/<project_id>", methods=["PUT"])
def update_project(project_id: str):
    """Save/update project state and canvas autosave (PRD FR-1.4)."""
    data = request.get_json() or {}
    project = db_repo.get_project(project_id)

    # Allow autosave even if project is created on the fly
    if not project:
        project = db_repo.create_project(
            owner_id="guest_user",
            name=data.get("name", "My Project"),
            mode=data.get("mode", "blocks"),
            network=data.get("network", "testnet")
        )
        project_id = project["id"]

    updates = {}
    if "name" in data:
        updates["name"] = data["name"]
    if "mode" in data:
        updates["mode"] = data["mode"]
    if "network" in data:
        updates["network"] = data["network"]

    if updates:
        db_repo.update_project(project_id, updates)

    # If graph is sent (autosave), save graph version
    saved_graph_ver = None
    if "graph" in data and isinstance(data["graph"], dict):
        saved_graph_ver = db_repo.save_graph_version(project_id, data["graph"])

    return jsonify({
        "message": "Project saved successfully",
        "id": project_id,
        "graphVersionId": saved_graph_ver["id"] if saved_graph_ver else None
    }), 200

@projects_bp.route("/<project_id>", methods=["DELETE"])
def delete_project(project_id: str):
    """Delete a project (PRD FR-1.3)."""
    success = db_repo.delete_project(project_id)
    if not success:
        return jsonify({"error": {"code": "PROJECT_NOT_FOUND", "message": f"Project '{project_id}' not found"}}), 404
    return jsonify({"message": "Project deleted successfully", "id": project_id}), 200
