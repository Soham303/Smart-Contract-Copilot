export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface AuditFinding {
  id: string;
  ruleId: string;
  title: string;
  severity: SeverityLevel;
  blockId?: string;
  file?: string;
  line?: number;
  message: string;
  fix?: string;
  autoFixPatch?: string;
  conceptRef?: string;
  acknowledged?: boolean;
  note?: string;
}

export interface RiskMetrics {
  score: number;
  band: 'Low' | 'Moderate' | 'High';
  severityCounts: Record<SeverityLevel, number>;
}

export interface AuditReportData {
  disclaimer: string;
  riskScore: number;
  riskBand: 'Low' | 'Moderate' | 'High';
  findings: AuditFinding[];
}
