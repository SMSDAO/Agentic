/**
 * LangChain service — Solana-aware AI agent built on LangChain + OpenAI.
 *
 * Server-only: reads OPENAI_API_KEY from process.env and imports Node-only
 * LangChain/OpenAI SDKs. Do not import from client components.
 */

import 'server-only';
import { ChatOpenAI } from '@langchain/openai';
import { Tool } from '@langchain/core/tools';
import { createSolanaClient } from '@/lib/solana/client';

// ---------------------------------------------------------------------------
// Custom Solana tools
// ---------------------------------------------------------------------------

class GetBalanceTool extends Tool {
  name = 'get_balance';
  description =
    'Get the SOL balance of a Solana wallet address. Input should be a valid Solana address.';

  async _call(address: string): Promise<string> {
    try {
      const client = createSolanaClient();
      const balance = await client.getBalance(address);
      return `Balance: ${balance} SOL`;
    } catch (error) {
      return `Error getting balance: ${error}`;
    }
  }
}

class GetTokenBalanceTool extends Tool {
  name = 'get_token_balance';
  description =
    'Get token balance for a specific token. Input should be in format: tokenAddress,ownerAddress';

  async _call(input: string): Promise<string> {
    const commaIndex = input.indexOf(',');
    if (commaIndex === -1) {
      return 'Error: input must be in format tokenAddress,ownerAddress';
    }
    const tokenAddress = input.slice(0, commaIndex).trim();
    const ownerAddress = input.slice(commaIndex + 1).trim();
    if (!tokenAddress || !ownerAddress) {
      return 'Error: both tokenAddress and ownerAddress are required';
    }
    try {
      const client = createSolanaClient();
      const balance = await client.getTokenBalance(tokenAddress, ownerAddress);
      return `Token Balance: ${balance}`;
    } catch (error) {
      return `Error getting token balance: ${error}`;
    }
  }
}

// ---------------------------------------------------------------------------
// SolanaAgent
// ---------------------------------------------------------------------------

export class SolanaAgent {
  private model: ChatOpenAI;

  constructor(apiKey?: string) {
    const key = apiKey ?? process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key is required');
    }

    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0,
      openAIApiKey: key,
    });
  }

  async execute(prompt: string): Promise<string> {
    const response = await this.model.invoke(prompt);
    return response.content as string;
  }

  /** Returns the available Solana tools for use with a LangChain agent executor. */
  getTools(): Tool[] {
    return [new GetBalanceTool(), new GetTokenBalanceTool()];
  }
}

export function createLangChainService(apiKey?: string): SolanaAgent {
  return new SolanaAgent(apiKey);
}

/** @deprecated Use createLangChainService */
export function createSolanaAgent(apiKey?: string): SolanaAgent {
  return new SolanaAgent(apiKey);
}
