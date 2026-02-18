'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { CustomLineChart, CustomBarChart } from '@/components/admin/Charts';
import { Card } from '@/components/ui/Card';
import { Users, CreditCard, Coins, Activity, TrendingUp, Bot } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: number;
  activeAgents: number;
  totalValue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    totalVolume: 0,
    activeAgents: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Sample data for charts
  const userGrowthData = [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 600 },
    { name: 'Mar', users: 800 },
    { name: 'Apr', users: 1200 },
    { name: 'May', users: 1600 },
    { name: 'Jun', users: 2000 },
  ];

  const transactionVolumeData = [
    { name: 'Mon', volume: 12000 },
    { name: 'Tue', volume: 19000 },
    { name: 'Wed', volume: 15000 },
    { name: 'Thu', volume: 22000 },
    { name: 'Fri', volume: 28000 },
    { name: 'Sat', volume: 18000 },
    { name: 'Sun', volume: 14000 },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]} />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={loading ? '...' : stats.totalUsers.toLocaleString()}
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
            iconClass="text-neon-blue"
            bgClass="bg-neon-blue/10"
          />
          <StatsCard
            title="Active Users (24h)"
            value={loading ? '...' : stats.activeUsers.toLocaleString()}
            icon={Activity}
            trend={{ value: 8.2, isPositive: true }}
            iconClass="text-neon-green"
            bgClass="bg-neon-green/10"
          />
          <StatsCard
            title="Total Transactions"
            value={loading ? '...' : stats.totalTransactions.toLocaleString()}
            icon={CreditCard}
            trend={{ value: 5.4, isPositive: true }}
            iconClass="text-neon-purple"
            bgClass="bg-neon-purple/10"
          />
          <StatsCard
            title="Transaction Volume"
            value={loading ? '...' : `$${(stats.totalVolume / 1000).toFixed(1)}K`}
            icon={TrendingUp}
            trend={{ value: 15.3, isPositive: true }}
            iconClass="text-neon-pink"
            bgClass="bg-neon-pink/10"
          />
          <StatsCard
            title="Active AI Agents"
            value={loading ? '...' : stats.activeAgents}
            icon={Bot}
            trend={{ value: 22.1, isPositive: true }}
            iconClass="text-neon-yellow"
            bgClass="bg-neon-yellow/10"
          />
          <StatsCard
            title="Total Value Locked"
            value={loading ? '...' : `$${(stats.totalValue / 1000000).toFixed(2)}M`}
            icon={Coins}
            trend={{ value: 18.7, isPositive: true }}
            iconClass="text-neon-blue"
            bgClass="bg-neon-blue/10"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">User Growth</h3>
            <CustomLineChart data={userGrowthData} dataKeys={['users']} />
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Transaction Volume (7 Days)</h3>
            <CustomBarChart data={transactionVolumeData} dataKey="volume" />
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New user registration', user: 'john@example.com', time: '2 minutes ago' },
              { action: 'Token transfer', user: 'alice@example.com', time: '5 minutes ago' },
              { action: 'NFT minted', user: 'bob@example.com', time: '10 minutes ago' },
              { action: 'DeFi position opened', user: 'carol@example.com', time: '15 minutes ago' },
              { action: 'AI Agent started', user: 'dave@example.com', time: '20 minutes ago' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.user}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
