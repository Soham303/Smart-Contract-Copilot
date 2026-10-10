from flask import Blueprint, request, jsonify

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/prompt-to-graph", methods=["POST"])
def prompt_to_graph():
    """Prompt in, validated block graph out with preview diff (PRD FR-6.1 - 6.7)."""
    return jsonify({
        "graph": {"schemaVersion": "1.0", "target": "aptos-move", "blocks": [], "edges": []},
        "diff": {"addedBlocks": [], "modifiedBlocks": [], "removedBlocks": []}
    }), 200

@ai_bp.route("/explain-diagnostic", methods=["POST"])
def explain_diagnostic():
    """Diagnostic in, explanation and proposed patch out (PRD FR-7.5, Section 15)."""
    return jsonify({
        "explanation": "Diagnostic explanation...",
        "patch": "",
        "diffPreview": ""
    }), 200
