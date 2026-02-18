'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Wallet } from 'lucide-react';

export function WalletConnect() {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Wallet connection logic will be implemented here
      // This would integrate with Solana wallet adapters
      console.log('Wallet connection to be implemented');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center gap-2"
    >
      <Wallet className="w-5 h-5" />
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
