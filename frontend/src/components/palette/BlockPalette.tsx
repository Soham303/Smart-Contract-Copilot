'use client';

import React, { useState } from 'react';
import { BlockSpec } from '../../types/blocks';

interface BlockPaletteProps {
  categories: string[];
  groupedBlocks: Record<string, BlockSpec[]>;
  onSelectBlock?: (block: BlockSpec) => void;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  categories,
  groupedBlocks,
  onSelectBlock,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Friendly plain-English descriptors
  const blockIcons: Record<string, string> = {
    'token.fungible': '🪙',
    'token.mint_control': '🖨️',
    'token.burn': '🔥',
    'token.freeze_pause': '⏸️',
    'token.transfer_fee': '💸',
    'access.owner': '👑',
    'access.role': '🛡️',
    'access.whitelist': '🎟️',
    'access.pausable': '⏸️',
    'nft.collection': '🖼️',
    'nft.royalty': '💰',
    'nft.mint_rules': '⏱️',
    'nft.reveal_metadata': '🎁',
    'finance.escrow': '🤝',
    'finance.vesting': '⏳',
    'finance.staking': '🌱',
    'finance.payment_splitter': '🍰',
    'finance.crowdfunding': '🚀',
    'governance.voting_proposal': '🗳️',
    'governance.multi_approval': '👥',
    'logic.condition': '⚖️',
    'logic.custom_function': '⚙️',
    'logic.state_variable': '📦',
    'logic.event_emit': '📡',
    'logic.time_lock': '⏰',
  };

  const friendlyTitles: Record<string, string> = {
    'token.fungible': 'Regular Coin / Token',
    'token.mint_control': 'Mint Permission',
    'token.burn': 'Burn (Destroy Coins)',
    'token.freeze_pause': 'Emergency Freeze',
    'token.transfer_fee': 'Transfer Fee (Tax)',
    'access.owner': 'Master Admin (Owner)',
    'access.role': 'Team Role Member',
    'access.whitelist': 'VIP Whitelist',
    'access.pausable': 'Pause Switch',
    'nft.collection': 'NFT Collection',
    'nft.royalty': 'Creator Royalty Fee',
    'nft.mint_rules': 'NFT Mint Schedule',
    'nft.reveal_metadata': 'Mystery Box Reveal',
    'finance.escrow': 'Safe Escrow Protection',
    'finance.vesting': 'Vesting Lockup',
    'finance.staking': 'Staking Reward Pool',
    'finance.payment_splitter': 'Payment Splitter',
    'finance.crowdfunding': 'Crowdfunding Campaign',
    'governance.voting_proposal': 'Community Voting (DAO)',
    'governance.multi_approval': 'Multi-Signature Approval',
    'logic.condition': 'Required Rule (Assert)',
    'logic.custom_function': 'Custom Action Function',
    'logic.state_variable': 'Saved Data Variable',
    'logic.event_emit': 'Live Event Broadcaster',
    'logic.time_lock': 'Delayed Time Lock',
  };

  const filteredCategories = activeCategory === 'All'
    ? categories
    : categories.filter(c => c.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', marginBottom: '4px' }}>
          Step 1: Pick Blocks
        </div>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '8px' }}>
          Drag a block onto the canvas or click <strong>+ Add</strong>.
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name (e.g. coin, royalty, admin)..."
          id="palette-search-input"
          style={{
            width: '100%',
            padding: '8px 10px',
            background: '#090d16',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveCategory('All')}
          style={{
            padding: '4px 8px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: activeCategory === 'All' ? '#3b82f6' : '#1f2937',
            color: '#fff',
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 8px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: activeCategory === cat ? '#3b82f6' : '#1f2937',
              color: '#fff',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Categorized List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredCategories.map((category) => {
          const blocks = (groupedBlocks[category] || []).filter(b => {
            const title = friendlyTitles[b.type] || b.title;
            return title.toLowerCase().includes(search.toLowerCase()) ||
              b.type.toLowerCase().includes(search.toLowerCase());
          });

          if (blocks.length === 0) return null;

          return (
            <div key={category}>
              <div style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#94a3b8',
                marginBottom: '4px',
                fontWeight: 700,
              }}>
                {category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {blocks.map((block) => {
                  const icon = blockIcons[block.type] || '📦';
                  const title = friendlyTitles[block.type] || block.title;

                  return (
                    <div
                      key={block.type}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/reactflow', JSON.stringify(block));
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      style={{
                        padding: '10px',
                        background: '#161e2e',
                        border: '1px solid #2d3748',
                        borderRadius: '8px',
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        transition: 'border-color 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff', display: 'block' }}>
                            {title}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {block.description?.slice(0, 42)}...
                          </span>
                        </div>
                      </div>

                      {onSelectBlock && (
                        <button
                          onClick={() => onSelectBlock(block)}
                          style={{
                            padding: '3px 8px',
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: '1px solid rgba(59, 130, 246, 0.35)',
                            color: '#60a5fa',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
