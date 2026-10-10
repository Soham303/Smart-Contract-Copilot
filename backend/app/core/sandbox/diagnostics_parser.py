import re
from typing import List, Dict, Any

class DiagnosticsParser:
    """Parses raw compiler output into structured diagnostics (PRD FR-7.2)."""

    def parse(self, compiler_output: str) -> List[Dict[str, Any]]:
        diagnostics = []
        # Pattern for Move compiler error/warning:
        # error[E01002]: ...
        #   ┌─ sources/token.move:12:5
        return diagnostics
