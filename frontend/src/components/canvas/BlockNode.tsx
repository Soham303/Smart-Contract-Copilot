'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { BlockSpec } from '../../types/blocks';

interface BlockNodeProps {
  id: string;
  data: {
    spec: BlockSpec;
    props: Record<string, any>;
    status?: 'valid' | 'warning' | 'error';
    statusMessage?: string;
    learningMode?: boolean;
    isSelected?: boolean;
  };
}

export const BlockNode: React.FC<BlockNodeProps> = ({ id, data }) => {
  const { spec, props, status = 'valid', statusMessage, learningMode = false, isSelected = false } = data;

  const categoryColors: Record<string, string> = {
    Token: '#3b82f6',
    NFT: '#8b5cf6',
    Finance: '#10b981',
    Governance: '#f59e0b',
    Access: '#ef4444',
    Logic: '#06b6d4',
  };

  const badgeColor = categoryColors[spec.category] || '#3b82f6';

  const statusIcons = {
    valid: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: `2px solid ${isSelected ? '#3b82f6' : 'var(--border-color)'}`,
        borderRadius: '12px',
        padding: '12px',
        minWidth: '220px',
        boxShadow: isSelected ? '0 0 16px rgba(59, 130, 246, 0.4)' : '0 4px 12px rgba(0,0,0,0.3)',
        backdropFilter: 'var(--glass-blur)',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Input Ports (Left/Top) */}
      {spec.ports?.in.map((port, idx) => (
        <Handle
          key={port.name}
          type="target"
          position={Position.Left}
          id={port.name}
          style={{
            top: `${35 + idx * 24}px`,
            background: '#60a5fa',
            width: '10px',
            height: '10px',
            border: '2px solid #1e293b',
          }}
          title={`In: ${port.name} (${port.type})`}
        />
      ))}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: badgeColor,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{spec.title}</span>
        </div>
        {/* Status Badge (FR-2.6) */}
        <span title={statusMessage} style={{ fontSize: '0.85rem' }}>
          {statusIcons[status]}
        </span>
      </div>

      {/* Primary Property Preview */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '6px' }}>
        {Object.entries(props).slice(0, 2).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>{k}:</span>
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{String(v)}</span>
          </div>
        ))}
      </div>

      {/* Learning Mode Concepts (FR-14.2) */}
      {learningMode && spec.concepts && spec.concepts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
          {spec.concepts.map((concept) => (
            <span
              key={concept}
              style={{
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#93c5fd',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              📖 {concept}
            </span>
          ))}
        </div>
      )}

      {/* Output Ports (Right/Bottom) */}
      {spec.ports?.out.map((port, idx) => (
        <Handle
          key={port.name}
          type="source"
          position={Position.Right}
          id={port.name}
          style={{
            top: `${35 + idx * 24}px`,
            background: '#10b981',
            width: '10px',
            height: '10px',
            border: '2px solid #1e293b',
          }}
          title={`Out: ${port.name} (${port.type})`}
        />
      ))}
    </div>
  );
};
