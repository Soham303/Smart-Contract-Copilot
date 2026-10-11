'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { BlockSpec } from '../../types/blocks';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

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

  // Plain-English beginner friendly title overrides and icons
  const friendlyTitles: Record<string, { icon: string; title: string; subtitle: string; structName: string; category: string; stripeColor: string }> = {
    'token.fungible': {
      icon: '🪙',
      title: 'Fungible Token',
      subtitle: 'Primary Fungible Store',
      structName: 'struct ManagedFungibleAsset has key',
      category: 'Token Primitives',
      stripeColor: '#0f766e', // Deep Teal
    },
    'token.mint_control': {
      icon: '🖨️',
      title: 'Mint Control Gate',
      subtitle: 'Capped Supply & Mint Authority',
      structName: 'struct MintCapability has key, store',
      category: 'Access & Security',
      stripeColor: '#ea580c', // Vivid Amber-Orange
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
      title: 'Master Admin Capability',
      subtitle: 'Exclusive Authority Pattern',
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
    'nft.collection': {
      icon: '🖼️',
      title: 'NFT Collection',
      subtitle: 'Digital Asset Standard v2',
      structName: 'struct CollectionData has key',
      category: 'Digital Assets',
      stripeColor: '#7c3aed', // Purple
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
      stripeColor: '#059669', // Security Emerald
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
      stripeColor: '#d97706', // Warm Gold
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

  // Semantic Handle Colors: Mint green for resources, cyan for capabilities, violet for event handles
  const getPortDotColor = (portType: string) => {
    switch (portType) {
      case 'MintGate':
      case 'MintRulesConfig':
      case 'TokenRef':
      case 'FinanceRef':
        return '#10b981'; // Mint Green (Resources)
      case 'AccessGate':
      case 'OwnerRef':
      case 'CapabilityRef':
        return '#06b6d4'; // Cyan (Capabilities)
      case 'EventRef':
      case 'FeeConfig':
      case 'RoyaltyConfig':
        return '#8b5cf6'; // Violet (Event handles / configs)
      default:
        return '#0f766e'; // Deep Teal
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: `1px solid ${isSelected ? '#0f766e' : '#cbd5e1'}`,
        borderRadius: '12px',
        padding: '0 0 14px 0',
        minWidth: '280px',
        maxWidth: '310px',
        boxShadow: isSelected
          ? '0 0 0 2px #0f766e, 0 8px 16px -4px rgba(15, 118, 110, 0.2)'
          : 'var(--shadow-node)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      {/* 8px Category Stripe */}
      <div
        style={{
          height: '8px',
          width: '100%',
          background: friendly.stripeColor,
        }}
      />

      <div style={{ padding: '12px 14px 0 14px' }}>
        {/* Header with Title, Struct and Status Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{friendly.icon}</span>
            <div>
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {friendly.title}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginTop: '1px',
                }}
              >
                {friendly.structName}
              </div>
            </div>
          </div>

          {/* Status Pill */}
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
            {status === 'valid' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
            {status === 'valid' ? 'Verified' : 'Check'}
          </div>
        </div>

        {/* Subtitle / Plain English explanation */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
          {friendly.subtitle}
        </p>

        {/* Properties Summary Pill */}
        {Object.keys(props).length > 0 && (
          <div
            style={{
              background: 'var(--surface-container-low)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '4px',
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
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>💡</span>
            <span>Aptos Move Standard: {friendly.category}</span>
          </div>
        )}
      </div>

      {/* Input Ports (Left) */}
      {spec.ports?.in.map((port, idx) => {
        const dotColor = getPortDotColor(port.type);
        return (
          <Handle
            key={port.name}
            type="target"
            position={Position.Left}
            id={port.name}
            style={{
              top: `${54 + idx * 26}px`,
              background: dotColor,
              width: '12px',
              height: '12px',
              border: '2px solid #ffffff',
              borderRadius: '50%',
              boxShadow: '0 0 0 1px #cbd5e1',
              cursor: 'crosshair',
            }}
            title={`Input Port: ${port.name} (${port.type})`}
          />
        );
      })}

      {/* Output Ports (Right) */}
      {spec.ports?.out.map((port, idx) => {
        const dotColor = getPortDotColor(port.type);
        return (
          <Handle
            key={port.name}
            type="source"
            position={Position.Right}
            id={port.name}
            style={{
              top: `${54 + idx * 26}px`,
              background: dotColor,
              width: '12px',
              height: '12px',
              border: '2px solid #ffffff',
              borderRadius: '50%',
              boxShadow: '0 0 0 1px #cbd5e1',
              cursor: 'crosshair',
            }}
            title={`Output Port: ${port.name} (${port.type})`}
          />
        );
      })}
    </div>
  );
};
