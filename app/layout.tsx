import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import '../styles/globals.css';

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-dark-bg bg-mesh min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
