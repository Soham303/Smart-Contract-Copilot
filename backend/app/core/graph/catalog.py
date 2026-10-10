import os
import json
from typing import Dict, Any, List, Optional

class BlockCatalog:
    """Loads and provides access to declarative block specifications and templates (PRD Section 9.3, 13)."""

    def __init__(self, specs_dir: Optional[str] = None):
        if not specs_dir:
            # catalog.py is at: backend/app/core/graph/catalog.py -> need backend/specs
            current_dir = os.path.dirname(os.path.abspath(__file__))
            backend_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
            specs_dir = os.path.join(backend_dir, "specs")
        self.specs_dir = specs_dir
        self.blocks: Dict[str, Dict[str, Any]] = {}
        self.templates: Dict[str, Dict[str, Any]] = {}
        self.load_catalog()

    def load_catalog(self):
        self.blocks.clear()
        self.templates.clear()

        blocks_dir = os.path.join(self.specs_dir, "blocks")
        if os.path.exists(blocks_dir):
            for root, _, files in os.walk(blocks_dir):
                for file in files:
                    if file.endswith(".json"):
                        filepath = os.path.join(root, file)
                        try:
                            with open(filepath, "r", encoding="utf-8") as f:
                                spec = json.load(f)
                                if "type" in spec:
                                    self.blocks[spec["type"]] = spec
                        except Exception as e:
                            print(f"Error loading block spec {filepath}: {e}")

        templates_dir = os.path.join(self.specs_dir, "templates")
        if os.path.exists(templates_dir):
            for file in os.listdir(templates_dir):
                if file.endswith(".json"):
                    filepath = os.path.join(templates_dir, file)
                    try:
                        with open(filepath, "r", encoding="utf-8") as f:
                            tmpl = json.load(f)
                            if "id" in tmpl:
                                self.templates[tmpl["id"]] = tmpl
                    except Exception as e:
                        print(f"Error loading template {filepath}: {e}")

    def get_block(self, block_type: str) -> Optional[Dict[str, Any]]:
        return self.blocks.get(block_type)

    def list_blocks(self) -> List[Dict[str, Any]]:
        return list(self.blocks.values())

    def list_templates(self) -> List[Dict[str, Any]]:
        return list(self.templates.values())

    def get_template(self, template_id: str) -> Optional[Dict[str, Any]]:
        return self.templates.get(template_id)

    def get_categories(self) -> List[str]:
        categories = set(b.get("category", "Logic") for b in self.blocks.values())
        return sorted(list(categories))

    def validate_port_connection(self, from_block_type: str, from_port_name: str, to_block_type: str, to_port_name: str) -> Dict[str, Any]:
        """Validates typed port connections according to PRD FR-2.3."""
        from_spec = self.get_block(from_block_type)
        to_spec = self.get_block(to_block_type)

        if not from_spec:
            return {"compatible": False, "reason": f"Unknown source block type: '{from_block_type}'"}
        if not to_spec:
            return {"compatible": False, "reason": f"Unknown target block type: '{to_block_type}'"}

        out_ports = {p["name"]: p for p in from_spec.get("ports", {}).get("out", [])}
        in_ports = {p["name"]: p for p in to_spec.get("ports", {}).get("in", [])}

        if from_port_name not in out_ports:
            return {"compatible": False, "reason": f"Block '{from_block_type}' has no output port '{from_port_name}'"}
        if to_port_name not in in_ports:
            return {"compatible": False, "reason": f"Block '{to_block_type}' has no input port '{to_port_name}'"}

        from_type = out_ports[from_port_name]["type"]
        to_type = in_ports[to_port_name]["type"]

        # Universal compatibility or exact type match
        if from_type == to_type or to_type == "Any" or from_type == "Any":
            return {"compatible": True, "portType": from_type}

        # Subtype / compatible access rules
        compatible_groups = [
            {"AccessGate", "OwnerRef", "RoleRef"},
            {"MintGate", "MintRulesConfig"},
            {"TokenRef", "FinanceRef"}
        ]
        for group in compatible_groups:
            if from_type in group and to_type in group:
                return {"compatible": True, "portType": to_type}

        return {
            "compatible": False,
            "reason": f"Incompatible port types: '{from_port_name}' outputs '{from_type}', but '{to_port_name}' expects '{to_type}'"
        }

catalog_instance = BlockCatalog()
