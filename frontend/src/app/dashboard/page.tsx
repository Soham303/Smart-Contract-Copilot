import Link from 'next/link';

export default function DashboardPage() {
  const templates = [
    {
      id: 'template_fungible_token',
      name: 'Fungible Token',
      category: 'Token',
      desc: 'Standard Aptos Fungible Asset with mint control, supply caps, and burn capability.',
      badgeColor: '#3b82f6',
    },
    {
      id: 'template_nft_collection',
      name: 'NFT Collection',
      category: 'NFT',
      desc: 'Digital asset framework collection with 5% royalty, supply cap, and whitelist.',
      badgeColor: '#8b5cf6',
    },
    {
      id: 'template_escrow',
      name: 'Trade Escrow',
      category: 'Finance',
      desc: 'Two-party escrow holding funds in trust until conditions are met, with refund timeout.',
      badgeColor: '#10b981',
    },
    {
      id: 'template_vesting',
      name: 'Token Vesting',
      category: 'Finance',
      desc: 'Gradual linear release of tokens over time with a 30-day cliff schedule.',
      badgeColor: '#10b981',
    },
    {
      id: 'template_staking',
      name: 'Yield Staking',
      category: 'Finance',
      desc: 'Stake tokens to earn rewards with 7-day lockup duration and emergency pause.',
      badgeColor: '#10b981',
    },
    {
      id: 'template_voting_dao',
      name: 'Voting / DAO',
      category: 'Governance',
      desc: 'Decentralized proposal voting with 20% quorum and council member management.',
      badgeColor: '#f59e0b',
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Aptos Move Builder
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            Projects & Pre-Wired Templates
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Build visually, verify with rule-based security audits, and deploy directly to testnet.
          </p>
        </div>
        <Link
          href="/workspace/new-project"
          id="create-project-btn"
          style={{
            padding: '0.8rem 1.6rem',
            background: '#3b82f6',
            color: '#fff',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
          }}
        >
          + Blank Canvas Project
        </Link>
      </div>

      {/* Templates Grid */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
        Standard Contract Templates (Ready to Build & Deploy)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{tmpl.name}</h4>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${tmpl.badgeColor}20`,
                    color: tmpl.badgeColor,
                    border: `1px solid ${tmpl.badgeColor}40`,
                  }}
                >
                  {tmpl.category}
                </span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {tmpl.desc}
              </p>
            </div>

            <Link
              href={`/workspace/${tmpl.id}`}
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#60a5fa',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Open in Canvas Builder →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
