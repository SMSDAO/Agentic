import { describe, it, expect } from 'vitest';
import {
  buildSystemPrompt,
  optimizePrompt,
  truncateToTokenLimit,
} from '@/services/ai/prompt-optimization';

describe('buildSystemPrompt', () => {
  it('returns a default prompt with no context', () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain('Solana blockchain operations');
    expect(prompt).toContain('mainnet-beta');
  });

  it('includes wallet address in prompt', () => {
    const prompt = buildSystemPrompt({ walletAddress: 'ABC123' });
    expect(prompt).toContain('ABC123');
  });

  it('includes available tools in prompt', () => {
    const prompt = buildSystemPrompt({ availableTools: ['transfer', 'swap'] });
    expect(prompt).toContain('transfer');
    expect(prompt).toContain('swap');
  });

  it('uses provided network', () => {
    const prompt = buildSystemPrompt({ network: 'devnet' });
    expect(prompt).toContain('devnet');
  });

  it('excludes wallet info when not provided', () => {
    const prompt = buildSystemPrompt();
    expect(prompt).not.toContain('Connected wallet');
  });
});

describe('optimizePrompt', () => {
  it('trims whitespace', () => {
    expect(optimizePrompt('  hello  ')).toBe('hello');
  });

  it('appends network hint for prompts containing Solana addresses', () => {
    const result = optimizePrompt(
      'Check balance of 4Nd1mBQtrMJVYVfKf2PX98q7gNfZsqQMfYgLB6y3XQNL',
      { network: 'mainnet-beta' }
    );
    expect(result).toContain('mainnet-beta');
  });

  it('does not append network hint when no address present', () => {
    const result = optimizePrompt('What is the price of SOL?', { network: 'mainnet-beta' });
    expect(result).not.toContain('mainnet-beta');
  });
});

describe('truncateToTokenLimit', () => {
  it('returns the original string when within limit', () => {
    expect(truncateToTokenLimit('short prompt', 100)).toBe('short prompt');
  });

  it('truncates long prompts with ellipsis', () => {
    const longPrompt = 'a'.repeat(10000);
    const result = truncateToTokenLimit(longPrompt, 100);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBe(100 * 4);
  });

  it('uses default limit of 2048 tokens', () => {
    const longPrompt = 'a'.repeat(100000);
    const result = truncateToTokenLimit(longPrompt);
    expect(result.length).toBe(2048 * 4);
  });
});
