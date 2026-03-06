import { NextRequest, NextResponse } from 'next/server';
import { createCoinGeckoClient } from '@/lib/market/coingecko';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'trending';

    let data: unknown;
    const client = createCoinGeckoClient();

    switch (endpoint) {
      case 'trending':
        data = await client.getTrendingTokens();
        break;
      case 'gainers':
        data = await client.getTopGainers(10);
        break;
      case 'price':
        const tokenId = searchParams.get('tokenId');
        if (!tokenId) {
          return NextResponse.json(
            { error: 'tokenId parameter is required for price endpoint' },
            { status: 400 }
          );
        }
        data = await client.getPrice(tokenId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid endpoint' },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
