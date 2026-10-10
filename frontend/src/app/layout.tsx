import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '../components/auth/AuthContext';
import { Header } from '../components/common/Header';
import { AuthModal } from '../components/auth/AuthModal';

export const metadata: Metadata = {
  title: 'Smart Contract Copilot - The Canva for Move Smart Contracts',
  description: 'Design, verify, optimize, and deploy Move smart contracts visually.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
