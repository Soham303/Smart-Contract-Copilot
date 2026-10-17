import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '../components/auth/AuthContext';
import { WalletProvider } from '../components/wallet/WalletContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { AuthModal } from '../components/auth/AuthModal';
import { PetraInstallModal } from '../components/wallet/PetraInstallModal';

export const metadata: Metadata = {
  title: 'Smart Contract Copilot • Move Studio Pristine',
  description: 'Deterministic visual construction, formal security audits, and measured gas optimization for Aptos Move smart contracts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <WalletProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--surface)' }}>
              <Header />
              <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
              <Footer />
            </div>
            <AuthModal />
            <PetraInstallModal />
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
