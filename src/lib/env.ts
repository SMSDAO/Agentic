import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SOLANA_NETWORK: z.enum(['mainnet-beta', 'devnet', 'testnet']),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url(),
  SOLANA_PRIVATE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
  NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;