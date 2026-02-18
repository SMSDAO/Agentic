'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Coins, TrendingUp, Users, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface TokenInfo {
  id: string;
  token_address: string;
  token_symbol: string;
  total_holders: number;
  total_supply: number;
  total_value_usd: number;
  created_at: string;
}

export default function AdminTokensPage() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [stats, setStats] = useState({
    totalTokens: 0,
    totalHolders: 0,
    totalValue: 0,
    activeTokens: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/admin/tokens');
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<TokenInfo>[] = [
    {
      key: 'token_symbol',
      label: 'Symbol',
      sortable: true,
      render: (value) => (
        <Badge variant="info" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'token_address',
      label: 'Address',
      render: (value) => (
        <code className="text-xs text-neon-blue">
          {value.slice(0, 8)}...{value.slice(-6)}
        </code>
      ),
    },
    {
      key: 'total_holders',
      label: 'Holders',
      sortable: true,
    },
    {
      key: 'total_value_usd',
      label: 'Total Value',
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM d, yyyy'),
    },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Tokens' }]} />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Tokens"
            value={stats.totalTokens}
            icon={Coins}
            iconClass="text-neon-blue"
            bgClass="bg-neon-blue/10"
          />
          <StatsCard
            title="Total Holders"
            value={stats.totalHolders}
            icon={Users}
            iconClass="text-neon-purple"
            bgClass="bg-neon-purple/10"
          />
          <StatsCard
            title="Total Value"
            value={`$${(stats.totalValue / 1000).toFixed(1)}K`}
            icon={TrendingUp}
            iconClass="text-neon-green"
            bgClass="bg-neon-green/10"
          />
          <StatsCard
            title="Active Tokens"
            value={stats.activeTokens}
            icon={Activity}
            iconClass="text-neon-pink"
            bgClass="bg-neon-pink/10"
          />
        </div>

        {/* Tokens Table */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-bold mb-6">Token List</h2>
          <DataTable
            data={tokens}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}
