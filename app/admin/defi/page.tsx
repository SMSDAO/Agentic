'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';

interface DeFiPosition {
  id: string;
  user_id: string;
  protocol: string;
  position_type: string;
  amount: number;
  value_usd: number;
  apy: number;
}

export default function AdminDeFiPage() {
  const positions: DeFiPosition[] = [
    {
      id: '1',
      user_id: 'user1',
      protocol: 'Jupiter',
      position_type: 'liquidity',
      amount: 1000,
      value_usd: 50000,
      apy: 12.5,
    },
  ];

  const columns: Column<DeFiPosition>[] = [
    {
      key: 'protocol',
      label: 'Protocol',
      sortable: true,
    },
    {
      key: 'position_type',
      label: 'Type',
      render: (value) => (
        <Badge variant="info" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => value.toFixed(2),
    },
    {
      key: 'value_usd',
      label: 'Value',
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'apy',
      label: 'APY',
      sortable: true,
      render: (value) => `${value}%`,
    },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'DeFi' }]} />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Value Locked"
            value="$3.8M"
            icon={DollarSign}
            iconClass="text-neon-blue"
            bgClass="bg-neon-blue/10"
          />
          <StatsCard
            title="Active Positions"
            value="1,245"
            icon={Activity}
            iconClass="text-neon-green"
            bgClass="bg-neon-green/10"
          />
          <StatsCard
            title="Unique Users"
            value="856"
            icon={Users}
            iconClass="text-neon-purple"
            bgClass="bg-neon-purple/10"
          />
          <StatsCard
            title="Avg APY"
            value="15.3%"
            icon={TrendingUp}
            iconClass="text-neon-pink"
            bgClass="bg-neon-pink/10"
          />
        </div>

        {/* Positions Table */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-bold mb-6">Active Positions</h2>
          <DataTable data={positions} columns={columns} />
        </div>
      </div>
    </div>
  );
}
