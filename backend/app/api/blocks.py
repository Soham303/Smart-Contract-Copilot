from flask import Blueprint, jsonify

blocks_bp = Blueprint("blocks", __name__)

@blocks_bp.route("", methods=["GET"])
def get_blocks():
    """Retrieve block catalog and declarative specs (public) (PRD Section 13, 15)."""
    return jsonify({"categories": [], "blocks": []}), 200
