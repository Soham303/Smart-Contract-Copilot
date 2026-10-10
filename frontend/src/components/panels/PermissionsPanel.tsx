'use client';

import React from 'react';
import { PermissionsData } from '../../types/permissions';

interface PermissionsPanelProps {
  permissionsData: PermissionsData;
}

export const PermissionsPanel: React.FC<PermissionsPanelProps> = ({
  permissionsData,
}) => {
  const { matrix = [], keyAnswers, mutableParameters = [], fundsFlow } = permissionsData;

  const actorColors: Record<string, string> = {
    Anyone: '#3b82f6',
    'Owner/Admin': '#ef4444',
    'Specific Role': '#8b5cf6',
    'Nobody/Disabled': '#6b7280',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.25rem', overflowY: 'auto' }}>
      {/* Key Questions Answered (PRD FR-12.3) */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px' }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          Key Contract Questions (Plain English)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Who can mint?</span>
            <span style={{ color: '#fff' }}>{keyAnswers?.whoCanMint || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Who can withdraw funds?</span>
            <span style={{ color: '#fff' }}>{keyAnswers?.whoCanWithdraw || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Who can pause?</span>
            <span style={{ color: '#fff' }}>{keyAnswers?.whoCanPause || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Can total supply grow?</span>
            <span style={{ color: '#fff' }}>{keyAnswers?.canSupplyGrow || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Grid (PRD FR-12.1) */}
      <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          Permissions Matrix
        </h4>
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--text-dim)' }}>Action</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--text-dim)' }}>Permitted Actor</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--text-dim)' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {matrix.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '12px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No permission rules defined.
                  </td>
                </tr>
              ) : (
                matrix.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#fff' }}>{row.action}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: `${actorColors[row.actor] || '#6b7280'}20`,
                        color: actorColors[row.actor] || '#6b7280',
                      }}>
                        {row.actor}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{row.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Funds Flow Summary (PRD FR-12.5) */}
      {fundsFlow && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px' }}>
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#10b981', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Funds Flow Summary
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div><strong>Inflow:</strong> {fundsFlow.inflow}</div>
            <div><strong>Outflow:</strong> {fundsFlow.outflow}</div>
            <div><strong>Controllers:</strong> {fundsFlow.controllers?.join(', ')}</div>
          </div>
        </div>
      )}
    </div>
  );
};
