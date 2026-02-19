import React, { useEffect, useState } from 'react';
import { listAddons } from '../../../main/commands/addons';
import type { Addon } from '../../../main/supabase';

const AddonsScreen: React.FC = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddons();
  }, []);

  const loadAddons = async () => {
    try {
      const data = await listAddons();
      setAddons(data);
    } catch (error) {
      console.error('Failed to load addons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading add-ons...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Add-ons</h1>
        <p className="text-gray-400 mt-2">Manage platform add-ons and extensions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addons.map((addon) => (
          <div key={addon.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{addon.display_name}</h3>
                <p className="text-gray-400 mt-2">{addon.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="badge badge-info">{addon.version}</span>
                  <span className={`badge ${addon.installed ? 'badge-success' : 'badge-warning'}`}>
                    {addon.installed ? 'Installed' : 'Not Installed'}
                  </span>
                  <span className={`badge ${addon.enabled ? 'badge-success' : 'badge-danger'}`}>
                    {addon.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddonsScreen;
