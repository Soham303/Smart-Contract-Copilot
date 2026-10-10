from flask import Blueprint, request, jsonify
from app.core.graph.schema import ContractGraph
from app.core.generator.targets.aptos import AptosMoveTarget

generate_bp = Blueprint("generate", __name__)
target = AptosMoveTarget()

@generate_bp.route("", methods=["POST"])
def generate_code():
    """Graph in, deterministic Move package and source map out (PRD FR-4.1 - 4.6, Section 15)."""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": {"code": "INVALID_PAYLOAD", "message": "Graph payload required"}}), 400

    try:
        graph = ContractGraph(**payload)
        files, source_map = target.generate(graph)
        return jsonify({
            "files": files,
            "sourceMap": source_map.to_dict(),
            "target": graph.target,
            "moduleName": graph.meta.moduleName
        }), 200
    except Exception as e:
        return jsonify({"error": {"code": "GENERATION_FAILED", "message": str(e)}}), 500
