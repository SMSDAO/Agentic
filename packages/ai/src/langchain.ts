import { ChatOpenAI } from '@langchain/openai';
import { Tool } from '@langchain/core/tools';
import { createSolanaClient } from '@agentic/web3';

// Custom Solana Tools for LangChain
class GetBalanceTool extends Tool {
  name = 'get_balance';
  description = 'Get the SOL balance of a Solana wallet address. Input should be a valid Solana address.';

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
  description = 'Get token balance for a specific token. Input should be in format: tokenAddress,ownerAddress';

  async _call(input: string): Promise<string> {
    try {
      const [tokenAddress, ownerAddress] = input.split(',');
      const client = createSolanaClient();
      const balance = await client.getTokenBalance(tokenAddress.trim(), ownerAddress.trim());
      return `Token Balance: ${balance}`;
    } catch (error) {
      return `Error getting token balance: ${error}`;
    }
  }
}

export class SolanaAgent {
  private model: ChatOpenAI;
  private tools: Tool[];

  constructor(apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key is required');
    }

    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0,
      openAIApiKey: key,
    });

    this.tools = [
      new GetBalanceTool(),
      new GetTokenBalanceTool(),
    ];
  }

  async execute(prompt: string): Promise<string> {
    // Simple implementation - in production, use proper agent framework
    // For now, just use the LLM directly
    const response = await this.model.invoke(prompt);
    return response.content as string;
  }

  getTools(): Tool[] {
    return this.tools;
  }
}

// Export a factory function instead of a singleton
export function createSolanaAgent(apiKey?: string) {
  return new SolanaAgent(apiKey);
}
