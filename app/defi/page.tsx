import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeftRight, Droplet, TrendingUp, Zap } from 'lucide-react';

export default function DeFiPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold glow-text mb-2">DeFi Operations</h1>
          <p className="text-gray-400">Swap, stake, and provide liquidity across protocols</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ArrowLeftRight, label: 'Swap', color: 'neon-blue' },
            { icon: Droplet, label: 'Liquidity', color: 'neon-purple' },
            { icon: TrendingUp, label: 'Stake', color: 'neon-pink' },
            { icon: Zap, label: 'Farm', color: 'neon-green' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.label} variant="secondary" className="h-24 flex-col gap-2">
                <Icon className={`w-8 h-8 text-${action.color}`} />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Protocol Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Jupiter',
              description: 'Best price swaps across Solana',
              features: ['Token swaps', 'Price routing', 'Low fees'],
            },
            {
              name: 'Raydium',
              description: 'AMM and liquidity pools',
              features: ['CPMM pools', 'CLMM pools', 'AMMv4'],
            },
            {
              name: 'Orca',
              description: 'Concentrated liquidity',
              features: ['Whirlpools', 'Yield farming', 'Low slippage'],
            },
            {
              name: 'Meteora',
              description: 'Dynamic liquidity solutions',
              features: ['DLMM pools', 'Alpha Vault', 'Dynamic AMM'],
            },
            {
              name: 'Kamino',
              description: 'Lending and borrowing',
              features: ['Supply assets', 'Borrow funds', 'Earn yield'],
            },
            {
              name: 'Drift',
              description: 'Perpetuals and lending',
              features: ['Perps trading', 'Vaults', 'Lending'],
            },
          ].map((protocol) => (
            <Card key={protocol.name}>
              <CardHeader>
                <CardTitle>{protocol.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{protocol.description}</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  {protocol.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Button className="w-full mt-4" size="sm" variant="secondary">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cross-chain Bridge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Bridge assets across chains using deBridge DLN
              </p>
              <Button className="w-full" variant="secondary">Bridge Assets</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jito Bundles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Bundle transactions for MEV protection and priority
              </p>
              <Button className="w-full" variant="secondary">Create Bundle</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
