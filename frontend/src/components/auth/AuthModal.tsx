'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in');
        }
      } else {
        const res = await register(email, password, name);
        if (!res.success) {
          setError(res.error || 'Failed to register account');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await login('demo@copilot.io', 'copilot123');
      if (!res.success) {
        setError(res.error || 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 15, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: '420px',
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              {tab === 'signin' ? 'Sign in to Copilot' : 'Create an Account'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Save projects, track on-chain deployments & export reports.
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#090d16', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <button
            onClick={() => { setTab('signin'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'signin' ? '#1e293b' : 'transparent',
              color: tab === 'signin' ? '#fff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'signup' ? '#1e293b' : 'transparent',
              color: tab === 'signup' ? '#fff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Button */}
        <button
          onClick={handleDemoLogin}
          type="button"
          disabled={loading}
          style={{
            padding: '8px 12px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            color: '#60a5fa',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ⚡ Instant Demo Login (demo@copilot.io)
        </button>

        {error && (
          <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {tab === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nina Founder"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#090d16',
                border: '1px solid #1e293b',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#090d16',
                border: '1px solid #1e293b',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '6px',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
            }}
          >
            {loading ? 'Authenticating...' : tab === 'signin' ? 'Sign In →' : 'Create Free Account →'}
          </button>
        </form>
      </div>
    </div>
  );
};
