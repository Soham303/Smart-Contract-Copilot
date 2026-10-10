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

  const filteredCategories = activeCategory === 'All'
    ? categories
    : categories.filter(c => c.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blocks (e.g. mint, royalty)..."
          id="palette-search-input"
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveCategory('All')}
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 500,
            background: activeCategory === 'All' ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
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
              padding: '4px 10px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: activeCategory === cat ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              color: '#fff',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Categorized List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredCategories.map((category) => {
          const blocks = (groupedBlocks[category] || []).filter(b =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.type.toLowerCase().includes(search.toLowerCase())
          );

          if (blocks.length === 0) return null;

          return (
            <div key={category}>
              <div style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-dim)',
                marginBottom: '0.5rem',
                fontWeight: 600,
              }}>
                {category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {blocks.map((block) => (
                  <div
                    key={block.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/reactflow', JSON.stringify(block));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={() => onSelectBlock && onSelectBlock(block)}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'grab',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {block.title}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                      }}>
                        {block.type.split('.')[1]}
                      </span>
                    </div>
                    {block.ports && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {block.ports.in.length > 0 && (
                          <span>In: {block.ports.in.map(p => p.name).join(', ')}</span>
                        )}
                        {block.ports.out.length > 0 && (
                          <span>Out: {block.ports.out.map(p => p.name).join(', ')}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
