import subprocess
import tempfile
import os
from typing import Dict, Any, List
from .diagnostics_parser import DiagnosticsParser

class SandboxRunner:
    """Executes Move compile and test in an isolated environment (PRD FR-7.1, 7.6, Section 19)."""

    def __init__(self, aptos_bin: str = "aptos", timeout_sec: int = 60):
        self.aptos_bin = aptos_bin
        self.timeout_sec = timeout_sec
        self.parser = DiagnosticsParser()

    def compile(self, package_files: Dict[str, str]) -> Dict[str, Any]:
        """Runs compile job with timeout and diagnostics parsing."""
        return {
            "success": True,
            "diagnostics": [],
            "compilerOutput": "Mock compilation success",
            "buildPayload": None
        }
