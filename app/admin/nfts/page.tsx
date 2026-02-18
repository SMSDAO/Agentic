'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Image as ImageIcon, Users, Package, TrendingUp } from 'lucide-react';

interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  collection_address: string;
  total_supply: number;
  floor_price: number;
  total_volume: number;
}

export default function AdminNFTsPage() {
  const collections: NFTCollection[] = [
    {
      id: '1',
      name: 'Cyber Punks',
      symbol: 'CPUNK',
      collection_address: 'CyBerPuNk123...',
      total_supply: 10000,
      floor_price: 5.2,
      total_volume: 15000,
    },
  ];

  const columns: Column<NFTCollection>[] = [
    {
      key: 'name',
      label: 'Collection',
      sortable: true,
    },
    {
      key: 'symbol',
      label: 'Symbol',
      render: (value) => (
        <Badge variant="info" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'total_supply',
      label: 'Supply',
      sortable: true,
    },
    {
      key: 'floor_price',
      label: 'Floor Price',
      sortable: true,
      render: (value) => `◎${value}`,
    },
    {
      key: 'total_volume',
      label: 'Volume',
      sortable: true,
      render: (value) => `◎${value.toLocaleString()}`,
    },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'NFTs' }]} />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Collections"
            value="245"
            icon={Package}
            iconClass="text-neon-blue"
            bgClass="bg-neon-blue/10"
          />
          <StatsCard
            title="Total NFTs"
            value="125K"
            icon={ImageIcon}
            iconClass="text-neon-purple"
            bgClass="bg-neon-purple/10"
          />
          <StatsCard
            title="Total Holders"
            value="12.5K"
            icon={Users}
            iconClass="text-neon-green"
            bgClass="bg-neon-green/10"
          />
          <StatsCard
            title="Total Volume"
            value="◎456K"
            icon={TrendingUp}
            iconClass="text-neon-pink"
            bgClass="bg-neon-pink/10"
          />
        </div>

        {/* Collections Table */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-bold mb-6">NFT Collections</h2>
          <DataTable data={collections} columns={columns} />
        </div>
      </div>
    </div>
  );
}
