import axios from 'axios';

export interface JupiterQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: Record<string, unknown>[];
}

export class JupiterClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_JUPITER_API_URL || 'https://quote-api.jup.ag/v6';
  }

  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ): Promise<JupiterQuote> {
    const response = await axios.get(`${this.baseUrl}/quote`, {
      params: {
        inputMint,
        outputMint,
        amount,
        slippageBps,
      },
    });

    return response.data;
  }

  async getSwapTransaction(quoteResponse: JupiterQuote, userPublicKey: string) {
    const response = await axios.post(`${this.baseUrl}/swap`, {
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol: true,
    });

    return response.data.swapTransaction;
  }

  async getTokenList() {
    const response = await axios.get(`${this.baseUrl}/tokens`);
    return response.data;
  }
}

export const jupiterClient = new JupiterClient();
