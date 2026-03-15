'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FeeSchedulePanel, FeeRow } from '@/components/admin/FeeSchedulePanel';
import { IntentMappingTable, IntentRow } from '@/components/admin/IntentMappingTable';
import { FeeAuditLog, AuditLogEntry } from '@/components/admin/FeeAuditLog';

export default function AdminPage() {
  const [fees, setFees] = useState<FeeRow[]>([]);
  const [intents, setIntents] = useState<IntentRow[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [feesRes, intentsRes] = await Promise.all([
        fetch('/api/admin/fees'),
        fetch('/api/admin/intents'),
      ]);

      if (!feesRes.ok || !intentsRes.ok) {
        throw new Error('Failed to load admin data');
      }

      const feesData = await feesRes.json();
      const intentsData = await intentsRes.json();

      setFees(
        (feesData.fees ?? []).map((f: Record<string, unknown>) => ({
          id: f.id,
          feeType: f.fee_type,
          amountSol: Number(f.amount_sol),
          reserveAddress: f.reserve_address as string | null,
          autoForward: f.auto_forward as boolean,
          isActive: f.is_active as boolean,
        })),
      );

      setIntents(
        (intentsData.intents ?? []).map((m: Record<string, unknown>) => ({
          id: m.id,
          intentKeywords: m.intent_keywords as string[],
          route: m.route as string,
          featureName: m.feature_name as string,
          description: (m.description as string) ?? '',
          isActive: m.is_active as boolean,
          priority: Number(m.priority),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  async function loadAuditLog() {
    try {
      const res = await fetch('/api/admin/fees/audit');
      if (res.ok) {
        const data = await res.json();
        setAuditLog(
          (data.entries ?? []).map((e: Record<string, unknown>) => ({
            id: e.id,
            feeType: e.fee_type,
            oldValue: e.old_value !== null ? Number(e.old_value) : null,
            newValue: Number(e.new_value),
            changedBy: e.changed_by as string | null,
            changedAt: e.changed_at as string,
          })),
        );
      }
    } catch {
      // Audit log is optional — silently skip on error
    }
  }

  useEffect(() => {
    loadData().catch(() => {
      setError('Failed to load admin data');
    });
    loadAuditLog();
  }, [loadData]);

  async function handleSaveFee(fee: FeeRow) {
    const res = await fetch('/api/admin/fees', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feeType: fee.feeType,
        amountSol: fee.amountSol,
        reserveAddress: fee.reserveAddress,
        autoForward: fee.autoForward,
        isActive: fee.isActive,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? 'Failed to save fee');
    }
    // Refresh audit log after save
    await loadAuditLog();
  }

  async function handleCreateIntent(row: Omit<IntentRow, 'id'>) {
    const res = await fetch('/api/admin/intents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intentKeywords: row.intentKeywords,
        route: row.route,
        featureName: row.featureName,
        description: row.description,
        isActive: row.isActive,
        priority: row.priority,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? 'Failed to create intent');
    }
    await loadData();
  }

  async function handleUpdateIntent(row: IntentRow) {
    const res = await fetch('/api/admin/intents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: row.id,
        intentKeywords: row.intentKeywords,
        route: row.route,
        featureName: row.featureName,
        description: row.description,
        isActive: row.isActive,
        priority: row.priority,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? 'Failed to update intent');
    }
  }

  async function handleDeleteIntent(id: string) {
    const res = await fetch(`/api/admin/intents?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? 'Failed to delete intent');
    }
  }

  return (
    <AdminLayout>
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 rounded-full border-2 border-neon-blue border-t-transparent animate-spin" />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          <FeeSchedulePanel initialFees={fees} onSave={handleSaveFee} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IntentMappingTable
                initialMappings={intents}
                onCreate={handleCreateIntent}
                onUpdate={handleUpdateIntent}
                onDelete={handleDeleteIntent}
              />
            </div>
            <div>
              <FeeAuditLog entries={auditLog} />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
