'use client';

import React from 'react';
import { useWallet } from './WalletContext';
import {
  ExternalLink,
  ShieldCheck,
  Zap,
  X,
  Download,
  RefreshCw,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const PetraInstallModal: React.FC = () => {
  const {
    showInstallModal,
    setShowInstallModal,
    connectWallet,
    useDeveloperAccount,
    isConnecting,
  } = useWallet();

  if (!showInstallModal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(180deg, #090d16 0%, #040711 100%)',
          border: '1px solid rgba(15, 118, 110, 0.35)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(15, 118, 110, 0.15)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowInstallModal(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0f766e 0%, #042f2e 100%)',
              border: '1px solid rgba(20, 184, 166, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)',
            }}
          >
            <ShieldCheck size={24} color="#14b8a6" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Petra Wallet Required
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              Aptos Ecosystem Standard Wallet
            </span>
          </div>
        </div>

        {/* Body Text */}
        <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
          The <strong>Petra Aptos Wallet</strong> extension was not detected in your browser. To sign transactions, verify cryptographic keys, and deploy Move smart contracts directly to the Aptos blockchain, please install the extension.
        </p>

        {/* Action 1: Install Petra Extension */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
            }}
          >
            <Download size={16} />
            Install Petra Wallet (petra.app)
            <ExternalLink size={14} />
          </a>

          <a
            href="https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Open in Chrome Web Store
            <ExternalLink size={12} />
          </a>

          {/* Retry Connection Button */}
          <button
            onClick={() => connectWallet()}
            disabled={isConnecting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(15, 118, 110, 0.15)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              color: '#2dd4bf',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            <RefreshCw size={14} className={isConnecting ? 'spin' : ''} />
            {isConnecting ? 'Detecting Extension...' : 'I Installed It — Re-check Connection'}
          </button>
        </div>

        {/* Divider / Fallback */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0 14px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            Or Test Without Extension
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Action 2: Use Developer Testnet Account */}
        <button
          onClick={useDeveloperAccount}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            color: '#94a3b8',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Cpu size={14} color="#14b8a6" />
          Use Pre-Funded Developer Testnet Account
        </button>

      </div>
    </div>
  );
};
