import React, { useEffect, useState } from 'react';
import { listUsers } from '../../../main/commands/users';
import type { User } from '../../../main/supabase';

const UsersScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-400 mt-2">Manage platform users</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Wallet</th>
              <th>Plan</th>
              <th>Credits</th>
              <th>Status</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-medium text-white">{user.email}</td>
                <td className="text-gray-400 font-mono text-sm">
                  {user.wallet_address ? user.wallet_address.substring(0, 8) + '...' : 'N/A'}
                </td>
                <td>
                  <span className="badge badge-info capitalize">{user.plan}</span>
                </td>
                <td className="text-gray-400">{Number(user.credits).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === 'active'
                        ? 'badge-success'
                        : user.status === 'suspended'
                        ? 'badge-warning'
                        : 'badge-danger'
                    } capitalize`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info capitalize">{user.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-400">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UsersScreen;
