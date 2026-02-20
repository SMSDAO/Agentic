import React, { useEffect, useState } from 'react';
import { listSDKConfigs } from '../../../main/commands/sdk';

const SDKScreen: React.FC = () => {
  const [sdks, setSdks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSDKs();
  }, []);

  const loadSDKs = async () => {
    try {
      const data = await listSDKConfigs();
      setSdks(data);
    } catch (error) {
      console.error('Failed to load SDK configs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading SDK configurations...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">SDK & API</h1>
        <p className="text-gray-400 mt-2">Manage SDK configurations and API keys</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>SDK Type</th>
              <th>Version</th>
              <th>Endpoint</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sdks.map((sdk) => (
              <tr key={sdk.id}>
                <td className="font-medium text-white capitalize">{sdk.sdk_type}</td>
                <td className="text-gray-400">{sdk.version}</td>
                <td className="text-gray-400 text-sm">{sdk.endpoint}</td>
                <td>
                  <span className={`badge ${sdk.enabled ? 'badge-success' : 'badge-danger'}`}>
                    {sdk.enabled ? 'Enabled' : 'Disabled'}
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

export default SDKScreen;
