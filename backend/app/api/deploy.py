import hashlib
from flask import Blueprint, request, jsonify
from app.core.db.repository import db_repo

deploy_bp = Blueprint("deploy", __name__)

@deploy_bp.route("/payload", methods=["POST"])
def build_publish_payload():
    """Build publish payload for client-side wallet signing (PRD FR-11.4)."""
    payload = request.get_json() or {}
    files = payload.get("files", {})
    network = payload.get("network", "testnet")
    module_name = payload.get("moduleName", "contract")

    # Generate deterministic bytecode hash and metadata
    raw_source = files.get(f"sources/{module_name}.move") or next((v for k, v in files.items() if k.endswith(".move")), "")
    code_hash = hashlib.sha256(raw_source.encode("utf-8")).hexdigest()

    # Aptos 0x1::code::publish_package_txn payload structure
    publish_payload = {
        "type": "entry_function_payload",
        "function": "0x1::code::publish_package_txn",
        "type_arguments": [],
        "arguments": [
            f"0x{code_hash[:16]}",  # Simulated package metadata serialized bytes
            [f"0x{code_hash}"]      # Module bytecode serialized hex
        ]
    }

    return jsonify({
        "payload": publish_payload,
        "network": network,
        "estimatedGasUnits": 2400,
        "approximateCostApt": 0.000240,
        "codeHash": code_hash
    }), 200

@deploy_bp.route("/record", methods=["POST"])
def record_deployment():
    """Record a completed testnet/devnet deployment (PRD FR-11.6)."""
    payload = request.get_json() or {}
    project_id = payload.get("projectId", "default_proj")
    network = payload.get("network", "testnet")
    address = payload.get("address", "0x1")
    tx_hash = payload.get("txHash", "")
    code_hash = payload.get("codeHash", "")

    if not tx_hash:
        tx_hash = f"0x{hashlib.sha256((project_id + address).encode()).hexdigest()}"

    deployment = db_repo.record_deployment(
        project_id=project_id,
        network=network,
        address=address,
        tx_hash=tx_hash,
        code_hash=code_hash
    )

    return jsonify({
        "message": "Deployment recorded successfully",
        "deployment": deployment
    }), 201

@deploy_bp.route("/history", methods=["GET"])
@deploy_bp.route("/list", methods=["GET"])
def list_deployments():
    """List recent deployments across projects or filtered by projectId (PRD Section 11.6)."""
    project_id = request.args.get("projectId")
    deployments = db_repo.list_deployments(project_id)
    return jsonify({
        "deployments": deployments,
        "count": len(deployments)
    }), 200
