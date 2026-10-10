from flask import Blueprint, request, jsonify, Response
from app.core.report.pdf_generator import pdf_generator_instance

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/generate", methods=["POST"])
def generate_report():
    """Generates a full branded audit report (PRD FR-13.1 - 13.5)."""
    payload = request.get_json() or {}
    project_name = payload.get("projectName", "My Contract")
    audit_data = payload.get("audit", {})
    gas_data = payload.get("gas", {})
    permissions_data = payload.get("permissions", {})

    html_content = pdf_generator_instance.generate_html_report(
        project_name=project_name,
        audit_data=audit_data,
        gas_data=gas_data,
        permissions_data=permissions_data
    )

    return jsonify({
        "reportId": "rep_latest",
        "html": html_content
    }), 200

@reports_bp.route("/<report_id>/download", methods=["POST"])
def download_report_html(report_id):
    """Download HTML report formatted for printing/PDF export."""
    payload = request.get_json() or {}
    project_name = payload.get("projectName", "My Contract")
    audit_data = payload.get("audit", {})
    gas_data = payload.get("gas", {})
    permissions_data = payload.get("permissions", {})

    html_content = pdf_generator_instance.generate_html_report(
        project_name=project_name,
        audit_data=audit_data,
        gas_data=gas_data,
        permissions_data=permissions_data
    )
    return Response(html_content, mimetype="text/html", headers={"Content-Disposition": "attachment;filename=audit_report.html"})
