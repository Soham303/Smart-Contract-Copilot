from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class Finding(BaseModel):
    id: str
    ruleId: str
    title: str
    severity: str  # Critical, High, Medium, Low, Info
    blockId: Optional[str] = None
    file: Optional[str] = None
    line: Optional[int] = None
    message: str
    fix: Optional[str] = None
    autoFixPatch: Optional[str] = None
    conceptRef: Optional[str] = None  # Link to learning mode concept (PRD FR-14.5)

class BaseAuditRule(ABC):
    rule_id: str
    title: str
    severity: str
    description: str

    @abstractmethod
    def check(self, ast_or_code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        """Runs the rule check and returns any security findings (PRD FR-8.1, Section 17)."""
        pass
