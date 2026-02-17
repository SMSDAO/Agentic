import { Navbar } from '@/components/layout/Navbar';
import { Wallet, TrendingUp, Image as ImageIcon, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Balance',
      value: '$12,345.67',
      change: '+12.5%',
      icon: Wallet,
      color: 'neon-blue',
    },
    {
      title: 'Active Positions',
      value: '8',
      change: '+2',
      icon: TrendingUp,
      color: 'neon-purple',
    },
    {
      title: 'NFT Holdings',
      value: '24',
      change: '+5',
      icon: ImageIcon,
      color: 'neon-pink',
    },
    {
      title: 'Recent Transactions',
      value: '156',
      change: '+23',
      icon: Activity,
      color: 'neon-green',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold glow-text mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here&apos;s your portfolio overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} hover={false}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className={`text-sm text-${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-elevated">
                    <div>
                      <p className="font-medium">Token Transfer</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                    <p className="text-neon-green">+100 USDC</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Portfolio Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'SOL', percentage: 45, color: 'neon-blue' },
                  { name: 'USDC', percentage: 30, color: 'neon-purple' },
                  { name: 'Other', percentage: 25, color: 'neon-pink' },
                ].map((token) => (
                  <div key={token.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{token.name}</span>
                      <span>{token.percentage}%</span>
                    </div>
                    <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${token.color}`}
                        style={{ width: `${token.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
