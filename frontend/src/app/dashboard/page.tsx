import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Projects & Templates</h1>
          <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>Manage your visual Move contracts and deploy to Aptos testnet.</p>
        </div>
        <Link
          href="/workspace/new"
          id="create-project-btn"
          style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: '#fff', borderRadius: '6px', fontWeight: 600 }}
        >
          + New Project
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Fungible Token</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Standard Aptos Fungible Asset with mint control and transfer limits.</p>
          <Link href="/workspace/token-template" style={{ color: '#60a5fa', fontSize: '0.875rem', fontWeight: 500 }}>
            Open Template →
          </Link>
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>NFT Collection</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Digital asset framework collection with bounded royalties and whitelist.</p>
          <Link href="/workspace/nft-template" style={{ color: '#60a5fa', fontSize: '0.875rem', fontWeight: 500 }}>
            Open Template →
          </Link>
        </div>
      </div>
    </div>
  );
}
