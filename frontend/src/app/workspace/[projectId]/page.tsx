import React from 'react';

export default function WorkspacePage({ params }: { params: { projectId: string } }) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top bar (PRD 20.1) */}
      <header style={{ height: '56px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Smart Contract Copilot</span>
          <span style={{ color: 'var(--text-dim)' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Project: {params.projectId}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button id="check-btn" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
            Check
          </button>
          <button id="report-btn" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem' }}>
            PDF Report
          </button>
          <button id="deploy-btn" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
            Deploy (Testnet)
          </button>
          <button id="wallet-btn" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem' }}>
            Connect Petra
          </button>
        </div>
      </header>

      {/* Main workspace layout (PRD 20.1) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Block Palette & Search */}
        <aside style={{ width: '280px', borderRight: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '1rem' }}>
          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Block Palette
          </h4>
          <input
            type="text"
            placeholder="Search blocks..."
            id="palette-search"
            style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', marginBottom: '1rem' }}
          />
        </aside>

        {/* Center: React Flow Canvas */}
        <main style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
            <button style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}>Undo</button>
            <button style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}>Redo</button>
            <button style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}>Learning Mode: ON</button>
          </div>
        </main>

        {/* Right: Tabbed Panels (Properties, Code, Audit, Gas, Permissions, Learn) */}
        <aside style={{ width: '420px', borderLeft: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <button style={{ flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', color: '#fff', borderBottom: '2px solid #3b82f6', fontWeight: 600 }}>Properties</button>
            <button style={{ flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>Code</button>
            <button style={{ flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>Audit</button>
            <button style={{ flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>Gas</button>
            <button style={{ flex: 1, padding: '10px 4px', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>Permissions</button>
          </div>
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Select a block to inspect properties.</p>
          </div>
        </aside>
      </div>

      {/* Bottom: Console & Job Timeline */}
      <footer style={{ height: '36px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Console: Ready • Aptos Testnet</span>
      </footer>
    </div>
  );
}
