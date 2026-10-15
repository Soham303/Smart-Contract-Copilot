import uuid
from flask import Blueprint, request, jsonify, Response
from app.core.report.pdf_generator import pdf_generator_instance
from app.core.db.repository import db_repo

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/generate", methods=["POST"])
def generate_report():
    """Generates a full branded audit report and stores it in database (PRD FR-13.1 - 13.5)."""
    payload = request.get_json() or {}
    project_name = payload.get("projectName", "My Contract")
    audit_data = payload.get("audit", {})
    gas_data = payload.get("gas", {})
    permissions_data = payload.get("permissions", {})

    report_id = f"rep_{uuid.uuid4().hex[:10]}"

    html_content = pdf_generator_instance.generate_html_report(
        project_name=project_name,
        audit_data=audit_data,
        gas_data=gas_data,
        permissions_data=permissions_data
    )

    pdf_bytes = pdf_generator_instance.generate_pdf_report(
        project_name=project_name,
        audit_data=audit_data,
        gas_data=gas_data,
        permissions_data=permissions_data
    )

    # Persist in DB repo
    try:
        db_repo.save_report(
            report_id=report_id,
            project_name=project_name,
            audit_data=audit_data,
            gas_data=gas_data,
            permissions_data=permissions_data,
            html=html_content,
            pdf_bytes=pdf_bytes,
        )
    except Exception as e:
        print(f"Report persistence warning: {e}")

    return jsonify({
        "reportId": report_id,
        "html": html_content,
        "downloadPdfUrl": f"/reports/{report_id}/pdf"
    }), 200

@reports_bp.route("/<report_id>/pdf", methods=["GET"])
def get_report_pdf(report_id):
    """Download binary PDF audit report (PRD FR-13.4)."""
    report = db_repo.get_report(report_id)
    if report and "pdfBytes" in report:
        pdf_bytes = report["pdfBytes"]
    else:
        # Fallback generate default report
        pdf_bytes = pdf_generator_instance.generate_pdf_report(
            project_name=report.get("projectName", "Smart Contract") if report else "Smart Contract",
            audit_data={"riskScore": 100, "riskBand": "Low", "findings": []},
            gas_data={"entries": []},
            permissions_data={"matrix": []}
        )

    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="audit-report-{report_id}.pdf"',
            "Content-Type": "application/pdf"
        }
    )

@reports_bp.route("/export-pdf", methods=["POST"])
def export_pdf_direct():
    """Generates and returns binary PDF directly from current canvas payload."""
    payload = request.get_json() or {}
    project_name = payload.get("projectName", "Smart Contract")
    audit_data = payload.get("audit", {})
    gas_data = payload.get("gas", {})
    permissions_data = payload.get("permissions", {})

    pdf_bytes = pdf_generator_instance.generate_pdf_report(
        project_name=project_name,
        audit_data=audit_data,
        gas_data=gas_data,
        permissions_data=permissions_data
    )

    safe_name = "".join(c for c in project_name if c.isalnum() or c in ('_', '-')) or "audit_report"

    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{safe_name}_audit_report.pdf"',
            "Content-Type": "application/pdf"
        }
    )

@reports_bp.route("/<report_id>/download", methods=["POST", "GET"])
def download_report_html(report_id):
    """Download HTML report formatted for printing/export."""
    payload = request.get_json() or {} if request.method == "POST" else {}
    report = db_repo.get_report(report_id)
    if report and "html" in report:
        html_content = report["html"]
    else:
        project_name = payload.get("projectName", "My Contract")
        html_content = pdf_generator_instance.generate_html_report(
            project_name=project_name,
            audit_data=payload.get("audit", {}),
            gas_data=payload.get("gas", {}),
            permissions_data=payload.get("permissions", {})
        )

    return Response(
        html_content,
        mimetype="text/html",
        headers={"Content-Disposition": f'attachment; filename="audit-report-{report_id}.html"'}
    )
