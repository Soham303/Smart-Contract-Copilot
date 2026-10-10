'use client';

import React from 'react';
import { BlockSpec } from '../../types/blocks';

interface PropertiesPanelProps {
  selectedBlock: {
    id: string;
    type: string;
    props: Record<string, any>;
    spec: BlockSpec;
  } | null;
  onUpdateProps: (blockId: string, updatedProps: Record<string, any>) => void;
  onDeleteBlock?: (blockId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdateProps,
  onDeleteBlock,
}) => {
  if (!selectedBlock) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
        Select a block on the canvas to inspect and configure its properties.
      </div>
    );
  }

  const { id, spec, props } = selectedBlock;

  const handleChange = (key: string, value: any) => {
    onUpdateProps(id, {
      ...props,
      [key]: value,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{spec.title}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {id}</span>
        </div>
        {onDeleteBlock && (
          <button
            onClick={() => onDeleteBlock(id)}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
            }}
          >
            Delete
          </button>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {spec.description}
      </p>

      {/* Property Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(spec.props || {}).map(([key, propDef]) => {
          const val = props[key] ?? propDef.default ?? '';

          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {key} {propDef.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>

              {propDef.type === 'string' && (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              )}

              {propDef.type === 'int' && (
                <input
                  type="number"
                  value={val}
                  min={propDef.min}
                  max={propDef.max}
                  onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              )}

              {propDef.type === 'enum' && (
                <select
                  value={val}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                >
                  {propDef.values?.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              )}

              {propDef.type === 'boolean' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(val)}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Enabled</span>
                </label>
              )}

              {propDef.description && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {propDef.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
