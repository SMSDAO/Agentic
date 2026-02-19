import React, { useEffect, useState } from 'react';
import { listOracles } from '../../../main/commands/oracles';
import type { PriceOracle } from '../../../main/supabase';

const OraclesScreen: React.FC = () => {
  const [oracles, setOracles] = useState<PriceOracle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOracles();
  }, []);

  const loadOracles = async () => {
    try {
      const data = await listOracles();
      setOracles(data);
    } catch (error) {
      console.error('Failed to load oracles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading price oracles...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Price Oracles</h1>
        <p className="text-gray-400 mt-2">Manage price feed providers</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {oracles.map((oracle) => (
              <tr key={oracle.id}>
                <td className="font-medium text-white capitalize">{oracle.name}</td>
                <td className="text-gray-400 uppercase">{oracle.oracle_type}</td>
                <td className="text-gray-400">{oracle.priority}</td>
                <td>
                  <span className={`badge ${oracle.enabled ? 'badge-success' : 'badge-danger'}`}>
                    {oracle.enabled ? 'Enabled' : 'Disabled'}
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

export default OraclesScreen;
