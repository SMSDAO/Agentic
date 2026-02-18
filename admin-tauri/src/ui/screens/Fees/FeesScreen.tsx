import React, { useEffect, useState } from 'react';
import { listFees } from '../../../main/commands/fees';
import type { Fee } from '../../../main/supabase';

const FeesScreen: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const data = await listFees();
      setFees(data);
    } catch (error) {
      console.error('Failed to load fees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading fees...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Fees</h1>
        <p className="text-gray-400 mt-2">Configure platform fees</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Percentage</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id}>
                <td className="font-medium text-white capitalize">{fee.fee_type}</td>
                <td className="text-gray-400">${fee.amount.toFixed(4)}</td>
                <td className="text-gray-400">{fee.percentage ? `${fee.percentage}%` : 'N/A'}</td>
                <td className="text-gray-400">{fee.description}</td>
                <td>
                  <span className={`badge ${fee.active ? 'badge-success' : 'badge-danger'}`}>
                    {fee.active ? 'Active' : 'Inactive'}
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

export default FeesScreen;
