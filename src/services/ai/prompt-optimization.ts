/**
 * Prompt engineering utilities for Solana + AI agent interactions.
 */

export interface PromptContext {
  network?: string;
  walletAddress?: string;
  availableTools?: string[];
}

/**
 * Builds the system prompt for the Solana AI agent.
 */
export function buildSystemPrompt(context: PromptContext = {}): string {
  const { network = 'mainnet-beta', walletAddress, availableTools = [] } = context;

  const toolList =
    availableTools.length > 0
      ? `\nAvailable tools: ${availableTools.join(', ')}`
      : '';

  const walletInfo = walletAddress
    ? `\nConnected wallet: ${walletAddress}`
    : '';

  return [
    'You are an AI agent specializing in Solana blockchain operations.',
    `Network: ${network}${walletInfo}${toolList}`,
    'Provide accurate, concise responses about blockchain transactions,',
    'token balances, NFT operations, and DeFi protocols.',
    'Always confirm transaction details before execution.',
    'Never reveal or request private keys.',
  ].join(' ');
}

/**
 * Optimizes a raw user prompt for better LLM results in a Web3 context.
 */
export function optimizePrompt(rawPrompt: string, context: PromptContext = {}): string {
  const trimmed = rawPrompt.trim();

  // Add network context if a Solana address is detected
  const solanaAddressPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
  const hasAddress = solanaAddressPattern.test(trimmed);

  const networkHint =
    hasAddress && context.network ? ` (network: ${context.network})` : '';

  return `${trimmed}${networkHint}`;
}

/**
 * Truncates a prompt to stay within token limits.
 * Rough estimate: 1 token ≈ 4 characters for English text.
 */
export function truncateToTokenLimit(
  prompt: string,
  maxTokens: number = 2048
): string {
  const charLimit = maxTokens * 4;
  if (prompt.length <= charLimit) return prompt;
  return prompt.slice(0, charLimit - 3) + '...';
}
