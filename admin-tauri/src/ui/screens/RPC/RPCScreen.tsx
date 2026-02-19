import React, { useEffect, useState } from 'react';
import { listRPCEndpoints } from '../../../main/commands/rpc';
import type { RPCEndpoint } from '../../../main/supabase';

const RPCScreen: React.FC = () => {
  const [endpoints, setEndpoints] = useState<RPCEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    try {
      const data = await listRPCEndpoints();
      setEndpoints(data);
    } catch (error) {
      console.error('Failed to load RPC endpoints:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading RPC endpoints...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">RPC Endpoints</h1>
        <p className="text-gray-400 mt-2">Manage blockchain RPC endpoints</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Network</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Health</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <tr key={endpoint.id}>
                <td className="font-medium text-white">{endpoint.name}</td>
                <td className="text-gray-400">{endpoint.network}</td>
                <td className="text-gray-400 uppercase">{endpoint.endpoint_type}</td>
                <td className="text-gray-400">{endpoint.priority}</td>
                <td>
                  <span
                    className={`badge ${
                      endpoint.health_status === 'healthy'
                        ? 'badge-success'
                        : endpoint.health_status === 'unhealthy'
                        ? 'badge-danger'
                        : 'badge-warning'
                    } capitalize`}
                  >
                    {endpoint.health_status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${endpoint.enabled ? 'badge-success' : 'badge-danger'}`}>
                    {endpoint.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RPCScreen;
