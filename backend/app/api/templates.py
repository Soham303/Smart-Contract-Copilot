from flask import Blueprint, jsonify
from app.core.graph.catalog import catalog_instance

templates_bp = Blueprint("templates", __name__)

@templates_bp.route("", methods=["GET"])
def get_templates():
    """Retrieve pre-wired templates list (public) (PRD FR-3.3, Section 15)."""
    templates = catalog_instance.list_templates()
    return jsonify({
        "templates": templates,
        "count": len(templates)
    }), 200

@templates_bp.route("/<template_id>", methods=["GET"])
def get_template(template_id):
    """Retrieve a specific template with its pre-wired graph."""
    tmpl = catalog_instance.get_template(template_id)
    if not tmpl:
        return jsonify({"error": {"code": "TEMPLATE_NOT_FOUND", "message": f"Template '{template_id}' not found"}}), 404
    return jsonify({"template": tmpl}), 200
