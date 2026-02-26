import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function MarketPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold glow-text mb-2">Market Data</h1>
          <p className="text-gray-400">Real-time prices, analytics, and market insights</p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Market Cap</p>
                <p className="text-2xl font-bold">$2.45T</p>
                <p className="text-sm text-neon-green">+3.2%</p>
              </div>
              <Activity className="w-8 h-8 text-neon-blue" />
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">24h Volume</p>
                <p className="text-2xl font-bold">$145.2B</p>
                <p className="text-sm text-neon-green">+12.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-neon-green" />
            </div>
          </Card>

          <Card hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">BTC Dominance</p>
                <p className="text-2xl font-bold">48.3%</p>
                <p className="text-sm text-neon-pink">-0.5%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-neon-pink" />
            </div>
          </Card>
        </div>

        {/* Trending Tokens */}
        <Card hover={false} className="mb-8">
          <CardHeader>
            <CardTitle>Trending on Solana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm">
                    <th className="pb-4">#</th>
                    <th className="pb-4">Token</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">24h Change</th>
                    <th className="pb-4">Volume</th>
                    <th className="pb-4">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: 'Solana', symbol: 'SOL', price: '$186.45', change: '+5.23%', volume: '$2.4B', mcap: '$89.5B' },
                    { rank: 2, name: 'Bonk', symbol: 'BONK', price: '$0.000023', change: '+15.67%', volume: '$145M', mcap: '$1.8B' },
                    { rank: 3, name: 'Jito', symbol: 'JTO', price: '$3.45', change: '+8.92%', volume: '$89M', mcap: '$456M' },
                    { rank: 4, name: 'Pyth Network', symbol: 'PYTH', price: '$0.67', change: '+4.12%', volume: '$56M', mcap: '$2.3B' },
                  ].map((token) => (
                    <tr key={token.rank} className="border-t border-white/10">
                      <td className="py-4">{token.rank}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple" />
                          <div>
                            <p className="font-medium">{token.name}</p>
                            <p className="text-sm text-gray-400">{token.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-medium">{token.price}</td>
                      <td className={`py-4 ${token.change.startsWith('+') ? 'text-neon-green' : 'text-neon-pink'}`}>
                        {token.change}
                      </td>
                      <td className="py-4">{token.volume}</td>
                      <td className="py-4">{token.mcap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>CoinGecko Pro API</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Real-time price data and market analytics
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Token prices</li>
                <li>• Market trends</li>
                <li>• Top gainers/losers</li>
                <li>• Historical data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pyth Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                High-fidelity oracle price feeds
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Real-time prices</li>
                <li>• Low latency</li>
                <li>• Multiple assets</li>
                <li>• On-chain data</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
