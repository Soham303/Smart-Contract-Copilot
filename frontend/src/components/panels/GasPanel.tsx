'use client';

import React from 'react';
import { GasReportData, GasOptimizationPatch } from '../../types/gas';

interface GasPanelProps {
  gasReport: GasReportData;
  onApplyOptimization?: (patch: GasOptimizationPatch) => void;
}

export const GasPanel: React.FC<GasPanelProps> = ({
  gasReport,
  onApplyOptimization,
}) => {
  const { entries = [], totalGasEstimate = 0, totalAptEstimate = 0, optimizations = [] } = gasReport;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.25rem', overflowY: 'auto' }}>
      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Estimated Gas</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
            {totalGasEstimate.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>units</span>
          </div>
        </div>
        <div style={{ padding: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Cost in APT (@ 100 Octas)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa', marginTop: '2px' }}>
            {totalAptEstimate.toFixed(5)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>APT</span>
          </div>
        </div>
      </div>

      {/* Function Breakdown Table */}
      <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          Per-Function Gas Measurement
        </h4>
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--text-dim)' }}>Function</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--text-dim)' }}>Gas Units</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--text-dim)' }}>Cost (APT)</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '12px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No entry functions measured yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.function} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#fff' }}>{entry.function}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-main)' }}>
                      {entry.gasUnits ? entry.gasUnits.toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#60a5fa' }}>
                      {entry.approximateApt ? entry.approximateApt.toFixed(5) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Optimizations Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Verified Optimization Patches
          </h4>
          <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            Tested & Verified
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {optimizations.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              No optimization candidates found. Code is already optimized.
            </p>
          ) : (
            optimizations.map((opt) => (
              <div
                key={opt.id}
                style={{
                  padding: '12px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{opt.title}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    -{opt.savedPct}% Gas
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Before: <strong>{opt.beforeGas}</strong> units</span>
                  <span>→ After: <strong style={{ color: '#10b981' }}>{opt.afterGas}</strong> units</span>
                </div>

                {opt.diff && (
                  <pre
                    style={{
                      margin: '4px 0',
                      padding: '8px',
                      background: '#090d16',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      color: '#94a3b8',
                      overflowX: 'auto',
                    }}
                  >
                    <code>{opt.diff}</code>
                  </pre>
                )}

                {onApplyOptimization && (
                  <button
                    onClick={() => onApplyOptimization(opt)}
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: '4px',
                      padding: '4px 10px',
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Apply Optimization
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
