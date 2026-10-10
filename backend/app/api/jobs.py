from flask import Blueprint, request, jsonify
from app.core.audit.engine import audit_engine_instance
from app.core.gas.analyzer import GasAnalyzer
from app.core.gas.optimizer import GasOptimizer
from app.core.permissions.matrix import PermissionsMatrixBuilder
from app.core.permissions.explainer import PermissionsExplainer
from app.core.sandbox.runner import SandboxRunner

jobs_bp = Blueprint("jobs", __name__)

gas_analyzer = GasAnalyzer()
gas_optimizer = GasOptimizer()
matrix_builder = PermissionsMatrixBuilder()
explainer = PermissionsExplainer()
sandbox_runner = SandboxRunner()

@jobs_bp.route("/compile", methods=["POST"])
def submit_compile_job():
    """Compile and test in isolated sandbox (PRD FR-7.1 - 7.6)."""
    payload = request.get_json() or {}
    package_files = payload.get("files", {})
    result = sandbox_runner.compile(package_files)
    return jsonify({
        "jobId": "job_compile_done",
        "status": "completed",
        "result": result
    }), 200

@jobs_bp.route("/audit", methods=["POST"])
def submit_audit_job():
    """Run rule-based security audit over AST and graph (PRD FR-8.1 - 8.8)."""
    payload = request.get_json() or {}
    code = payload.get("code", "")
    graph = payload.get("graph", None)
    result = audit_engine_instance.run_audit(code, graph)
    return jsonify({
        "jobId": "job_audit_done",
        "status": "completed",
        "result": result
    }), 200

@jobs_bp.route("/gas", methods=["POST"])
def submit_gas_job():
    """Measure gas and generate verified optimizations (PRD FR-9.1 - 9.7)."""
    payload = request.get_json() or {}
    code = payload.get("code", "")
    analysis = gas_analyzer.analyze_contract(code)
    optimizations = gas_optimizer.get_optimizations(code)
    return jsonify({
        "jobId": "job_gas_done",
        "status": "completed",
        "result": {
            **analysis,
            "optimizations": optimizations
        }
    }), 200

@jobs_bp.route("/permissions", methods=["POST"])
def submit_permissions_job():
    """Build deterministic permissions matrix & explainer (PRD FR-12.1 - 12.8)."""
    payload = request.get_json() or {}
    graph = payload.get("graph", {})
    matrix = matrix_builder.build_matrix(graph)
    explanation = explainer.explain(matrix, graph)
    return jsonify({
        "jobId": "job_permissions_done",
        "status": "completed",
        "result": {
            "matrix": matrix,
            **explanation
        }
    }), 200
