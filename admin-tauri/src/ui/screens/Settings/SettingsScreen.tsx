import React, { useEffect, useState } from 'react';
import { getPlatformSettings } from '../../../main/commands/config';
import type { PlatformSetting } from '../../../main/supabase';

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getPlatformSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-gray-400 mt-2">Configure global platform settings</p>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Setting</th>
              <th>Value</th>
              <th>Type</th>
              <th>Visibility</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id}>
                <td className="font-medium text-white">{setting.setting_key}</td>
                <td className="text-gray-400">
                  {typeof setting.setting_value === 'object'
                    ? JSON.stringify(setting.setting_value)
                    : String(setting.setting_value)}
                </td>
                <td className="text-gray-400 capitalize">{setting.setting_type}</td>
                <td>
                  <span className={`badge ${setting.is_public ? 'badge-info' : 'badge-warning'}`}>
                    {setting.is_public ? 'Public' : 'Private'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {settings.length === 0 && (
          <div className="text-center py-12 text-gray-400">No settings found.</div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;
