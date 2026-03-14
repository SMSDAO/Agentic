import type { Metadata } from 'next';
import '../styles/globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
