'use client';

import React, { useState, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import {
  Save,
  ShieldCheck,
  Download,
  FileCode,
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MonacoMoveEditorProps {
  files: Record<string, string>;
  projectName: string;
  onSave?: (updatedFiles: Record<string, string>) => void;
  onRunAudit?: (code: string) => void;
  onDeploy?: () => void;
  readOnly?: boolean;
}

export const MonacoMoveEditor: React.FC<MonacoMoveEditorProps> = ({
  files: initialFiles,
  projectName,
  onSave,
  onRunAudit,
  onDeploy,
  readOnly = false,
}) => {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const fileNames = Object.keys(files);
  const [activeFile, setActiveFile] = useState<string>(
    fileNames.find((f) => f.endsWith('.move')) || fileNames[0] || 'sources/contract.move'
  );
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const currentCode = files[activeFile] || '';

  const handleEditorChange = (value: string | undefined) => {
    if (readOnly) return;
    const newCode = value ?? '';
    setFiles((prev) => ({
      ...prev,
      [activeFile]: newCode,
    }));
    setIsDirty(true);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(files);
      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
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

  // Register Aptos Move Syntax in Monaco
  const handleEditorWillMount = (monaco: Monaco) => {
    // Register Move language definition if not already registered
    if (!monaco.languages.getLanguages().some((l: any) => l.id === 'move')) {
      monaco.languages.register({ id: 'move' });
      monaco.languages.setMonarchTokensProvider('move', {
        defaultToken: '',
        tokenPostfix: '.move',
        keywords: [
          'module',
          'struct',
          'has',
          'key',
          'store',
          'drop',
          'copy',
          'public',
          'entry',
          'fun',
          'acquires',
          'let',
          'mut',
          'assert!',
          'const',
          'use',
          'spec',
          'pragma',
          'schema',
          'include',
          'aborts_if',
          'ensures',
          'requires',
          'invariant',
          'vector',
          'address',
          'signer',
          'bool',
          'u8',
          'u16',
          'u32',
          'u64',
          'u128',
          'u256',
          'true',
          'false',
          'if',
          'else',
          'while',
          'loop',
          'return',
          'break',
          'continue',
        ],
        operators: ['=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=', '&&', '||', '+', '-', '*', '/', '&', '|', '^', '%'],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [/[a-zA-Z_$][\w$]*/, {
              cases: {
                '@keywords': 'keyword',
                '@default': 'identifier',
              },
            }],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/@symbols/, {
              cases: {
                '@operators': 'operator',
                '@default': '',
              },
            }],
            [/\d+(_\d+)*/, 'number'],
            [/"([^"\\]|\\.)*"/, 'string'],
            [/'([^'\\]|\\.)*'/, 'string'],
          ],
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
          comment: [
            [/[^\/*]+/, 'comment'],
            [/\/\*/, 'comment', '@push'],
            ['\\*/', 'comment', '@pop'],
            [/[\/*]/, 'comment'],
          ],
        },
      });

      // Custom Move Theme
      monaco.editor.defineTheme('move-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '2dd4bf', fontStyle: 'bold' },
          { token: 'identifier', foreground: 'e2e8f0' },
          { token: 'string', foreground: '34d399' },
          { token: 'number', foreground: 'fbbf24' },
          { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
          { token: 'operator', foreground: '38bdf8' },
        ],
        colors: {
          'editor.background': '#090d16',
          'editor.foreground': '#e2e8f0',
          'editor.lineHighlightBackground': '#111827',
          'editorLineNumber.foreground': '#475569',
          'editorLineNumber.activeForeground': '#2dd4bf',
          'editorCursor.foreground': '#2dd4bf',
          'editor.selectionBackground': '#1e293b',
        },
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#090d16',
        color: '#e2e8f0',
      }}
    >
      {/* Editor Sub-Header Toolbar */}
      <div
        style={{
          height: '46px',
          background: '#0d121f',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 12px',
        }}
      >
        {/* Left: File Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {fileNames.map((fn) => {
            const isActive = activeFile === fn;
            return (
              <button
                key={fn}
                onClick={() => setActiveFile(fn)}
                style={{
                  padding: '7px 14px',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #2dd4bf' : '2px solid transparent',
                  background: isActive ? '#090d16' : 'transparent',
                  color: isActive ? '#f8fafc' : '#64748b',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isActive ? 600 : 400,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  borderRadius: '4px 4px 0 0',
                }}
              >
                {fn.endsWith('.move') ? (
                  <FileCode size={13} color={isActive ? '#2dd4bf' : '#64748b'} />
                ) : (
                  <FileText size={13} color={isActive ? '#38bdf8' : '#64748b'} />
                )}
                <span>{fn}</span>
                {isDirty && isActive && <span style={{ color: '#fbbf24' }}>●</span>}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {saveSuccess && (
            <span
              style={{
                color: '#34d399',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={13} />
              Saved
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={!isDirty || readOnly}
            style={{
              background: isDirty ? '#0f766e' : 'rgba(255,255,255,0.05)',
              color: isDirty ? '#ffffff' : '#64748b',
              border: '1px solid #334155',
              borderRadius: '5px',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: isDirty ? 'pointer' : 'default',
            }}
          >
            <Save size={13} />
            Save (Ctrl+S)
          </button>

          {onRunAudit && (
            <button
              onClick={() => onRunAudit(currentCode)}
              style={{
                background: 'rgba(5, 150, 105, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(5, 150, 105, 0.4)',
                borderRadius: '5px',
                padding: '5px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
            >
              <ShieldCheck size={13} />
              Audit Code
            </button>
          )}

          <button
            onClick={handleDownload}
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#cbd5e1',
              border: '1px solid #334155',
              borderRadius: '5px',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
          >
            <Download size={13} />
            Download
          </button>

          {onDeploy && (
            <button
              onClick={onDeploy}
              style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
            >
              <Play size={12} fill="#ffffff" />
              Deploy
            </button>
          )}
        </div>
      </div>

      {/* Main Monaco Editor */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Editor
          height="100%"
          language={activeFile.endsWith('.move') ? 'move' : 'ini'}
          theme="move-dark"
          value={currentCode}
          onChange={handleEditorChange}
          beforeMount={handleEditorWillMount}
          options={{
            readOnly,
            fontSize: 13,
            fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
            lineNumbers: 'on',
            minimap: { enabled: true, maxColumn: 80 },
            scrollBeyondLastLine: false,
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
};
