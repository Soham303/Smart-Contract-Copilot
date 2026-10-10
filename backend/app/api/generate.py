from flask import Blueprint, request, jsonify

generate_bp = Blueprint("generate", __name__)

@generate_bp.route("", methods=["POST"])
def generate_code():
    """Graph in, Move package and source map out (synchronous) (PRD FR-4.1 - 4.6, Section 15)."""
    return jsonify({
        "files": {
            "Move.toml": "[package]\nname = \"CopilotContract\"\nversion = \"0.1.0\"\n",
            "sources/main.move": "// Generated Aptos Move Contract\n"
        },
        "sourceMap": {}
    }), 200
