import { describe, it, expect } from 'vitest';
import { cn, formatNumber, shortenAddress, formatCurrency } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('formatNumber', () => {
  it('formats billions', () => {
    expect(formatNumber(1_000_000_000)).toBe('1.00B');
  });

  it('formats millions', () => {
    expect(formatNumber(2_500_000)).toBe('2.50M');
  });

  it('formats thousands', () => {
    expect(formatNumber(5_000)).toBe('5.00K');
  });

  it('formats numbers below 1000 as-is', () => {
    expect(formatNumber(42.5)).toBe('42.50');
  });

  it('respects custom decimal places', () => {
    expect(formatNumber(1_000_000, 0)).toBe('1M');
  });
});

describe('shortenAddress', () => {
  it('shortens a Solana address', () => {
    const address = '4Nd1mBQtrMJVYVfKf2PX98q7gNfZsqQMfYgLB6y3XQNL';
    expect(shortenAddress(address)).toBe('4Nd1...XQNL');
  });

  it('supports custom char count', () => {
    const address = '4Nd1mBQtrMJVYVfKf2PX98q7gNfZsqQMfYgLB6y3XQNL';
    expect(shortenAddress(address, 6)).toBe('4Nd1mB...y3XQNL');
  });
});

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats other currencies', () => {
    const result = formatCurrency(100, 'EUR');
    expect(result).toMatch(/100/);
  });
});
