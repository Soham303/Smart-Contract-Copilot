'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { useWallet } from '../wallet/WalletContext';
import { Bell, ShieldCheck, Zap, ChevronDown, Wallet, Copy, Check, ExternalLink, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout, openAuthModal } = useAuth();
  const {
    walletAddress,
    shortAddress,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    balanceApt,
    network,
  } = useWallet();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Visual Builder', href: '/workspace/demo' },
    { label: 'Security & Audit', href: '/audit' },
    { label: 'Templates', href: '/templates' },
    { label: 'Contract Drive', href: '/drive' },
    { label: 'Gas Optimization [Demo]', href: '/gas-optimizer' },
    { label: 'Market Radar', href: '/news' },
    { label: 'Account Hub', href: '/account' },
  ];

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
        zIndex: 1000,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left: Brand Identity + Contextual Module Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="https://res.cloudinary.com/dmgjftmqa/image/upload/v1792224817/logo_lxnu5d.png"
            alt="Smart Contract Copilot Logo"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
            }}
          />

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

        {/* Real Petra Wallet Integration */}
        {isConnected ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowWalletDropdown(!showWalletDropdown)}
              id="petra-wallet-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '9999px',
                background: 'var(--surface-container-low)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Click to view connected wallet details or disconnect"
            >
              <ShieldCheck size={14} color="var(--security-emerald)" />
              Petra ({shortAddress})
              <ChevronDown size={12} color="var(--text-muted)" />
            </button>

            {showWalletDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '300px',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
                  zIndex: 1200,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Petra Aptos Wallet
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--surface-container-low)',
                      color: 'var(--primary)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {network.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    background: 'var(--surface-container-low)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    ACCOUNT ADDRESS
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {shortAddress}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={() => {
                          if (walletAddress) {
                            navigator.clipboard.writeText(walletAddress);
                            setCopiedWallet(true);
                            setTimeout(() => setCopiedWallet(false), 2000);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          color: 'var(--text-muted)',
                        }}
                        title="Copy full address"
                      >
                        {copiedWallet ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                      </button>
                      <a
                        href={`https://explorer.aptoslabs.com/account/${walletAddress}?network=testnet`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--primary)', display: 'inline-flex', padding: '2px' }}
                        title="View on Aptos Explorer"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Testnet Balance</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {balanceApt} <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>APT</span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    disconnectWallet();
                    setShowWalletDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #fee2e2',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <LogOut size={13} />
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => connectWallet()}
            disabled={isConnecting}
            id="petra-wallet-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--primary)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
            title="Connect Petra Wallet Extension"
          >
            <Wallet size={14} />
            {isConnecting ? 'Connecting...' : 'Connect Petra'}
          </button>
        )}

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

        {/* User Profile Avatar or Sign In CTA */}
        {!isLoggedIn ? (
          <button
            onClick={openAuthModal}
            id="header-signin-btn"
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(15, 118, 110, 0.4)',
              background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(15, 118, 110, 0.25)',
            }}
          >
            <span>Sign In</span>
          </button>
        ) : (
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
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {user?.name
                  ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                  : user?.email
                    ? user.email.substring(0, 2).toUpperCase()
                    : 'US'}
              </div>
              <ChevronDown size={12} color="var(--text-muted)" />
            </button>

            {showUserDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '230px',
                  background: 'var(--surface-container-lowest, #090d16)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle, #1e293b)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '10px',
                  zIndex: 2000,
                }}
              >
                <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle, #1e293b)', marginBottom: '6px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary, #ffffff)' }}>
                    {user?.name || 'Copilot Developer'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', wordBreak: 'break-all' }}>
                    {user?.email} • {user?.plan === 'developer' ? 'Pro Plan' : 'Free Tier'}
                  </div>
                </div>
                <Link
                  href="/account"
                  onClick={() => setShowUserDropdown(false)}
                  style={{
                    display: 'block',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary, #cbd5e1)',
                  }}
                >
                  Account & Deployment Hub
                </Link>
                <Link
                  href="/drive"
                  onClick={() => setShowUserDropdown(false)}
                  style={{
                    display: 'block',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary, #cbd5e1)',
                  }}
                >
                  Contract Drive
                </Link>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                    router.push('/');
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.78rem',
                    color: 'var(--risk-critical, #ef4444)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
