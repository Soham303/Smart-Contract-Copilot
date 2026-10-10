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
      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👆</div>
        <strong>Click on any block</strong> on the canvas to configure its settings.
      </div>
    );
  }

  const { id, spec, props } = selectedBlock;

  const friendlyFieldLabels: Record<string, { label: string; tip: string }> = {
    name: { label: 'Token / Collection Name', tip: 'e.g. StarCoin or Sky Apes' },
    symbol: { label: 'Ticker Symbol', tip: 'e.g. STAR or APTO (usually 3-5 uppercase letters)' },
    decimals: { label: 'Decimals Precision', tip: 'Standard on Aptos is 8 decimals' },
    maxSupply: { label: 'Total Maximum Supply Cap', tip: 'The maximum total number that will ever exist on chain' },
    iconUri: { label: 'Icon / Image URL', tip: 'Link to token or collection icon image' },
    projectUri: { label: 'Project Website URL', tip: 'Link to official website or docs' },
    cap: { label: 'Minting Limit Cap', tip: 'Maximum total coins this permission can mint' },
    allowPublicMint: { label: 'Can Anyone in Public Mint?', tip: 'If enabled, anyone can mint coins without admin approval' },
    burner: { label: 'Who Can Burn (Destroy)?', tip: 'Allow token holders or admin to burn tokens' },
    scope: { label: 'Freeze Scope', tip: 'Global freezes entire contract, account freezes individual wallet' },
    bps: { label: 'Fee / Royalty (in Basis Points)', tip: '500 bps = 5.0%, 100 bps = 1.0% (max is 1000 = 10%)' },
    recipient: { label: 'Fee Recipient Wallet', tip: 'Address or role receiving the collected fees' },
    beneficiary: { label: 'Payout Beneficiary Address', tip: 'The wallet address receiving the released funds' },
    timeoutSec: { label: 'Refund Timeout (Seconds)', tip: '86400 = 24 hours. Depositor can refund after this duration' },
    autoRefundOnTimeout: { label: 'Automatic Refund on Timeout', tip: 'Allow instant depositor refund if conditions are unmet' },
    cliffDurationSec: { label: 'Cliff Lockup Period (Seconds)', tip: '2,592,000 = 30 days cliff before any tokens unlock' },
    vestingDurationSec: { label: 'Total Vesting Duration (Seconds)', tip: '31,536,000 = 1 year total linear unlock duration' },
    totalAmount: { label: 'Total Coins to Vest', tip: 'Total token amount to lock and release' },
    rewardRatePerSec: { label: 'Reward Rate Per Second', tip: 'Tokens distributed to all stakers per second' },
    lockupDurationSec: { label: 'Minimum Staking Lockup (Seconds)', tip: '604,800 = 7 days minimum deposit duration' },
    transferable: { label: 'Can Master Admin Be Transferred?', tip: 'Allows passing owner rights to a new wallet' },
    roleName: { label: 'Team Role Identifier', tip: 'Name of the role (e.g. OPERATOR or MODERATOR)' },
    quorumPct: { label: 'Minimum Quorum Required (%)', tip: 'Percentage of voters needed for proposal validity' },
    votingPeriodSec: { label: 'Voting Period Duration (Seconds)', tip: '259,200 = 3 days voting window' },
  };

  const handleChange = (key: string, value: any) => {
    onUpdateProps(id, {
      ...props,
      [key]: value,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d3748', paddingBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{spec.title}</h3>
          <span style={{ fontSize: '0.72rem', color: '#60a5fa' }}>ID: {id}</span>
        </div>
        {onDeleteBlock && (
          <button
            onClick={() => onDeleteBlock(id)}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            Delete Block
          </button>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5, background: '#111827', padding: '8px 10px', borderRadius: '6px' }}>
        ℹ️ {spec.description}
      </p>

      {/* Property Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {Object.entries(spec.props || {}).map(([key, propDef]) => {
          const val = props[key] ?? propDef.default ?? '';
          const meta = friendlyFieldLabels[key] || { label: key, tip: propDef.description || '' };

          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
                  {meta.label} {propDef.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {key === 'bps' && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>
                    = {((Number(val) || 0) / 100).toFixed(1)}%
                  </span>
                )}
              </div>

              {propDef.type === 'string' && (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#090d16',
                    border: '1px solid #374151',
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
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#090d16',
                    border: '1px solid #374151',
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
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#090d16',
                    border: '1px solid #374151',
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', background: '#090d16', borderRadius: '6px', border: '1px solid #374151' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(val)}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                    {Boolean(val) ? 'Enabled (Yes)' : 'Disabled (No)'}
                  </span>
                </label>
              )}

              {meta.tip && (
                <span style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
                  {meta.tip}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
