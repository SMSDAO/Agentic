'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MoreVertical, Ban, CheckCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  full_name?: string;
  wallet_address?: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchQuery,
        status: statusFilter,
        role: roleFilter,
      });
      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`User ${status} successfully`);
        fetchUsers();
        setShowModal(false);
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        toast.success('User role updated successfully');
        fetchUsers();
        setShowModal(false);
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          {row.full_name && <p className="text-sm text-gray-400">{row.full_name}</p>}
        </div>
      ),
    },
    {
      key: 'wallet_address',
      label: 'Wallet',
      render: (value) =>
        value ? (
          <code className="text-xs text-neon-blue">
            {value.slice(0, 8)}...{value.slice(-6)}
          </code>
        ) : (
          <span className="text-gray-500">—</span>
        ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => {
        const variants: Record<string, 'default' | 'info' | 'warning'> = {
          user: 'default',
          admin: 'info',
          super_admin: 'warning',
        };
        return (
          <Badge variant={variants[value] || 'default'} size="sm">
            {value.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const variants: Record<string, 'success' | 'warning' | 'error'> = {
          active: 'success',
          suspended: 'warning',
          banned: 'error',
        };
        return (
          <Badge variant={variants[value] || 'default'} size="sm">
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Joined',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM d, yyyy'),
    },
  ];

  return (
    <div>
      <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]} />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="neo-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              onSearch={setSearchQuery}
              placeholder="Search by email or name..."
            />
            <Select
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'banned', label: 'Banned' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Select
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'super_admin', label: 'Super Admin' },
              ]}
              value={roleFilter}
              onChange={setRoleFilter}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="neo-card p-6">
          <h2 className="text-2xl font-bold mb-6">Users</h2>
          <DataTable
            data={users}
            columns={columns}
            onRowClick={(user) => {
              setSelectedUser(user);
              setShowModal(true);
            }}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
            actions={(user) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUser(user);
                  setShowModal(true);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            )}
          />
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <p className="font-medium">{selectedUser.full_name || '—'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Role</label>
                <p className="font-medium capitalize">{selectedUser.role.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <p className="font-medium capitalize">{selectedUser.status}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-400">Wallet Address</label>
                <p className="font-mono text-sm">{selectedUser.wallet_address || '—'}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => handleUpdateRole(selectedUser.id, 'admin')}
                className="flex items-center gap-2"
                disabled={selectedUser.role === 'admin'}
              >
                <Shield className="w-4 h-4" />
                Make Admin
              </Button>
              <Button
                onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}
                className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30"
                disabled={selectedUser.status === 'suspended'}
              >
                <Ban className="w-4 h-4" />
                Suspend
              </Button>
              <Button
                onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30"
                disabled={selectedUser.status === 'active'}
              >
                <CheckCircle className="w-4 h-4" />
                Activate
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
