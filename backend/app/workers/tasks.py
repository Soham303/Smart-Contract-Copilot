import time
from typing import Dict, Any, Optional
from app.core.db.repository import db_repo
from app.core.audit.engine import audit_engine_instance
from app.core.gas.analyzer import GasAnalyzer
from app.core.gas.optimizer import GasOptimizer
from app.core.sandbox.runner import SandboxRunner
from app.core.report.pdf_generator import pdf_generator_instance

sandbox_runner = SandboxRunner()
gas_analyzer = GasAnalyzer()
gas_optimizer = GasOptimizer()

def process_compile_job(job_id: str, project_id: str, package_files: Dict[str, str]):
    """Async worker task for compilation (PRD FR-7.1 - 7.6)."""
    try:
        db_repo.update_job(job_id, status="processing", progress=20, message="Invoking isolated compiler runner...")
        result = sandbox_runner.compile(package_files)
        db_repo.update_job(job_id, status="completed", progress=100, result=result, message="Compilation completed")
        return result
    except Exception as e:
        db_repo.update_job(job_id, status="failed", progress=100, error=str(e), message="Compilation failed")
        raise

def process_audit_job(job_id: str, project_id: str, code: str, graph: Optional[Dict[str, Any]] = None):
    """Async worker task for security audit (PRD FR-8.1 - 8.8)."""
    try:
        db_repo.update_job(job_id, status="processing", progress=30, message="Executing rule-based static analyzer...")
        result = audit_engine_instance.run_audit(code, graph)
        db_repo.update_job(job_id, status="completed", progress=100, result=result, message="Security audit completed")
        return result
    except Exception as e:
        db_repo.update_job(job_id, status="failed", progress=100, error=str(e), message="Audit failed")
        raise

def process_gas_job(job_id: str, project_id: str, code: str):
    """Async worker task for gas analysis & optimization (PRD FR-9.2, 9.4)."""
    try:
        db_repo.update_job(job_id, status="processing", progress=40, message="Profiling entry function execution costs...")
        analysis = gas_analyzer.analyze_contract(code)
        optimizations = gas_optimizer.get_optimizations(code)
        result = {
            **analysis,
            "optimizations": optimizations
        }
        db_repo.update_job(job_id, status="completed", progress=100, result=result, message="Gas profiling completed")
        return result
    except Exception as e:
        db_repo.update_job(job_id, status="failed", progress=100, error=str(e), message="Gas profiling failed")
        raise

def process_report_job(job_id: str, project_id: str, payload: Dict[str, Any]):
    """Async worker task for PDF report generation (PRD FR-13.4)."""
    try:
        db_repo.update_job(job_id, status="processing", progress=35, message="Rendering report template and security score...")
        project_name = payload.get("projectName", "My Contract")
        audit_data = payload.get("audit", {})
        gas_data = payload.get("gas", {})
        permissions_data = payload.get("permissions", {})

        html = pdf_generator_instance.generate_html_report(project_name, audit_data, gas_data, permissions_data)
        pdf_bytes = pdf_generator_instance.generate_pdf_report(project_name, audit_data, gas_data, permissions_data)
        
        result = {
            "html": html,
            "hasPdf": pdf_bytes is not None,
            "reportId": f"rep_{job_id}"
        }
        db_repo.update_job(job_id, status="completed", progress=100, result=result, message="Report generated successfully")
        return result
    except Exception as e:
        db_repo.update_job(job_id, status="failed", progress=100, error=str(e), message="Report generation failed")
        raise
