import os
import json
from flask import Blueprint, jsonify

concepts_bp = Blueprint("concepts", __name__)

@concepts_bp.route("", methods=["GET"])
def get_concepts():
    """Retrieve Learning mode concept cards (public) (PRD FR-14.1 - 14.6, Section 15)."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    concepts_file = os.path.join(base_dir, "specs", "concepts", "concepts.json")
    try:
        with open(concepts_file, "r", encoding="utf-8") as f:
            concepts = json.load(f)
        return jsonify({"concepts": concepts}), 200
    except Exception as e:
        return jsonify({"concepts": [], "error": str(e)}), 200
