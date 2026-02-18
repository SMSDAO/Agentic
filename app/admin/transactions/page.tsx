'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  user_id: string;
  signature: string;
  type: 'transfer' | 'swap' | 'stake' | 'mint' | 'other';
  amount: number;
  token_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchQuery, typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchQuery,
        type: typeFilter,
        status: statusFilter,
      });
      const response = await fetch(`/api/admin/transactions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    // Export logic would go here
    toast.success('Exporting transactions...');
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'signature',
      label: 'Signature',
      render: (value) => (
        <code className="text-xs text-neon-blue">
          {value.slice(0, 16)}...
        </code>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
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
      render: (value) => value.toFixed(4),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const variants: Record<string, 'warning' | 'success' | 'error'> = {
          pending: 'warning',
          confirmed: 'success',
          failed: 'error',
        };
        return (
          <Badge variant={variants[value]} size="sm">
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM d, yyyy HH:mm'),
    },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Transactions' }]} />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="neo-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchInput
              onSearch={setSearchQuery}
              placeholder="Search by signature..."
            />
            <Select
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'transfer', label: 'Transfer' },
                { value: 'swap', label: 'Swap' },
                { value: 'stake', label: 'Stake' },
                { value: 'mint', label: 'Mint' },
                { value: 'other', label: 'Other' },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
            />
            <Select
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'failed', label: 'Failed' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Button
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-bold mb-6">Transactions</h2>
          <DataTable
            data={transactions}
            columns={columns}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </div>
    </div>
  );
}
