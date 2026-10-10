from flask import Blueprint, request, jsonify
from app.core.graph.validator import GraphValidator

graph_bp = Blueprint("graph", __name__)
validator = GraphValidator()

@graph_bp.route("/validate", methods=["POST"])
def validate_graph():
    """Validate a contract graph against schema, property rules, and port constraints (PRD FR-2.7, Section 15)."""
    payload = request.get_json()
    if not payload:
        return jsonify({"valid": False, "errors": ["No graph payload provided"], "warnings": []}), 400

    result = validator.validate(payload)
    status_code = 200 if result["valid"] else 422
    return jsonify(result), status_code
