'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatsCard } from '@/components/admin/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Bot, Activity, Zap, Database } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  user_id: string;
  is_active: boolean;
  memory_count: number;
  last_active: string;
}

export default function AdminAgentsPage() {
  const agents: Agent[] = [
    {
      id: '1',
      name: 'Trading Bot Alpha',
      user_id: 'user1',
      is_active: true,
      memory_count: 145,
      last_active: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'DeFi Advisor',
      user_id: 'user2',
      is_active: true,
      memory_count: 89,
      last_active: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      name: 'NFT Scout',
      user_id: 'user3',
      is_active: false,
      memory_count: 234,
      last_active: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const columns: Column<Agent>[] = [
    {
      key: 'name',
      label: 'Agent Name',
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'} size="sm">
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'memory_count',
      label: 'Memory Items',
      sortable: true,
    },
    {
      key: 'last_active',
      label: 'Last Active',
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'AI Agents' }]} />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Agents"
            value="156"
            icon={Bot}
            iconClass="text-neon-blue"
            bgClass="bg-neon-blue/10"
          />
          <StatsCard
            title="Active Agents"
            value="89"
            icon={Activity}
            iconClass="text-neon-green"
            bgClass="bg-neon-green/10"
          />
          <StatsCard
            title="Total Actions"
            value="12.5K"
            icon={Zap}
            iconClass="text-neon-purple"
            bgClass="bg-neon-purple/10"
          />
          <StatsCard
            title="Memory Items"
            value="45.2K"
            icon={Database}
            iconClass="text-neon-pink"
            bgClass="bg-neon-pink/10"
          />
        </div>

        {/* Agents Table */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-bold mb-6">AI Agents</h2>
          <DataTable data={agents} columns={columns} />
        </div>
      </div>
    </div>
  );
}
