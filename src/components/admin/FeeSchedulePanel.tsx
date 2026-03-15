'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DollarSign, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export interface FeeRow {
  id?: string;
  feeType: string;
  amountSol: number;
  reserveAddress: string | null;
  autoForward: boolean;
  isActive: boolean;
}

interface FeeSchedulePanelProps {
  initialFees: FeeRow[];
  onSave: (fee: FeeRow) => Promise<void>;
}

const FEE_LABELS: Record<string, string> = {
  admin_dev_fee: 'Admin Dev Fee',
  mint_fee: 'Mint Fee',
  transfer_fee: 'Transfer Fee',
  airdrop_fee: 'Airdrop Fee (per recipient)',
  nft_mint_fee: 'NFT Mint Fee',
  nft_listing_fee: 'NFT Listing Fee',
  defi_swap_fee: 'DeFi Swap Fee / Commission',
};

export function FeeSchedulePanel({ initialFees, onSave }: FeeSchedulePanelProps) {
  const [fees, setFees] = useState<FeeRow[]>(initialFees);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleAmountChange(feeType: string, value: string) {
    setFees((prev) =>
      prev.map((f) => (f.feeType === feeType ? { ...f, amountSol: parseFloat(value) || 0 } : f)),
    );
    setErrors((prev) => ({ ...prev, [feeType]: '' }));
  }

  function handleReserveChange(feeType: string, value: string) {
    setFees((prev) =>
      prev.map((f) => (f.feeType === feeType ? { ...f, reserveAddress: value } : f)),
    );
  }

  function handleToggleAutoForward(feeType: string) {
    setFees((prev) =>
      prev.map((f) =>
        f.feeType === feeType ? { ...f, autoForward: !f.autoForward } : f,
      ),
    );
  }

  function handleToggleActive(feeType: string) {
    setFees((prev) =>
      prev.map((f) =>
        f.feeType === feeType ? { ...f, isActive: !f.isActive } : f,
      ),
    );
  }

  async function handleSave(fee: FeeRow) {
    const amount = fee.amountSol;
    if (isNaN(amount) || amount < 0) {
      setErrors((prev) => ({ ...prev, [fee.feeType]: 'Amount must be a non-negative number' }));
      return;
    }
    setSaving(fee.feeType);
    try {
      await onSave(fee);
      setSaved(fee.feeType);
      setTimeout(() => setSaved(null), 2000);
    } finally {
      setSaving(null);
    }
  }

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-neon-green" />
          Fee Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {fees.map((fee) => (
            <div
              key={fee.feeType}
              className="p-4 rounded-xl bg-dark-elevated border border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {FEE_LABELS[fee.feeType] ?? fee.feeType}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(fee.feeType)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                    title="Toggle active"
                  >
                    {fee.isActive ? (
                      <ToggleRight className="w-5 h-5 text-neon-green" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-500" />
                    )}
                    <span>{fee.isActive ? 'Active' : 'Inactive'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Amount (SOL)"
                  type="number"
                  step="0.0000001"
                  min="0"
                  value={fee.amountSol}
                  onChange={(e) => handleAmountChange(fee.feeType, e.target.value)}
                  error={errors[fee.feeType]}
                />
                <Input
                  label="Reserve Address"
                  type="text"
                  value={fee.reserveAddress ?? ''}
                  onChange={(e) => handleReserveChange(fee.feeType, e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleAutoForward(fee.feeType)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                  {fee.autoForward ? (
                    <ToggleRight className="w-4 h-4 text-neon-blue" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-gray-500" />
                  )}
                  Auto-forward: {fee.autoForward ? 'Enabled' : 'Disabled'}
                </button>

                <Button
                  size="sm"
                  onClick={() => handleSave(fee)}
                  disabled={saving === fee.feeType}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saving === fee.feeType
                    ? 'Saving…'
                    : saved === fee.feeType
                      ? 'Saved ✓'
                      : 'Save'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
