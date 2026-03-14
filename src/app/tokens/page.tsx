import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Send, Plus, Coins } from 'lucide-react';

export default function TokensPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">Token Operations</h1>
            <p className="text-gray-400">Manage your SPL tokens and perform operations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Send className="w-4 h-4 mr-2" />
              Transfer
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Deploy Token
            </Button>
          </div>
        </div>

        {/* Token List */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Solana', symbol: 'SOL', balance: '45.23', value: '$8,456.78', change: '+5.2%' },
            { name: 'USD Coin', symbol: 'USDC', balance: '1,250.00', value: '$1,250.00', change: '0.0%' },
            { name: 'Bonk', symbol: 'BONK', balance: '1,000,000', value: '$234.56', change: '+15.3%' },
          ].map((token) => (
            <Card key={token.symbol}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple" />
                  <div>
                    <p className="font-bold text-lg">{token.name}</p>
                    <p className="text-gray-400">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{token.balance}</p>
                  <p className="text-gray-400">{token.value}</p>
                  <p className={token.change.startsWith('+') ? 'text-neon-green' : 'text-neon-pink'}>
                    {token.change}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-neon-blue" />
                Token Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Deploy new SPL tokens with Metaplex</p>
              <Button className="mt-4 w-full" size="sm">Deploy Now</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-neon-purple" />
                Transfer Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Send tokens to any Solana address</p>
              <Button className="mt-4 w-full" size="sm" variant="secondary">Transfer</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-neon-pink" />
                Airdrop (ZK)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">ZK compressed airdrops via Light Protocol</p>
              <Button className="mt-4 w-full" size="sm" variant="secondary">Airdrop</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
