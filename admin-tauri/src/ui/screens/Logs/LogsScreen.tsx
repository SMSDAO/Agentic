import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../../../main/commands/logs';
import type { AuditLog } from '../../../main/supabase';
import { format } from 'date-fns';

const LogsScreen: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await getAuditLogs({ limit: 100 });
      setLogs(data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading audit logs...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
        <p className="text-gray-400 mt-2">View platform activity and audit trail</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="text-gray-400 text-sm">
                  {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                </td>
                <td className="font-medium text-white">{log.action}</td>
                <td className="text-gray-400">{log.resource_type}</td>
                <td>
                  <span
                    className={`badge ${
                      log.status === 'success'
                        ? 'badge-success'
                        : log.status === 'failure'
                        ? 'badge-danger'
                        : 'badge-warning'
                    } capitalize`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-400">No audit logs found.</div>
        )}
      </div>
    </div>
  );
};

export default LogsScreen;
