import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toast } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Agentic - Solana AI Web3 Platform',
  description: 'Full-stack Web3 platform with AI-powered agents for Solana blockchain operations',
  keywords: ['Solana', 'Web3', 'AI', 'DeFi', 'NFT', 'Blockchain'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg bg-mesh min-h-screen">
        <AuthProvider>
          {children}
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
