'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { Bell, ShieldCheck, Zap, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isLoggedIn, logout, openAuthModal } = useAuth();
  const [walletConnected, setWalletConnected] = useState<string>('0x7a3...e91b');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Visual Builder', href: '/workspace/demo' },
    { label: 'Security & Audit', href: '/audit' },
    { label: 'Templates', href: '/templates' },
    { label: 'Gas Optimization [Demo]', href: '/gas-optimizer' },
    { label: 'Market Radar', href: '/news' },
    { label: 'Account Hub', href: '/account' },
  ];

  const handleWalletToggle = () => {
    if (walletConnected) {
      setWalletConnected('');
    } else {
      setWalletConnected('0x7a3...e91b');
    }
  };

  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-container-lowest)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left: Brand Identity + Contextual Module Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0f766e 0%, #042f2e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(15, 118, 110, 0.2)',
            }}
          >
            <Zap size={18} fill="#ffffff" />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Smart Contract Copilot
          </span>
        </Link>

        {/* Contextual Module Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            background: 'var(--surface-container-low)',
            border: '1px solid var(--surface-dim)',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--primary)',
            letterSpacing: '0.02em',
          }}
        >
          <span>Move / Aptos</span>
        </div>
      </div>

      {/* Center: Primary Route Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navLinks.map((link) => {
          const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          const isDemo = link.label.includes('[Demo]');
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 11px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary)' : isDemo ? 'var(--risk-medium)' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary-container)' : 'transparent',
                border: isActive ? '1px solid rgba(15, 118, 110, 0.15)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Network Status + Connected Petra Wallet + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Network Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'var(--tertiary-container)',
            border: '1px solid var(--tertiary-border)',
            fontSize: '0.72rem',
            color: 'var(--tertiary)',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span className="pulse-dot" />
          Aptos Testnet
        </div>

        {/* Connected Petra Wallet Pill */}
        <button
          onClick={handleWalletToggle}
          id="petra-wallet-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '9999px',
            background: walletConnected ? 'var(--surface-container-low)' : 'var(--primary)',
            border: `1px solid ${walletConnected ? 'var(--border-subtle)' : 'var(--primary)'}`,
            color: walletConnected ? 'var(--text-primary)' : '#ffffff',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            transition: 'all 0.15s ease',
          }}
          title={walletConnected ? 'Click to toggle wallet state' : 'Connect Petra Wallet'}
        >
          <ShieldCheck size={14} color={walletConnected ? 'var(--security-emerald)' : '#ffffff'} />
          {walletConnected ? `Petra (${walletConnected})` : 'Connect Petra'}
        </button>

        {/* Notification Bell */}
        <button
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'background 0.15s ease',
          }}
          title="Notifications (Formal Prover Active)"
        >
          <Bell size={15} />
        </button>

        {/* User Profile Avatar: Nina Vance */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 4px 2px 2px',
              borderRadius: '9999px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0f766e 0%, #3b82f6 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              NV
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1, display: 'none' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>Nina Vance</div>
            </div>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {showUserDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '210px',
                background: 'var(--surface-container-lowest)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                padding: '8px',
                zIndex: 200,
              }}
            >
              <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Nina Vance</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>nina@move.studio • Developer Pro</div>
              </div>
              <Link
                href="/account"
                onClick={() => setShowUserDropdown(false)}
                style={{
                  display: 'block',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Account & Deploy Hub
              </Link>
              <Link
                href="/audit"
                onClick={() => setShowUserDropdown(false)}
                style={{
                  display: 'block',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Security & Audit Suite
              </Link>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  if (isLoggedIn) logout();
                  else openAuthModal();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.78rem',
                  color: isLoggedIn ? 'var(--risk-critical)' : 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                {isLoggedIn ? 'Sign Out' : 'Sign In / Register'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
