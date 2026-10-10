from typing import Dict, Any

def process_compile_job(job_id: str, project_id: str, package_files: Dict[str, str]):
    """Async worker task for compilation (PRD FR-7.1)."""
    pass

def process_audit_job(job_id: str, project_id: str, code: str, graph: Dict[str, Any]):
    """Async worker task for security audit (PRD FR-8.1)."""
    pass

def process_gas_job(job_id: str, project_id: str, code: str):
    """Async worker task for gas analysis & optimization (PRD FR-9.2)."""
    pass

def process_report_job(job_id: str, project_id: str):
    """Async worker task for PDF report generation (PRD FR-13.4)."""
    pass
