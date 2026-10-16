'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { ShieldCheck, Zap, Lock, Mail, User, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          setError(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else {
        const res = await register(email, password, name);
        if (!res.success) {
          setError(res.error || 'Failed to register account. Password must be at least 6 characters.');
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
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(180deg, #090d16 0%, #040711 100%)',
          border: '1px solid rgba(15, 118, 110, 0.35)',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(15, 118, 110, 0.15)',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0f766e 0%, #042f2e 100%)',
                border: '1px solid rgba(20, 184, 166, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.35)',
              }}
            >
              <Zap size={20} fill="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {tab === 'signin' ? 'Sign in to Copilot' : 'Create Developer Account'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Aptos Move Studio • MongoDB Atlas Connected
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '1.3rem',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: '#040711',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #1e293b',
          }}
        >
          <button
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            type="button"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'signin' ? 'rgba(15, 118, 110, 0.25)' : 'transparent',
              color: tab === 'signin' ? '#2dd4bf' : '#94a3b8',
              fontWeight: tab === 'signin' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              borderBottom: tab === 'signin' ? '2px solid #14b8a6' : '2px solid transparent',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            type="button"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'signup' ? 'rgba(15, 118, 110, 0.25)' : 'transparent',
              color: tab === 'signup' ? '#2dd4bf' : '#94a3b8',
              fontWeight: tab === 'signup' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              borderBottom: tab === 'signup' ? '2px solid #14b8a6' : '2px solid transparent',
            }}
          >
            Register
          </button>
        </div>

        {/* Quick Demo Login Option */}
        <button
          onClick={handleDemoLogin}
          type="button"
          disabled={loading}
          style={{
            padding: '9px 12px',
            background: 'rgba(15, 118, 110, 0.12)',
            border: '1px solid rgba(20, 184, 166, 0.3)',
            borderRadius: '8px',
            color: '#2dd4bf',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'background 0.15s ease',
          }}
        >
          <Zap size={14} />
          <span>Instant Demo Login (demo@copilot.io)</span>
        </button>

        {error && (
          <div
            style={{
              padding: '9px 12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {tab === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>Full Name</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#040711',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '0 10px',
                }}
              >
                <User size={15} color="#64748b" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Satoshi Aptos"
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>Email Address</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#040711',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '0 10px',
              }}
            >
              <Mail size={15} color="#64748b" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@move.studio"
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>Password</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#040711',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '0 10px',
              }}
            >
              <Lock size={15} color="#64748b" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px 0 rgba(15, 118, 110, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {loading ? (
              'Authenticating...'
            ) : tab === 'signin' ? (
              <>
                <span>Sign In to Studio</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <CheckCircle2 size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
