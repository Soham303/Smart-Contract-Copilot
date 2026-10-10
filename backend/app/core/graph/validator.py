from typing import Dict, Any, List, Optional
from .schema import ContractGraph
from .catalog import catalog_instance, BlockCatalog

class GraphValidator:
    """Validates Contract Graph according to PRD FR-2.7 & Section 12."""

    def __init__(self, catalog: Optional[BlockCatalog] = None):
        self.catalog = catalog or catalog_instance

    def validate(self, graph_dict: Dict[str, Any]) -> Dict[str, Any]:
        errors: List[str] = []
        warnings: List[str] = []

        try:
            graph = ContractGraph(**graph_dict)
        except Exception as e:
            return {"valid": False, "errors": [f"Schema validation error: {str(e)}"], "warnings": []}

        if not graph.blocks:
            warnings.append("Graph canvas is empty.")
            return {"valid": True, "errors": [], "warnings": warnings, "graph": graph.model_dump()}

        blocks_by_id = {b.id: b for b in graph.blocks}

        # 1. Validate individual blocks and properties
        for b in graph.blocks:
            spec = self.catalog.get_block(b.type)
            if not spec:
                errors.append(f"Block '{b.id}' uses unknown type '{b.type}'.")
                continue

            props_spec = spec.get("props", {})
            for prop_name, prop_def in props_spec.items():
                val = b.props.get(prop_name)
                # Check required
                if prop_def.get("required", False) and (val is None or val == ""):
                    errors.append(f"Block '{b.id}' ({b.type}) missing required property '{prop_name}'.")
                    continue

                if val is not None:
                    # Check type constraints
                    p_type = prop_def.get("type")
                    if p_type == "int":
                        if not isinstance(val, (int, float)):
                            errors.append(f"Block '{b.id}' property '{prop_name}' must be an integer.")
                        else:
                            if "min" in prop_def and val < prop_def["min"]:
                                errors.append(f"Block '{b.id}' property '{prop_name}' ({val}) below minimum {prop_def['min']}.")
                            if "max" in prop_def and val > prop_def["max"]:
                                errors.append(f"Block '{b.id}' property '{prop_name}' ({val}) exceeds maximum {prop_def['max']}.")
                    elif p_type == "enum":
                        allowed = prop_def.get("values", [])
                        if val not in allowed:
                            errors.append(f"Block '{b.id}' property '{prop_name}' has invalid value '{val}'. Allowed: {allowed}.")

        # 2. Validate edges and port compatibility (PRD FR-2.3)
        for idx, edge in enumerate(graph.edges):
            if edge.from_ not in blocks_by_id:
                errors.append(f"Edge {idx} references missing source block '{edge.from_}'.")
                continue
            if edge.to not in blocks_by_id:
                errors.append(f"Edge {idx} references missing target block '{edge.to}'.")
                continue

            from_block = blocks_by_id[edge.from_]
            to_block = blocks_by_id[edge.to]

            port_check = self.catalog.validate_port_connection(
                from_block_type=from_block.type,
                from_port_name=edge.fromPort,
                to_block_type=to_block.type,
                to_port_name=edge.toPort
            )

            if not port_check["compatible"]:
                errors.append(f"Invalid connection from '{from_block.id}' to '{to_block.id}': {port_check['reason']}.")

        # 3. Detect conflicting or duplicate blocks
        token_blocks = [b for b in graph.blocks if b.type in ["token.fungible", "nft.collection"]]
        if len(token_blocks) > 1:
            warnings.append("Multiple primary asset blocks detected (fungible/nft) on single module canvas.")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "graph": graph.model_dump()
        }
