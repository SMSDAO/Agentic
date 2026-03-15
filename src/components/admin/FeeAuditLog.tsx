'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ScrollText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface AuditLogEntry {
  id: string;
  feeType: string;
  oldValue: number | null;
  newValue: number;
  changedBy: string | null;
  changedAt: string;
}

const FEE_LABELS: Record<string, string> = {
  admin_dev_fee: 'Admin Dev Fee',
  mint_fee: 'Mint Fee',
  transfer_fee: 'Transfer Fee',
  airdrop_fee: 'Airdrop Fee',
  nft_mint_fee: 'NFT Mint Fee',
  nft_listing_fee: 'NFT Listing Fee',
  defi_swap_fee: 'DeFi Swap Fee',
};

interface FeeAuditLogProps {
  entries: AuditLogEntry[];
}

export function FeeAuditLog({ entries }: FeeAuditLogProps) {
  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-neon-yellow" />
          Fee Change History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No fee changes recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between p-3 rounded-lg bg-dark-elevated border border-white/5"
              >
                <div>
                  <p className="font-medium text-sm">
                    {FEE_LABELS[entry.feeType] ?? entry.feeType}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="text-neon-pink">
                      {entry.oldValue !== null ? `${entry.oldValue} SOL` : '—'}
                    </span>
                    <span className="mx-2 text-gray-600">→</span>
                    <span className="text-neon-green">{entry.newValue} SOL</span>
                  </p>
                  {entry.changedBy && (
                    <p className="text-xs text-gray-500 mt-0.5">by {entry.changedBy}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 shrink-0 ml-4">
                  {formatDistanceToNow(new Date(entry.changedAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
