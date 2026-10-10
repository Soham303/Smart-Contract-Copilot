from typing import Dict, Any, List

class SourceMap:
    """Maintains bi-directional mapping between block IDs and code line ranges (PRD FR-4.4)."""

    def __init__(self):
        self.block_to_lines: Dict[str, Dict[str, int]] = {}
        self.line_to_block: Dict[int, str] = {}

    def add_mapping(self, block_id: str, start_line: int, end_line: int):
        self.block_to_lines[block_id] = {
            "startLine": start_line,
            "endLine": end_line
        }
        for line in range(start_line, end_line + 1):
            self.line_to_block[line] = block_id

    def get_lines_for_block(self, block_id: str):
        return self.block_to_lines.get(block_id)

    def get_block_for_line(self, line: int):
        return self.line_to_block.get(line)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "blockToLines": self.block_to_lines,
            "lineToBlock": self.line_to_block
        }
