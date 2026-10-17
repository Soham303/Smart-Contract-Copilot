'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Home,
  Code2,
  ShieldAlert,
  ArrowLeft,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        minHeight: 'calc(100vh - 120px)',
        background: 'radial-gradient(ellipse at 50% 20%, rgba(15, 118, 110, 0.12) 0%, rgba(248, 249, 255, 0) 70%), var(--surface)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background grid and ambient rings */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(15, 118, 110, 0.08) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '680px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Glowing Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(15, 118, 110, 0.08)',
            border: '1px solid rgba(15, 118, 110, 0.25)',
            boxShadow: '0 0 20px rgba(20, 184, 166, 0.15)',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#0f766e',
              boxShadow: '0 0 8px #14b8a6',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            0x404 • Bytecode Pointer Unresolved
          </span>
        </div>

        {/* Big Glitch/404 Typography */}
        <h1
          style={{
            fontSize: 'clamp(4.5rem, 12vw, 8rem)',
            fontWeight: 900,
            lineHeight: 1,
            margin: '0 0 0.5rem',
            fontFamily: 'var(--font-mono)',
            background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 60%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em',
            textShadow: '0 10px 30px rgba(15, 118, 110, 0.1)',
          }}
        >
          404
        </h1>

        {/* Heading */}
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          Resource Not Found on Ledger
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '520px',
            margin: '0 0 2rem',
          }}
        >
          The smart contract module, workspace project, or ledger path you were looking for has either been relocated, pruned from temporary memory, or never deployed to this branch.
        </p>

        {/* Diagnostic Terminal Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '520px',
            background: 'linear-gradient(180deg, #090d16 0%, #030712 100%)',
            border: '1px solid rgba(15, 118, 110, 0.35)',
            borderRadius: '12px',
            padding: '16px 20px',
            textAlign: 'left',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: '#94a3b8',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 25px rgba(15, 118, 110, 0.1)',
            marginBottom: '2.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '10px',
              marginBottom: '10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '6px' }}>
                aptos-move-vm :: router
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#14b8a6', fontWeight: 600 }}>
              LEDGER_DIAGNOSTIC
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: 1.5 }}>
            <div>
              <span style={{ color: '#64748b' }}>&gt; STATUS_CODE: </span>
              <span style={{ color: '#f87171', fontWeight: 700 }}>404_RESOURCE_NOT_FOUND</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>&gt; ERROR_CODE:  </span>
              <span style={{ color: '#fbbf24' }}>0x1::MODULE_POINTER_NULL</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>&gt; GAS_CONSUMED: </span>
              <span style={{ color: '#2dd4bf' }}>0 Octas (Transaction rolled back)</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>&gt; RESOLUTION:   </span>
              <span style={{ color: '#e2e8f0' }}>Redirect execution to verified studio entrypoint</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(15, 118, 110, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <Home size={16} />
            Return to Studio Home
          </Link>

          <Link
            href="/workspace/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 20px',
              borderRadius: '10px',
              background: 'var(--surface-container-lowest, #ffffff)',
              border: '1px solid var(--border-subtle, #e2e8f0)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            <Code2 size={16} color="var(--primary)" />
            Open Move Studio
          </Link>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = '/';
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px 18px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid var(--border-subtle, #e2e8f0)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>

        {/* Quick Links Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle, #e2e8f0)',
            width: '100%',
            maxWidth: '520px',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            EXPLORE MODULES:
          </span>
          <Link
            href="/audit"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldAlert size={13} />
            Formal Audits
          </Link>
          <Link
            href="/gas-optimizer"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Cpu size={13} />
            Gas Telemetry
          </Link>
          <Link
            href="/templates"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Layers size={13} />
            Contract Templates
          </Link>
        </div>
      </div>
    </div>
  );
}
