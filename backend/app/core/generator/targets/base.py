from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
from app.core.graph.schema import ContractGraph
from app.core.generator.source_map import SourceMap

class Target(ABC):
    """Abstract Target interface for code generators (PRD FR-4.6)."""

    @abstractmethod
    def generate(self, graph: ContractGraph) -> Tuple[Dict[str, str], SourceMap]:
        """Takes a ContractGraph and outputs package files and a SourceMap."""
        pass
