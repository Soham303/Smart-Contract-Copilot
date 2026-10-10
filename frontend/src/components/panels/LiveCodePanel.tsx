'use client';

import React, { useState } from 'react';

interface LiveCodePanelProps {
  files: Record<string, string>;
  sourceMap?: any;
  onEjectToEditor?: () => void;
}

export const LiveCodePanel: React.FC<LiveCodePanelProps> = ({
  files,
  sourceMap,
  onEjectToEditor,
}) => {
  const fileNames = Object.keys(files || {});
  const [activeFile, setActiveFile] = useState<string>(fileNames[1] || fileNames[0] || 'sources/contract.move');
  const [copied, setCopied] = useState(false);

  const currentCode = files[activeFile] || '// Generating Move code...';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.split('/').pop() || 'contract.move';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* File Tabs & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '4px 8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {fileNames.map((fn) => (
            <button
              key={fn}
              onClick={() => setActiveFile(fn)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeFile === fn ? 'var(--bg-primary)' : 'transparent',
                color: activeFile === fn ? '#60a5fa' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: activeFile === fn ? 600 : 400,
              }}
            >
              {fn}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.75rem',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.75rem',
            }}
          >
            Download
          </button>
          {onEjectToEditor && (
            <button
              onClick={onEjectToEditor}
              title="One-way eject to Monaco editor"
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Eject ↗
            </button>
          )}
        </div>
      </div>

      {/* Code Viewer */}
      <pre
        style={{
          flex: 1,
          margin: 0,
          padding: '1rem',
          overflow: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.82rem',
          lineHeight: 1.6,
          color: '#e2e8f0',
          background: '#0d1117',
        }}
      >
        <code>{currentCode}</code>
      </pre>
    </div>
  );
};
