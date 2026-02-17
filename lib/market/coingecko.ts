import axios from 'axios';

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export class CoinGeckoClient {
  private apiKey: string;
  private baseUrl = 'https://pro-api.coingecko.com/api/v3';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COINGECKO_API_KEY || '';
  }

  private getHeaders() {
    return this.apiKey ? { 'x-cg-pro-api-key': this.apiKey } : {};
  }

  async getPrice(tokenId: string, vsCurrency: string = 'usd') {
    const response = await axios.get(`${this.baseUrl}/simple/price`, {
      headers: this.getHeaders(),
      params: {
        ids: tokenId,
        vs_currencies: vsCurrency,
        include_24hr_change: true,
      },
    });

    return response.data[tokenId];
  }

  async getTrendingTokens() {
    const response = await axios.get(`${this.baseUrl}/search/trending`, {
      headers: this.getHeaders(),
    });

    return response.data.coins;
  }

  async getTopGainers(limit: number = 10) {
    const response = await axios.get(`${this.baseUrl}/coins/markets`, {
      headers: this.getHeaders(),
      params: {
        vs_currency: 'usd',
        order: 'price_change_percentage_24h_desc',
        per_page: limit,
        page: 1,
      },
    });

    return response.data;
  }

  async getTokenInfo(tokenId: string) {
    const response = await axios.get(`${this.baseUrl}/coins/${tokenId}`, {
      headers: this.getHeaders(),
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
      },
    });

    return response.data;
  }
}

// Export factory function instead of singleton
export function createCoinGeckoClient(apiKey?: string) {
  return new CoinGeckoClient(apiKey);
}
