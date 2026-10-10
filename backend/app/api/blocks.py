from flask import Blueprint, jsonify
from app.core.graph.catalog import catalog_instance

blocks_bp = Blueprint("blocks", __name__)

@blocks_bp.route("", methods=["GET"])
def get_blocks():
    """Retrieve block catalog and declarative specs grouped by category (PRD Section 13, 15)."""
    blocks = catalog_instance.list_blocks()
    categories = catalog_instance.get_categories()
    
    # Group blocks by category
    grouped = {}
    for cat in categories:
        grouped[cat] = [b for b in blocks if b.get("category") == cat]

    return jsonify({
        "categories": categories,
        "blocks": blocks,
        "grouped": grouped,
        "totalBlocks": len(blocks)
    }), 200

@blocks_bp.route("/<block_type>", methods=["GET"])
def get_block_by_type(block_type):
    """Retrieve spec for a specific block type."""
    spec = catalog_instance.get_block(block_type)
    if not spec:
        return jsonify({"error": {"code": "BLOCK_NOT_FOUND", "message": f"Block type '{block_type}' not found"}}), 404
    return jsonify({"spec": spec}), 200
