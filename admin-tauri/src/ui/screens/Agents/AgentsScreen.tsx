import React, { useEffect, useState } from 'react';
import { Plus, Play, Pause, Trash2 } from 'lucide-react';
import { listAgents, pauseAgent, resumeAgent, deleteAgent } from '../../../main/commands/agents';
import type { Agent } from '../../../main/supabase';

const AgentsScreen: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await listAgents();
      setAgents(data);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async (id: string) => {
    try {
      await pauseAgent(id);
      loadAgents();
    } catch (error) {
      console.error('Failed to pause agent:', error);
    }
  };

  const handleResume = async (id: string) => {
    try {
      await resumeAgent(id);
      loadAgents();
    } catch (error) {
      console.error('Failed to resume agent:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      await deleteAgent(id);
      loadAgents();
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Agents</h1>
          <p className="text-gray-400 mt-2">Manage and control your AI agents</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Agent
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Model</th>
              <th>Daily Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td className="font-medium text-white">{agent.name}</td>
                <td>
                  <span className="badge badge-info capitalize">{agent.type}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      agent.status === 'active'
                        ? 'badge-success'
                        : agent.status === 'paused'
                        ? 'badge-warning'
                        : 'badge-danger'
                    } capitalize`}
                  >
                    {agent.status}
                  </span>
                </td>
                <td className="text-gray-400">{agent.model}</td>
                <td className="text-gray-400">{agent.limits.daily_calls.toLocaleString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {agent.status === 'active' ? (
                      <button
                        onClick={() => handlePause(agent.id)}
                        className="p-2 hover:bg-gray-800 rounded"
                        title="Pause"
                      >
                        <Pause size={16} className="text-yellow-400" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResume(agent.id)}
                        className="p-2 hover:bg-gray-800 rounded"
                        title="Resume"
                      >
                        <Play size={16} className="text-green-400" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-2 hover:bg-gray-800 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {agents.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No agents found. Create your first agent to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsScreen;
