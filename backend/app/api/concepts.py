from flask import Blueprint, jsonify

concepts_bp = Blueprint("concepts", __name__)

@concepts_bp.route("", methods=["GET"])
def get_concepts():
    """Retrieve Learning mode concept cards (public) (PRD FR-14.1 - 14.6, Section 15)."""
    return jsonify({"concepts": []}), 200
