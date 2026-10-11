'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { BlockSpec } from '../../types/blocks';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

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
  const { spec, props, status = 'valid', statusMessage, learningMode = true, isSelected = false } = data;

  const friendlyTitles: Record<string, { icon: string; title: string; subtitle: string; structName: string; category: string; stripeColor: string }> = {
    'token.fungible': {
      icon: '🪙',
      title: 'Fungible Token',
      subtitle: 'Primary Fungible Store',
      structName: 'struct ManagedFungibleAsset has key',
      category: 'Token Primitives',
      stripeColor: '#0f766e',
    },
    'token.mint_control': {
      icon: '🖨️',
      title: 'Mint Control Gate',
      subtitle: 'Capped Supply & Mint Authority',
      structName: 'struct MintCapability has key, store',
      category: 'Access & Security',
      stripeColor: '#ea580c',
    },
    'token.burn': {
      icon: '🔥',
      title: 'Burn Control',
      subtitle: 'BurnRef Authority & Deflation',
      structName: 'struct BurnCapability has key, store',
      category: 'Token Primitives',
      stripeColor: '#0f766e',
    },
    'token.freeze_pause': {
      icon: '⏸️',
      title: 'Emergency Pause',
      subtitle: 'Circuit Breaker State Switch',
      structName: 'struct PauseControl has key',
      category: 'Access & Security',
      stripeColor: '#ea580c',
    },
    'token.transfer_fee': {
      icon: '💸',
      title: 'Transfer Fee (Tax)',
      subtitle: 'Basis Points Cut on Transfers',
      structName: 'struct FeeProtocol has key',
      category: 'Token Primitives',
      stripeColor: '#0f766e',
    },
    'access.owner': {
      icon: '👑',
      title: 'Master Admin Authority',
      subtitle: 'Exclusive Capability Pattern',
      structName: 'struct AdminCapability has key, store',
      category: 'Access & Security',
      stripeColor: '#ea580c',
    },
    'access.whitelist': {
      icon: '🎟️',
      title: 'VIP Whitelist',
      subtitle: 'Table Based Permission Gate',
      structName: 'struct WhitelistTable has key',
      category: 'Access & Security',
      stripeColor: '#ea580c',
    },
    'access.pausable': {
      icon: '⏸️',
      title: 'Emergency Pausable',
      subtitle: 'Global Execution Gate',
      structName: 'struct PauseGuard has key',
      category: 'Access & Security',
      stripeColor: '#ea580c',
    },
    'access.role': {
      icon: '🛡️',
      title: 'Role Member Gate',
      subtitle: 'Role-Based Access Control',
      structName: 'struct RoleCapability has key',
      category: 'Access & Security',
      stripeColor: '#ea580c',
    },
    'nft.collection': {
      icon: '🖼️',
      title: 'NFT Collection',
      subtitle: 'Digital Asset Standard v2',
      structName: 'struct CollectionData has key',
      category: 'Digital Assets',
      stripeColor: '#7c3aed',
    },
    'nft.royalty': {
      icon: '💰',
      title: 'Resale Royalty',
      subtitle: 'Creator Payout Rate',
      structName: 'struct RoyaltyConfig has store',
      category: 'Digital Assets',
      stripeColor: '#7c3aed',
    },
    'finance.escrow': {
      icon: '🤝',
      title: 'Trustless Escrow',
      subtitle: 'Conditional Multi-party Lock',
      structName: 'struct EscrowLock has key',
      category: 'Finance & Escrow',
      stripeColor: '#059669',
    },
    'finance.vesting': {
      icon: '⏳',
      title: 'Linear Vesting Lock',
      subtitle: 'Continuous Cliff Release',
      structName: 'struct VestingSchedule has key',
      category: 'Finance & Escrow',
      stripeColor: '#059669',
    },
    'finance.staking': {
      icon: '🌱',
      title: 'Staking Rewards',
      subtitle: 'Yield Rate Calculation',
      structName: 'struct StakingPool has key',
      category: 'Finance & Escrow',
      stripeColor: '#059669',
    },
    'governance.voting_proposal': {
      icon: '🗳️',
      title: 'Lightweight DAO',
      subtitle: 'Quorum & Voting Gate',
      structName: 'struct ProposalVote has key',
      category: 'Governance & Logic',
      stripeColor: '#d97706',
    },
  };

  const friendly = friendlyTitles[spec.type] || {
    icon: '📦',
    title: spec.title || spec.type,
    subtitle: spec.description || 'Move Component',
    structName: 'struct Component has key',
    category: spec.category || 'Module',
    stripeColor: '#0f766e',
  };

  const getPortDotColor = (portType: string) => {
    switch (portType) {
      case 'MintGate':
      case 'MintRulesConfig':
      case 'TokenRef':
      case 'FinanceRef':
        return '#10b981'; // Mint Green
      case 'AccessGate':
      case 'OwnerRef':
      case 'CapabilityRef':
        return '#06b6d4'; // Cyan
      case 'PauseGate':
        return '#ef4444'; // Red
      case 'FeeConfig':
      case 'RoyaltyConfig':
      case 'GovernanceRef':
        return '#f59e0b'; // Amber
      default:
        return '#0f766e'; // Deep Teal
    }
  };

  const hasInPorts = Boolean(spec.ports?.in && spec.ports.in.length > 0);
  const hasOutPorts = Boolean(spec.ports?.out && spec.ports.out.length > 0);

  return (
    <div
      style={{
        background: '#ffffff',
        border: `1px solid ${isSelected ? '#0f766e' : '#cbd5e1'}`,
        borderRadius: '12px',
        padding: '0 0 12px 0',
        minWidth: '280px',
        maxWidth: '320px',
        boxShadow: isSelected
          ? '0 0 0 2px #0f766e, 0 8px 16px -4px rgba(15, 118, 110, 0.2)'
          : 'var(--shadow-node)',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      {/* 8px Category Stripe */}
      <div
        style={{
          height: '8px',
          width: '100%',
          background: friendly.stripeColor,
          borderRadius: '11px 11px 0 0',
        }}
      />

      <div style={{ padding: '12px 14px 4px 14px' }}>
        {/* Header with Icon, Title and Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{friendly.icon}</span>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {friendly.title}
              </div>
              <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '1px' }}>
                {friendly.structName}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              background: status === 'valid' ? 'var(--tertiary-container)' : 'var(--risk-critical-bg)',
              color: status === 'valid' ? 'var(--tertiary)' : 'var(--risk-critical)',
              border: `1px solid ${status === 'valid' ? 'var(--tertiary-border)' : 'var(--risk-critical-border)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle2 size={11} />
            {status === 'valid' ? 'Verified' : 'Check'}
          </div>
        </div>

        {/* Subtitle description */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' }}>
          {friendly.subtitle}
        </p>

        {/* Properties Summary Pill */}
        {Object.keys(props).length > 0 && (
          <div
            style={{
              background: 'var(--surface-container-low)',
              borderRadius: '6px',
              padding: '5px 8px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '6px',
            }}
          >
            {Object.entries(props)
              .slice(0, 2)
              .map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{String(v)}</span>
                </div>
              ))}
          </div>
        )}

        {/* Learning Hint */}
        {learningMode && (
          <div
            style={{
              fontSize: '0.6875rem',
              color: 'var(--primary)',
              background: 'var(--primary-container)',
              borderRadius: '6px',
              padding: '4px 8px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>💡</span>
            <span>{friendly.category}</span>
          </div>
        )}
      </div>

      {/* --- Clear Labeled Ports Section (Direct Handle Alignment) --- */}
      {(hasInPorts || hasOutPorts) && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px',
            margin: '0 14px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* In Ports (Left) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {spec.ports?.in.map((port) => {
              const dotColor = getPortDotColor(port.type);
              return (
                <div key={port.name} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={port.name}
                    style={{
                      left: '-14px',
                      background: dotColor,
                      width: '12px',
                      height: '12px',
                      border: '2px solid #ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 1px #cbd5e1',
                      cursor: 'crosshair',
                    }}
                    title={`Input: ${port.name} (${port.type})`}
                  />
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: dotColor }} />
                    ← {port.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Out Ports (Right) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flex: 1 }}>
            {spec.ports?.out.map((port) => {
              const dotColor = getPortDotColor(port.type);
              return (
                <div key={port.name} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {port.name} →
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: dotColor }} />
                  </span>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={port.name}
                    style={{
                      right: '-14px',
                      background: dotColor,
                      width: '12px',
                      height: '12px',
                      border: '2px solid #ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 1px #cbd5e1',
                      cursor: 'crosshair',
                    }}
                    title={`Output: ${port.name} (${port.type})`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
