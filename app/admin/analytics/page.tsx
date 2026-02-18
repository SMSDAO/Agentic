'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { CustomLineChart, CustomBarChart, CustomPieChart } from '@/components/admin/Charts';
import { Card } from '@/components/ui/Card';
import { Users, TrendingUp, Activity, Coins } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const userGrowthData = [
    { name: 'Jan', users: 400, activeUsers: 250 },
    { name: 'Feb', users: 600, activeUsers: 380 },
    { name: 'Mar', users: 800, activeUsers: 520 },
    { name: 'Apr', users: 1200, activeUsers: 780 },
    { name: 'May', users: 1600, activeUsers: 1040 },
    { name: 'Jun', users: 2000, activeUsers: 1300 },
  ];

  const transactionVolumeData = [
    { name: 'Week 1', volume: 45000 },
    { name: 'Week 2', volume: 52000 },
    { name: 'Week 3', volume: 48000 },
    { name: 'Week 4', volume: 61000 },
  ];

  const transactionTypeData = [
    { name: 'Transfers', value: 45 },
    { name: 'Swaps', value: 30 },
    { name: 'Stakes', value: 15 },
    { name: 'Mints', value: 10 },
  ];

  const tvlData = [
    { name: 'Week 1', value: 1200000 },
    { name: 'Week 2', value: 1450000 },
    { name: 'Week 3', value: 1380000 },
    { name: 'Week 4', value: 1680000 },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics' }]} />

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="2,453"
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
            iconClass="text-neon-blue"
            bgClass="bg-neon-blue/10"
          />
          <StatsCard
            title="Transaction Volume"
            value="$1.2M"
            icon={TrendingUp}
            trend={{ value: 18.3, isPositive: true }}
            iconClass="text-neon-green"
            bgClass="bg-neon-green/10"
          />
          <StatsCard
            title="Active Agents"
            value="156"
            icon={Activity}
            trend={{ value: 24.7, isPositive: true }}
            iconClass="text-neon-purple"
            bgClass="bg-neon-purple/10"
          />
          <StatsCard
            title="TVL"
            value="$3.8M"
            icon={Coins}
            trend={{ value: 31.2, isPositive: true }}
            iconClass="text-neon-pink"
            bgClass="bg-neon-pink/10"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">User Growth</h3>
            <CustomLineChart data={userGrowthData} dataKeys={['users', 'activeUsers']} />
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Transaction Volume</h3>
            <CustomBarChart data={transactionVolumeData} dataKey="volume" />
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Transaction Types</h3>
            <CustomPieChart data={transactionTypeData} />
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Total Value Locked</h3>
            <CustomLineChart data={tvlData} dataKeys={['value']} />
          </Card>
        </div>
      </div>
    </div>
  );
}
