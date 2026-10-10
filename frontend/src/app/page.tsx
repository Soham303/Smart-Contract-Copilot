import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <header style={{ maxWidth: '800px', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          Aptos Move • Testnet Verified Pipeline
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Smart Contract Copilot
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#9ca3af', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          The Canva for Move smart contracts: build visually, get AI help at the edges, and verify everything before it touches the chain.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            href="/workspace/demo"
            id="try-guest-button"
            style={{ padding: '0.875rem 2rem', background: '#3b82f6', color: '#fff', borderRadius: '8px', fontWeight: 600, boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)', transition: 'transform 0.2s' }}
          >
            Try without signing up
          </Link>
          <Link
            href="/dashboard"
            id="dashboard-button"
            style={{ padding: '0.875rem 2rem', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '8px', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            Dashboard
          </Link>
        </div>
      </header>
    </div>
  );
}
