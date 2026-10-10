'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoggedIn, logout, openAuthModal } = useAuth();
  const [walletConnected, setWalletConnected] = useState<string | null>(null);

  const handleConnectWallet = () => {
    if (walletConnected) {
      setWalletConnected(null);
    } else {
      setWalletConnected('0x9a83...cdef');
    }
  };

  const navLinks = [
    { label: '🎨 Canvas Builder', href: '/workspace/demo' },
    { label: '⚡ Gas Optimizer (USP)', href: '/gas-optimizer' },
    { label: '📁 Templates & Dashboard', href: '/dashboard' },
  ];

  return (
    <header
      style={{
        height: '60px',
        borderBottom: '1px solid #1e293b',
        background: '#090d16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #93c5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Smart Contract Copilot
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Network Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.75rem',
            color: '#34d399',
            fontWeight: 600,
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          Aptos Testnet
        </div>

        {/* User Auth Section */}
        {isLoggedIn && user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{user.plan} tier</div>
            </div>
            <button
              onClick={logout}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            id="signin-btn"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign In / Register
          </button>
        )}

        {/* Wallet Connection Button */}
        <button
          onClick={handleConnectWallet}
          id="petra-wallet-btn"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: walletConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${walletConnected ? '#10b981' : '#3b82f6'}`,
            color: walletConnected ? '#34d399' : '#60a5fa',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {walletConnected ? `Petra (${walletConnected})` : 'Connect Petra'}
        </button>
      </div>
    </header>
  );
};
