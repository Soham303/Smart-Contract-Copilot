from flask import Blueprint, jsonify

templates_bp = Blueprint("templates", __name__)

@templates_bp.route("", methods=["GET"])
def get_templates():
    """Retrieve pre-wired templates list (public) (PRD FR-3.3, Section 15)."""
    return jsonify({"templates": []}), 200
