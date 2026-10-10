from typing import Dict, Any

class PDFReportGenerator:
    """Generates reproducible branded audit reports in HTML / PDF formats (PRD FR-13.1 - 13.4)."""

    def __init__(self, tool_version: str = "1.0.0", ruleset_version: str = "1.0.0"):
        self.tool_version = tool_version
        self.ruleset_version = ruleset_version

    def generate_html_report(self, project_name: str, audit_data: Dict[str, Any], gas_data: Dict[str, Any], permissions_data: Dict[str, Any]) -> str:
        findings = audit_data.get("findings", [])
        risk_score = audit_data.get("riskScore", 100)
        risk_band = audit_data.get("riskBand", "Low")
        
        findings_html = ""
        for f in findings:
            sev_color = "#ef4444" if f.get("severity") in ["Critical", "High"] else "#f59e0b"
            findings_html += f"""
            <div style="border-left: 4px solid {sev_color}; padding: 10px 16px; margin-bottom: 12px; background: #f8fafc; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>[{f.get('ruleId')}] {f.get('title')}</span>
                    <span style="color: {sev_color};">{f.get('severity')}</span>
                </div>
                <p style="margin: 6px 0; color: #334155;">{f.get('message')}</p>
                {f'<p style="margin: 4px 0; color: #16a34a; font-size: 0.9em;"><strong>Recommended Fix:</strong> {f.get("fix")}</p>' if f.get("fix") else ''}
            </div>
            """

        matrix_rows = ""
        for row in permissions_data.get("matrix", []):
            matrix_rows += f"""
            <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">{row.get('action')}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">{row.get('actor')}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">{row.get('details', '')}</td>
            </tr>
            """

        gas_rows = ""
        for entry in gas_data.get("entries", []):
            gas_rows += f"""
            <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">{entry.get('function')}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">{entry.get('gasUnits')} units</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #2563eb;">{entry.get('approximateApt', 0):.6f} APT</td>
            </tr>
            """

        key_answers = permissions_data.get("keyAnswers", {})

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Smart Contract Copilot - Security Audit Report</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #0f172a; margin: 40px; }}
        h1, h2, h3 {{ color: #0f172a; }}
        .header {{ border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }}
        .risk-card {{ display: inline-block; padding: 16px 24px; border-radius: 8px; background: #eff6ff; border: 1px solid #bfdbfe; margin-bottom: 24px; }}
        table {{ width: 100%; border-collapse: collapse; margin-bottom: 24px; }}
        th {{ background: #f1f5f9; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; }}
        .disclaimer {{ background: #fffbeb; border: 1px solid #fde68a; padding: 14px; border-radius: 6px; color: #92400e; font-size: 0.85em; margin-top: 40px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Smart Contract Copilot • Audit Report</h1>
        <p><strong>Project:</strong> {project_name} | <strong>Target:</strong> Aptos Move (Testnet) | <strong>Tool Version:</strong> v{self.tool_version}</p>
    </div>

    <div class="risk-card">
        <h2 style="margin: 0; font-size: 2rem; color: #1d4ed8;">Risk Score: {risk_score} / 100 ({risk_band} Risk)</h2>
        <p style="margin: 4px 0 0 0; color: #64748b;">Automated rule-based static analysis against Move & Aptos security standards.</p>
    </div>

    <h2>1. Security Findings</h2>
    {findings_html if findings_html else '<p style="color: #16a34a;">✅ Zero security findings detected. Contract passes standard security rules.</p>'}

    <h2>2. Plain-English Permissions Matrix</h2>
    <table>
        <thead>
            <tr>
                <th>Action</th>
                <th>Permitted Actor</th>
                <th>Details</th>
            </tr>
        </thead>
        <tbody>
            {matrix_rows}
        </tbody>
    </table>

    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
        <h3>Key Questions Answered</h3>
        <ul>
            <li><strong>Who can mint?</strong> {key_answers.get('whoCanMint', 'N/A')}</li>
            <li><strong>Who can withdraw?</strong> {key_answers.get('whoCanWithdraw', 'N/A')}</li>
            <li><strong>Who can pause?</strong> {key_answers.get('whoCanPause', 'N/A')}</li>
            <li><strong>Can supply grow?</strong> {key_answers.get('canSupplyGrow', 'N/A')}</li>
        </ul>
    </div>

    <h2>3. Gas Analysis (Measured)</h2>
    <table>
        <thead>
            <tr>
                <th>Function</th>
                <th>Gas Units</th>
                <th>Simulated Cost (APT)</th>
            </tr>
        </thead>
        <tbody>
            {gas_rows if gas_rows else '<tr><td colspan="3" style="padding: 10px;">No entry functions measured</td></tr>'}
        </tbody>
    </table>

    <div class="disclaimer">
        <strong>Disclaimer:</strong> This automated security audit is produced by Smart Contract Copilot. Automated analysis cannot detect every conceivable smart contract vulnerability. Not a substitute for a professional third-party audit before mainnet deployment.
    </div>
</body>
</html>
"""

pdf_generator_instance = PDFReportGenerator()
