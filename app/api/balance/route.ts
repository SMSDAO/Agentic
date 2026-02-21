import { NextRequest, NextResponse } from 'next/server';
import { createSolanaClient } from '@/lib/solana/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const solanaClient = createSolanaClient();
    const balance = await solanaClient.getBalance(address);

    return NextResponse.json({ 
      address,
      balance,
      unit: 'SOL'
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
