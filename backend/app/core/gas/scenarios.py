from typing import Dict, Any, List

class ScenarioRunner:
    """Manages scenario inputs for measuring function gas (PRD Section 18)."""

    def __init__(self):
        self.default_scenarios = {
            "token.mint": {"amount": 100},
            "token.burn": {"amount": 50},
            "token.transfer": {"amount": 10}
        }
