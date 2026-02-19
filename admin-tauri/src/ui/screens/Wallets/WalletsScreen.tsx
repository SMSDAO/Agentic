import React, { useEffect, useState } from 'react';
import { listWalletConnectors } from '../../../main/commands/wallets';
import type { WalletConnector } from '../../../main/supabase';

const WalletsScreen: React.FC = () => {
  const [connectors, setConnectors] = useState<WalletConnector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      const data = await listWalletConnectors();
      setConnectors(data);
    } catch (error) {
      console.error('Failed to load connectors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading wallet connectors...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Wallet Connectors</h1>
        <p className="text-gray-400 mt-2">Manage supported wallet connectors</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>RPC Endpoint</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((connector) => (
              <tr key={connector.id}>
                <td className="font-medium text-white">{connector.display_name}</td>
                <td className="text-gray-400 capitalize">{connector.connector_type}</td>
                <td className="text-gray-400 text-sm font-mono">
                  {connector.config.rpc_endpoint 
                    ? (connector.config.rpc_endpoint.length > 40 
                      ? `${connector.config.rpc_endpoint.substring(0, 40)}...` 
                      : connector.config.rpc_endpoint)
                    : 'N/A'}
                </td>
                <td>
                  <span className={`badge ${connector.enabled ? 'badge-success' : 'badge-danger'}`}>
                    {connector.enabled ? 'Enabled' : 'Disabled'}
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

export default WalletsScreen;
