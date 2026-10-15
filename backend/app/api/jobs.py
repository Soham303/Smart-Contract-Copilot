from flask import Blueprint, request, jsonify
from app.core.db.repository import db_repo
from app.workers.job_queue import job_queue
from app.workers.tasks import (
    process_compile_job,
    process_audit_job,
    process_gas_job,
    process_report_job,
)
from app.core.permissions.matrix import PermissionsMatrixBuilder
from app.core.permissions.explainer import PermissionsExplainer

jobs_bp = Blueprint("jobs", __name__)
matrix_builder = PermissionsMatrixBuilder()
explainer = PermissionsExplainer()

@jobs_bp.route("/<job_id>", methods=["GET"])
def get_job_status(job_id: str):
    """Poll job status, progress, and result (PRD Section 15)."""
    job = db_repo.get_job(job_id)
    if not job:
        return jsonify({"error": {"code": "JOB_NOT_FOUND", "message": f"Job '{job_id}' not found"}}), 404

    return jsonify({
        "jobId": job["id"],
        "projectId": job.get("projectId"),
        "type": job.get("type"),
        "status": job.get("status"),
        "progress": job.get("progress", 0),
        "message": job.get("message"),
        "result": job.get("result"),
        "error": job.get("error"),
        "startedAt": job.get("startedAt"),
        "finishedAt": job.get("finishedAt")
    }), 200

@jobs_bp.route("/compile", methods=["POST"])
def submit_compile_job():
    """Compile and test in isolated sandbox (PRD FR-7.1 - 7.6)."""
    payload = request.get_json() or {}
    project_id = payload.get("projectId", "default_project")
    package_files = payload.get("files", {})
    is_async = request.args.get("async", "").lower() in ["1", "true"]

    job = db_repo.create_job(project_id, "compile")

    if is_async:
        job_queue.enqueue(process_compile_job, job["id"], project_id, package_files)
        return jsonify({
            "jobId": job["id"],
            "status": "queued",
            "message": "Compilation job queued"
        }), 202

    # Synchronous processing
    res = process_compile_job(job["id"], project_id, package_files)
    return jsonify({
        "jobId": job["id"],
        "status": "completed",
        "result": res
    }), 200

@jobs_bp.route("/audit", methods=["POST"])
def submit_audit_job():
    """Run rule-based security audit over AST and graph (PRD FR-8.1 - 8.8)."""
    payload = request.get_json() or {}
    project_id = payload.get("projectId", "default_project")
    code = payload.get("code", "")
    graph = payload.get("graph", None)
    is_async = request.args.get("async", "").lower() in ["1", "true"]

    job = db_repo.create_job(project_id, "audit")

    if is_async:
        job_queue.enqueue(process_audit_job, job["id"], project_id, code, graph)
        return jsonify({
            "jobId": job["id"],
            "status": "queued",
            "message": "Audit job queued"
        }), 202

    res = process_audit_job(job["id"], project_id, code, graph)
    return jsonify({
        "jobId": job["id"],
        "status": "completed",
        "result": res
    }), 200

@jobs_bp.route("/gas", methods=["POST"])
def submit_gas_job():
    """Measure gas and generate verified optimizations (PRD FR-9.1 - 9.7)."""
    payload = request.get_json() or {}
    project_id = payload.get("projectId", "default_project")
    code = payload.get("code", "")
    is_async = request.args.get("async", "").lower() in ["1", "true"]

    job = db_repo.create_job(project_id, "gas")

    if is_async:
        job_queue.enqueue(process_gas_job, job["id"], project_id, code)
        return jsonify({
            "jobId": job["id"],
            "status": "queued",
            "message": "Gas analysis job queued"
        }), 202

    res = process_gas_job(job["id"], project_id, code)
    return jsonify({
        "jobId": job["id"],
        "status": "completed",
        "result": res
    }), 200

@jobs_bp.route("/report", methods=["POST"])
def submit_report_job():
    """Build PDF report (PRD FR-13.1 - 13.5)."""
    payload = request.get_json() or {}
    project_id = payload.get("projectId", "default_project")
    is_async = request.args.get("async", "").lower() in ["1", "true"]

    job = db_repo.create_job(project_id, "report")

    if is_async:
        job_queue.enqueue(process_report_job, job["id"], project_id, payload)
        return jsonify({
            "jobId": job["id"],
            "status": "queued",
            "message": "Report generation queued"
        }), 202

    res = process_report_job(job["id"], project_id, payload)
    return jsonify({
        "jobId": job["id"],
        "status": "completed",
        "result": res
    }), 200

@jobs_bp.route("/permissions", methods=["POST"])
def submit_permissions_job():
    """Build deterministic permissions matrix & explainer (PRD FR-12.1 - 12.8)."""
    payload = request.get_json() or {}
    graph = payload.get("graph", {})
    matrix = matrix_builder.build_matrix(graph)
    explanation = explainer.explain(matrix, graph)
    return jsonify({
        "jobId": "job_permissions_sync",
        "status": "completed",
        "result": {
            "matrix": matrix,
            **explanation
        }
    }), 200
