'use client';

import React, { useState } from 'react';
import { AuditFinding, SeverityLevel } from '../../types/audit';

interface AuditPanelProps {
  riskScore: number;
  riskBand: 'Low' | 'Moderate' | 'High';
  severityCounts?: Record<SeverityLevel, number>;
  findings: AuditFinding[];
  onSelectBlock?: (blockId: string) => void;
  onRefreshAudit?: () => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({
  riskScore,
  riskBand,
  severityCounts,
  findings,
  onSelectBlock,
  onRefreshAudit,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const filteredFindings = filter === 'All'
    ? findings
    : findings.filter(f => f.severity === filter);

  const bandColors = {
    Low: '#10b981',
    Moderate: '#f59e0b',
    High: '#ef4444',
  };

  const sevColors: Record<string, string> = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#f59e0b',
    Low: '#3b82f6',
    Info: '#6b7280',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', overflowY: 'auto' }}>
      {/* Risk Gauge Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            SECURITY RISK SCORE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: bandColors[riskBand] }}>
              {riskScore}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ 100</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: `${bandColors[riskBand]}20`,
              color: bandColors[riskBand],
              border: `1px solid ${bandColors[riskBand]}40`,
            }}>
              {riskBand} Risk
            </span>
          </div>
        </div>

        {onRefreshAudit && (
          <button
            onClick={onRefreshAudit}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            Re-audit ⟳
          </button>
        )}
      </div>

      {/* Severity Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilter(sev)}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: filter === sev ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              color: '#fff',
            }}
          >
            {sev} {severityCounts && sev !== 'All' ? `(${severityCounts[sev as SeverityLevel] || 0})` : ''}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {filteredFindings.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#10b981', fontSize: '0.875rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            ✓ No {filter === 'All' ? '' : filter} security findings detected!
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              style={{
                padding: '12px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderLeft: `4px solid ${sevColors[finding.severity] || '#6b7280'}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>
                  [{finding.ruleId}] {finding.title}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: sevColors[finding.severity],
                  background: `${sevColors[finding.severity]}15`,
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}>
                  {finding.severity}
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {finding.message}
              </p>

              {finding.fix && (
                <div style={{ fontSize: '0.75rem', color: '#86efac', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <strong>Fix:</strong> {finding.fix}
                </div>
              )}

              {finding.blockId && onSelectBlock && (
                <button
                  onClick={() => onSelectBlock(finding.blockId!)}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '4px',
                    fontSize: '0.7rem',
                    color: '#60a5fa',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Jump to block →
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Disclaimer (PRD FR-8.7) */}
      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', padding: '8px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        Automated analysis. Not a substitute for a professional audit.
      </div>
    </div>
  );
};
