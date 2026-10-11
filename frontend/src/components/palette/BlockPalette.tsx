'use client';

import React, { useState } from 'react';
import { BlockSpec } from '../../types/blocks';
import { Search, Plus, GripVertical } from 'lucide-react';

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
    'token.fungible': 'Fungible Token (FA)',
    'token.mint_control': 'Mint Control Gate',
    'token.burn': 'Burn Control',
    'token.freeze_pause': 'Emergency Pause',
    'token.transfer_fee': 'Transfer Fee (Tax)',
    'access.owner': 'Master Admin (Owner)',
    'access.role': 'Team Role Member',
    'access.whitelist': 'VIP Whitelist',
    'access.pausable': 'Emergency Pausable',
    'nft.collection': 'NFT Collection',
    'nft.royalty': 'Resale Royalty',
    'nft.mint_rules': 'NFT Mint Schedule',
    'nft.reveal_metadata': 'Mystery Box Reveal',
    'finance.escrow': 'Trustless Escrow',
    'finance.vesting': 'Linear Vesting Lock',
    'finance.staking': 'Staking Rewards',
    'finance.payment_splitter': 'Payment Splitter',
    'finance.crowdfunding': 'Crowdfunding Campaign',
    'governance.voting_proposal': 'Lightweight DAO',
    'governance.multi_approval': 'Multi-Sig Approval',
    'logic.condition': 'Required Rule (Assert)',
    'logic.custom_function': 'Custom Action Function',
    'logic.state_variable': 'Saved Data Variable',
    'logic.event_emit': 'Event Broadcaster',
    'logic.time_lock': 'Delayed Time Lock',
  };

  const filteredCategories = activeCategory === 'All'
    ? categories
    : categories.filter(c => c.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.65rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
            PRIMITIVES PALETTE
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Drag or +Add</span>
        </div>
        
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search primitives (coin, gate, escrow)..."
            id="palette-search-input"
            style={{
              width: '100%',
              padding: '8px 10px 8px 30px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              outline: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveCategory('All')}
          style={{
            padding: '4px 8px',
            borderRadius: '9999px',
            border: activeCategory === 'All' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            background: activeCategory === 'All' ? 'var(--primary)' : 'var(--surface-container-low)',
            color: activeCategory === 'All' ? '#ffffff' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
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
              borderRadius: '9999px',
              border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              background: activeCategory === cat ? 'var(--primary)' : 'var(--surface-container-low)',
              color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grouped Block Accordion Cards */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '2px' }}>
        {filteredCategories.map((cat) => {
          const blocks = (groupedBlocks[cat] || []).filter(b => {
            const title = friendlyTitles[b.type] || b.title;
            return title.toLowerCase().includes(search.toLowerCase()) || b.type.toLowerCase().includes(search.toLowerCase());
          });

          if (blocks.length === 0) return null;

          return (
            <div key={cat}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{cat}</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-disabled)' }}>({blocks.length})</span>
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
                        e.dataTransfer.setData('application/reactflow', block.type);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <span style={{ color: 'var(--text-disabled)', fontSize: '0.8rem' }}>
                          <GripVertical size={14} />
                        </span>
                        <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{icon}</span>
                        <div style={{ overflow: 'hidden' }}>
                          <div
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                            }}
                          >
                            {title}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {block.type}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectBlock && onSelectBlock(block)}
                        title="Add Block to Canvas"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--surface-container-low)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={14} />
                      </button>
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
