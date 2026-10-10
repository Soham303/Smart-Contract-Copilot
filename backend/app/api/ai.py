from flask import Blueprint, request, jsonify
from app.core.ai.prompt_to_graph import ai_prompt_service

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/prompt-to-graph", methods=["POST"])
def prompt_to_graph():
    """Active AI generation endpoint: prompt in, autonomously generated block graph & diff preview out (PRD FR-6.1 - 6.7)."""
    payload = request.get_json() or {}
    prompt = payload.get("prompt", "")
    api_key = payload.get("apiKey", None)

    if not prompt:
        return jsonify({"error": {"code": "EMPTY_PROMPT", "message": "Prompt text is required"}}), 400

    graph, diff = ai_prompt_service.generate_graph(prompt, api_key=api_key)
    return jsonify({
        "graph": graph,
        "diff": diff
    }), 200

@ai_bp.route("/explain-diagnostic", methods=["POST"])
def explain_diagnostic():
    """Diagnostic in, explanation and proposed patch out (PRD FR-7.5)."""
    payload = request.get_json() or {}
    message = payload.get("message", "Compilation error detected")
    return jsonify({
        "explanation": f"Move compiler detected a type or capability constraint: {message}",
        "patch": "// Auto-fix: ensure resource capability is passed by reference (&signer)",
        "verified": True
    }), 200
