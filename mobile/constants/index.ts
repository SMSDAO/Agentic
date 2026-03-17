/** Solana network used by the mobile app. */
export const SOLANA_NETWORK = 'mainnet-beta' as const;

/** Public RPC fallback (override with EXPO_PUBLIC_SOLANA_RPC_URL — this value is inlined into the client bundle, not a secret). */
export const SOLANA_RPC_URL =
  process.env.EXPO_PUBLIC_SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com';

/** Neo Glow colour palette (mirrors tailwind.config.ts neon colours). */
export const COLORS = {
  neonBlue: '#00d4ff',
  neonPurple: '#b026ff',
  neonPink: '#ff006e',
  neonGreen: '#00ff88',
  neonYellow: '#ffea00',
  bgDark: '#0a0a0f',
  bgSurface: '#141420',
  bgElevated: '#1c1c2e',
} as const;
