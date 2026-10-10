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
  const { spec, props, status = 'valid', statusMessage, learningMode = true, isSelected = false } = data;

  // Plain-English beginner friendly title overrides and icons
  const friendlyTitles: Record<string, { icon: string; title: string; subtitle: string; tip: string }> = {
    'token.fungible': {
      icon: '🪙',
      title: 'Regular Coin / Token',
      subtitle: 'Create a standard cryptocurrency',
      tip: 'Connect the Mint block on the left to set who can create coins.',
    },
    'token.mint_control': {
      icon: '🖨️',
      title: 'Mint Permission',
      subtitle: 'Who can create new coins',
      tip: 'Drag the green dot on the right into the Coin block.',
    },
    'token.burn': {
      icon: '🔥',
      title: 'Burn (Destroy Coins)',
      subtitle: 'Permanently remove coins',
      tip: 'Connect to Coin block to allow coin burning.',
    },
    'token.freeze_pause': {
      icon: '⏸️',
      title: 'Emergency Freeze',
      subtitle: 'Safety circuit breaker',
      tip: 'Allows you to stop transfers in an emergency.',
    },
    'token.transfer_fee': {
      icon: '💸',
      title: 'Transfer Fee (Tax)',
      subtitle: 'Percentage cut on every send',
      tip: 'Sends a small % fee to your wallet on transfers.',
    },
    'access.owner': {
      icon: '👑',
      title: 'Master Admin (Owner)',
      subtitle: 'Gives your wallet admin rights',
      tip: 'Drag the purple dot to any block requiring admin control.',
    },
    'access.whitelist': {
      icon: '🎟️',
      title: 'VIP Whitelist',
      subtitle: 'Allow only pre-approved wallets',
      tip: 'Restricts access to approved community members.',
    },
    'access.pausable': {
      icon: '⏸️',
      title: 'Pause Switch',
      subtitle: 'Emergency stop mechanism',
      tip: 'Pauses contract interactions if needed.',
    },
    'nft.collection': {
      icon: '🖼️',
      title: 'NFT Collection',
      subtitle: 'Unique digital art items',
      tip: 'A collection of digital collectibles on Aptos.',
    },
    'nft.royalty': {
      icon: '💰',
      title: 'Resale Royalty',
      subtitle: 'Creator payout on resales',
      tip: 'Earn a percentage every time someone sells an NFT.',
    },
    'finance.escrow': {
      icon: '🤝',
      title: 'Safe Escrow',
      subtitle: 'Buyer & seller trade protection',
      tip: 'Holds money safely until agreed conditions are met.',
    },
    'finance.vesting': {
      icon: '⏳',
      title: 'Vesting Lockup',
      subtitle: 'Release tokens slowly over time',
      tip: 'Prevents team or investors from dumping all at once.',
    },
    'finance.staking': {
      icon: '🌱',
      title: 'Staking Rewards',
      subtitle: 'Earn interest for holding',
      tip: 'Users deposit coins to earn periodic rewards.',
    },
    'governance.voting_proposal': {
      icon: '🗳️',
      title: 'Community Voting (DAO)',
      subtitle: 'Decentralized voting governance',
      tip: 'Token holders vote on proposals with quorum checks.',
    },
  };

  const friendly = friendlyTitles[spec.type] || {
    icon: '📦',
    title: spec.title || spec.type,
    subtitle: spec.description || 'Smart contract component',
    tip: 'Connect matching color dots to link blocks.',
  };

  // Color mapping for port dots: matching colors make it obvious what connects to what!
  const getPortDotColor = (portType: string) => {
    switch (portType) {
      case 'MintGate':
      case 'MintRulesConfig':
        return '#10b981'; // Green
      case 'AccessGate':
      case 'OwnerRef':
        return '#a855f7'; // Purple
      case 'FeeConfig':
      case 'RoyaltyConfig':
        return '#f59e0b'; // Gold
      case 'PauseGate':
        return '#ef4444'; // Red
      case 'TokenRef':
      case 'CollectionRef':
      case 'FinanceRef':
        return '#3b82f6'; // Blue
      default:
        return '#06b6d4'; // Cyan
    }
  };

  // Plain-English port names
  const getFriendlyPortName = (name: string, isInput: boolean) => {
    const map: Record<string, string> = {
      mint: '👈 Needs Mint Permission',
      mint_control: '👉 Grants Minting Rights',
      admin: '👈 Needs Admin Owner',
      owner: '👉 Master Admin Authority',
      burn: '👈 Burn Permission',
      burn_control: '👉 Grants Burning Rights',
      pause: '👈 Emergency Pause Input',
      pause_control: '👉 Emergency Pause Switch',
      gate: '👉 Whitelist Gate Pass',
      royalty: isInput ? '👈 Receives Royalty' : '👉 Sets Royalty Rate',
      fee: '👈 Fee Configuration',
      fee_config: '👉 Sends Fee Cut',
      arbiter: '👈 Arbiter Admin Input',
    };
    return map[name] || `${isInput ? '👈 In:' : '👉 Out:'} ${name}`;
  };

  return (
    <div
      style={{
        background: '#111827',
        border: `2px solid ${isSelected ? '#3b82f6' : '#2d3748'}`,
        borderRadius: '14px',
        padding: '16px',
        minWidth: '270px',
        maxWidth: '300px',
        boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.45)' : '0 8px 24px rgba(0,0,0,0.5)',
        position: 'relative',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
    >
      {/* Input Ports (Left) with Plain English Labels */}
      {spec.ports?.in.map((port, idx) => {
        const dotColor = getPortDotColor(port.type);
        return (
          <div key={port.name} style={{ position: 'relative' }}>
            <Handle
              type="target"
              position={Position.Left}
              id={port.name}
              style={{
                top: `${48 + idx * 32}px`,
                background: dotColor,
                width: '14px',
                height: '14px',
                border: '3px solid #111827',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              title={`Input: ${getFriendlyPortName(port.name, true)}`}
            />
            <span
              style={{
                position: 'absolute',
                left: '-8px',
                top: `${40 + idx * 32}px`,
                transform: 'translateX(-100%)',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: dotColor,
                background: '#1f2937',
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${dotColor}40`,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {getFriendlyPortName(port.name, true)}
            </span>
          </div>
        );
      })}

      {/* Header with Friendly Icon & Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{friendly.icon}</span>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', margin: 0 }}>
              {friendly.title}
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>
              {friendly.subtitle}
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '9999px',
            background: status === 'valid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: status === 'valid' ? '#10b981' : '#ef4444',
            fontWeight: 700,
          }}
          title={statusMessage || 'Ready'}
        >
          {status === 'valid' ? '✓ Ready' : '⚠ Check'}
        </span>
      </div>

      {/* Beginner Helper Tip */}
      <div style={{ fontSize: '0.7rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.08)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '8px', lineHeight: 1.35 }}>
        💡 {friendly.tip}
      </div>

      {/* Property Summary Preview */}
      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', background: '#090d16', padding: '6px 10px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {Object.entries(props).slice(0, 2).map(([k, v]) => {
          const readableKey = k === 'name' ? 'Name' : k === 'symbol' ? 'Ticker' : k === 'maxSupply' ? 'Max Limit' : k === 'bps' ? 'Royalty' : k;
          const displayVal = k === 'bps' ? `${(v/100)}%` : String(v);
          return (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{readableKey}:</span>
              <strong style={{ color: '#f8fafc' }}>{displayVal}</strong>
            </div>
          );
        })}
      </div>

      {/* Output Ports (Right) with Plain English Labels */}
      {spec.ports?.out.map((port, idx) => {
        const dotColor = getPortDotColor(port.type);
        return (
          <div key={port.name} style={{ position: 'relative' }}>
            <Handle
              type="source"
              position={Position.Right}
              id={port.name}
              style={{
                top: `${48 + idx * 32}px`,
                background: dotColor,
                width: '14px',
                height: '14px',
                border: '3px solid #111827',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              title={`Output: ${getFriendlyPortName(port.name, false)}`}
            />
            <span
              style={{
                position: 'absolute',
                right: '-8px',
                top: `${40 + idx * 32}px`,
                transform: 'translateX(100%)',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: dotColor,
                background: '#1f2937',
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${dotColor}40`,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {getFriendlyPortName(port.name, false)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
