'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Map, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Check, X } from 'lucide-react';

export interface IntentRow {
  id?: string;
  intentKeywords: string[];
  route: string;
  featureName: string;
  description: string;
  isActive: boolean;
  priority: number;
}

interface IntentMappingTableProps {
  initialMappings: IntentRow[];
  onCreate: (row: Omit<IntentRow, 'id'>) => Promise<void>;
  onUpdate: (row: IntentRow) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EMPTY_ROW: Omit<IntentRow, 'id'> = {
  intentKeywords: [],
  route: '',
  featureName: '',
  description: '',
  isActive: true,
  priority: 0,
};

export function IntentMappingTable({
  initialMappings,
  onCreate,
  onUpdate,
  onDelete,
}: IntentMappingTableProps) {
  const [mappings, setMappings] = useState<IntentRow[]>(initialMappings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<IntentRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Omit<IntentRow, 'id'>>(EMPTY_ROW);
  const [busy, setBusy] = useState(false);

  function startEdit(row: IntentRow) {
    setEditingId(row.id ?? null);
    setEditDraft({ ...row });
    setAdding(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  async function saveEdit() {
    if (!editDraft) return;
    setBusy(true);
    try {
      await onUpdate(editDraft);
      setMappings((prev) =>
        prev.map((m) => (m.id === editDraft.id ? editDraft : m)),
      );
      cancelEdit();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this intent mapping?')) return;
    setBusy(true);
    try {
      await onDelete(id);
      setMappings((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleActive(row: IntentRow) {
    const updated = { ...row, isActive: !row.isActive };
    setBusy(true);
    try {
      await onUpdate(updated);
      setMappings((prev) => prev.map((m) => (m.id === row.id ? updated : m)));
    } finally {
      setBusy(false);
    }
  }

  async function handleCreate() {
    if (!newRow.route || !newRow.featureName || newRow.intentKeywords.length === 0) return;
    setBusy(true);
    try {
      await onCreate(newRow);
      setNewRow(EMPTY_ROW);
      setAdding(false);
      // Parent's loadData() will refresh the mappings list
    } finally {
      setBusy(false);
    }
  }

  function keywordsInput(value: string[], onChange: (v: string[]) => void) {
    return (
      <Input
        label="Keywords (comma-separated)"
        value={value.join(', ')}
        onChange={(e) =>
          onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
        }
      />
    );
  }

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Map className="w-5 h-5 text-neon-blue" />
            Intent Mappings
          </span>
          <Button size="sm" onClick={() => { setAdding(true); setEditingId(null); }}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add new row form */}
        {adding && (
          <div className="mb-4 p-4 rounded-xl bg-dark-elevated border border-neon-blue/30 space-y-3">
            <p className="text-sm font-semibold text-neon-blue">New Intent Mapping</p>
            {keywordsInput(newRow.intentKeywords, (v) =>
              setNewRow((r) => ({ ...r, intentKeywords: v })),
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Route"
                placeholder="/defi"
                value={newRow.route}
                onChange={(e) => setNewRow((r) => ({ ...r, route: e.target.value }))}
              />
              <Input
                label="Feature Name"
                value={newRow.featureName}
                onChange={(e) => setNewRow((r) => ({ ...r, featureName: e.target.value }))}
              />
            </div>
            <Input
              label="Description"
              value={newRow.description}
              onChange={(e) => setNewRow((r) => ({ ...r, description: e.target.value }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Priority"
                type="number"
                value={newRow.priority}
                onChange={(e) =>
                  setNewRow((r) => ({ ...r, priority: parseInt(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreate} disabled={busy}>
                <Check className="w-4 h-4 mr-1" />
                Create
              </Button>
            </div>
          </div>
        )}

        {/* Mappings table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-left">
                <th className="py-2 pr-4">Keywords</th>
                <th className="py-2 pr-4">Route</th>
                <th className="py-2 pr-4">Feature</th>
                <th className="py-2 pr-4 hidden md:table-cell">Description</th>
                <th className="py-2 pr-4">Priority</th>
                <th className="py-2 pr-4">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((row) =>
                editingId === row.id && editDraft ? (
                  <tr key={row.id} className="border-b border-white/5">
                    <td className="py-2 pr-2" colSpan={7}>
                      <div className="p-3 rounded-xl bg-dark-elevated border border-neon-purple/30 space-y-3">
                        {keywordsInput(editDraft.intentKeywords, (v) =>
                          setEditDraft((d) => d ? { ...d, intentKeywords: v } : d),
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="Route"
                            value={editDraft.route}
                            onChange={(e) =>
                              setEditDraft((d) => d ? { ...d, route: e.target.value } : d)
                            }
                          />
                          <Input
                            label="Feature Name"
                            value={editDraft.featureName}
                            onChange={(e) =>
                              setEditDraft((d) => d ? { ...d, featureName: e.target.value } : d)
                            }
                          />
                        </div>
                        <Input
                          label="Description"
                          value={editDraft.description}
                          onChange={(e) =>
                            setEditDraft((d) => d ? { ...d, description: e.target.value } : d)
                          }
                        />
                        <Input
                          label="Priority"
                          type="number"
                          value={editDraft.priority}
                          onChange={(e) =>
                            setEditDraft((d) =>
                              d ? { ...d, priority: parseInt(e.target.value) || 0 } : d,
                            )
                          }
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={cancelEdit}>
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={saveEdit} disabled={busy}>
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="py-3 pr-4 max-w-[180px]">
                      <div className="flex flex-wrap gap-1">
                        {row.intentKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded-full text-xs bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono text-neon-purple">{row.route}</td>
                    <td className="py-3 pr-4 font-medium">{row.featureName}</td>
                    <td className="py-3 pr-4 text-gray-400 hidden md:table-cell max-w-[220px] truncate">
                      {row.description}
                    </td>
                    <td className="py-3 pr-4 text-center">{row.priority}</td>
                    <td className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(row)}
                        disabled={busy}
                        title="Toggle active"
                      >
                        {row.isActive ? (
                          <ToggleRight className="w-5 h-5 text-neon-green" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="text-gray-400 hover:text-neon-blue"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {row.id && (
                          <button
                            type="button"
                            onClick={() => row.id && handleDelete(row.id)}
                            disabled={busy}
                            className="text-gray-400 hover:text-neon-pink"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          {mappings.length === 0 && (
            <p className="text-center text-gray-500 py-8">No intent mappings found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
