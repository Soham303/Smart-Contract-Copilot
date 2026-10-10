import re
from typing import List, Dict, Any, Optional
from .base import BaseAuditRule, Finding

class PrivilegedSignerCheckRule(BaseAuditRule):
    rule_id = "SC-001"
    title = "Privileged entry function lacks signer or capability check"
    severity = "Critical"
    description = "Entry functions performing administrative state updates must authenticate the caller via signer::address_of or capability resource checks."

    def check(self, code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        findings = []
        # Check if entry function mints or mutates without checking AdminCapability or signer
        if "public entry fun mint" in code:
            if "AdminCapability" not in code and "signer::address_of" not in code:
                findings.append(Finding(
                    id="f_sc001_mint",
                    ruleId=self.rule_id,
                    title=self.title,
                    severity=self.severity,
                    message="Function 'mint' can be called by anyone without AdminCapability authorization check.",
                    fix="Add 'assert!(exists<AdminCapability>(signer::address_of(caller)), ENOT_AUTHORIZED);'",
                    conceptRef="capability"
                ))
        return findings

class UnrestrictedMintSupplyRule(BaseAuditRule):
    rule_id = "SC-002"
    title = "Unrestricted mint or supply inflation"
    severity = "Critical"
    description = "Mint function must enforce total supply bounds against max_supply."

    def check(self, code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        findings = []
        if "public entry fun mint" in code and "total_minted" in code:
            if "EEXCEEDS_CAP" not in code and "<=" not in code:
                findings.append(Finding(
                    id="f_sc002_inflation",
                    ruleId=self.rule_id,
                    title=self.title,
                    severity=self.severity,
                    message="Mint function increases total_minted without asserting cap boundary.",
                    fix="Ensure 'assert!(asset.total_minted + amount <= max_supply, EEXCEEDS_CAP);' is evaluated.",
                    conceptRef="resource"
                ))
        return findings

class CapabilityLeakRule(BaseAuditRule):
    rule_id = "SC-003"
    title = "Capability or admin resource exposed through public function"
    severity = "Critical"
    description = "Never return or transfer capability resources from public non-entry functions."

    def check(self, code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        findings = []
        for line_num, line in enumerate(code.splitlines(), start=1):
            if re.search(r"public\s+fun\s+\w+\s*\(.*\)\s*:\s*(AdminCapability|MintRef|BurnRef)", line):
                findings.append(Finding(
                    id=f"f_sc003_{line_num}",
                    ruleId=self.rule_id,
                    title=self.title,
                    severity=self.severity,
                    line=line_num,
                    message=f"Public function exposes privileged capability return value on line {line_num}.",
                    fix="Restrict function visibility to internal/friend or remove capability exposure.",
                    conceptRef="capability"
                ))
        return findings

class CentralizedWithdrawRule(BaseAuditRule):
    rule_id = "SC-004"
    title = "Funds withdrawable by owner with no limit or timelock"
    severity = "High"
    description = "Unrestricted owner drain functions represent high centralization risk."

    def check(self, code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        findings = []
        if "fun withdraw_all" in code or ("withdraw" in code and "AdminCapability" in code and "timelock" not in code):
            findings.append(Finding(
                id="f_sc004_centralized_withdraw",
                ruleId=self.rule_id,
                title=self.title,
                severity=self.severity,
                message="Owner has immediate power to withdraw all treasury funds without timelock or multisig.",
                fix="Implement a 24-48 hour TimeLock delay or multi-approval requirement before withdrawals.",
                conceptRef="signer"
            ))
        return findings

class UnboundedFeeRule(BaseAuditRule):
    rule_id = "SC-006"
    title = "Unbounded fee or royalty parameter"
    severity = "High"
    description = "Transfer fees or secondary royalties exceeding 1000 basis points (10%) must be capped."

    def check(self, code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        findings = []
        if graph:
            for b in graph.get("blocks", []):
                bps = b.get("props", {}).get("bps")
                if bps is not None and bps > 1000:
                    findings.append(Finding(
                        id=f"f_sc006_{b.get('id')}",
                        ruleId=self.rule_id,
                        title=self.title,
                        severity=self.severity,
                        blockId=b.get("id"),
                        message=f"Block '{b.get('id')}' specifies {bps} basis points ({(bps/100):.1f}%), exceeding 10% maximum security bound.",
                        fix="Reduce bps to 1000 or below.",
                        conceptRef="fungible-asset"
                    ))
        return findings

class EmergencyPauseMechanismRule(BaseAuditRule):
    rule_id = "SC-012"
    title = "No emergency pause mechanism on value-holding contract"
    severity = "Medium"
    description = "Value-holding contracts should maintain an emergency circuit breaker."

    def check(self, code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        findings = []
        if "ManagedFungibleAsset" in code and "PauseControl" not in code:
            findings.append(Finding(
                id="f_sc012_no_pause",
                ruleId=self.rule_id,
                title=self.title,
                severity=self.severity,
                message="Contract manages fungible assets but does not incorporate a Pausable emergency switch.",
                fix="Connect a Freeze / Pause block to enable circuit breaking if malicious transactions are detected.",
                conceptRef="capability"
            ))
        return findings

class MissingEventEmissionRule(BaseAuditRule):
    rule_id = "SC-013"
    title = "State-changing function emits no event"
    severity = "Low"
    description = "Entry functions updating on-chain balances or parameters should emit events for indexers."

    def check(self, code: str, graph: Optional[Dict[str, Any]] = None) -> List[Finding]:
        findings = []
        if "public entry fun" in code and "event::emit" not in code:
            findings.append(Finding(
                id="f_sc013_no_event",
                ruleId=self.rule_id,
                title=self.title,
                severity=self.severity,
                message="State changing entry functions do not emit tracking events.",
                fix="Add aptos_framework::event::emit to notify off-chain indexers and wallets.",
                conceptRef="abilities"
            ))
        return findings

# Instantiate complete rules suite
ALL_RULES = [
    PrivilegedSignerCheckRule(),
    UnrestrictedMintSupplyRule(),
    CapabilityLeakRule(),
    CentralizedWithdrawRule(),
    UnboundedFeeRule(),
    EmergencyPauseMechanismRule(),
    MissingEventEmissionRule()
]
