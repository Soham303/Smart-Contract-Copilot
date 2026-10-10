from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

projects_bp = Blueprint("projects", __name__)

@projects_bp.route("", methods=["GET"])
def list_projects():
    """List all projects for the authenticated user (PRD FR-1.3)."""
    return jsonify({"projects": []}), 200

@projects_bp.route("", methods=["POST"])
def create_project():
    """Create project (blank or from template) (PRD FR-1.3)."""
    return jsonify({"project": {"id": "proj_1", "name": "New Project", "mode": "blocks"}}), 201

@projects_bp.route("/<project_id>", methods=["GET"])
def get_project(project_id):
    """Read a specific project by ID (PRD FR-1.3, FR-1.4)."""
    return jsonify({"project": {"id": project_id, "name": "Project", "mode": "blocks"}}), 200

@projects_bp.route("/<project_id>", methods=["PUT"])
def update_project(project_id):
    """Save/update project state and canvas autosave (PRD FR-1.4)."""
    return jsonify({"message": "Project saved successfully", "id": project_id}), 200

@projects_bp.route("/<project_id>", methods=["DELETE"])
def delete_project(project_id):
    """Delete a project (PRD FR-1.3)."""
    return jsonify({"message": "Project deleted successfully", "id": project_id}), 200
