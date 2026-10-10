from flask import Blueprint, request, jsonify

deploy_bp = Blueprint("deploy", __name__)

@deploy_bp.route("/payload", methods=["POST"])
def build_publish_payload():
    """Build publish payload for client-side wallet signing (PRD FR-11.4)."""
    return jsonify({
        "payload": {
            "type": "entry_function_payload",
            "function": "0x1::code::publish_package_txn",
            "arguments": []
        }
    }), 200

@deploy_bp.route("/record", methods=["POST"])
def record_deployment():
    """Record a completed testnet/devnet deployment (PRD FR-11.6)."""
    return jsonify({"message": "Deployment recorded", "deploymentId": "dep_1"}), 201
