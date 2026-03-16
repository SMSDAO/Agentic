-- Admin Fee Config table
CREATE TABLE IF NOT EXISTS public.admin_fee_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_type TEXT NOT NULL UNIQUE,
  amount_sol NUMERIC NOT NULL,
  reserve_address TEXT,
  auto_forward BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Intent Mappings table
CREATE TABLE IF NOT EXISTS public.admin_intent_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_keywords TEXT[] NOT NULL,
  route TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Fee Audit Log table
CREATE TABLE IF NOT EXISTS public.admin_fee_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_type TEXT NOT NULL,
  old_value NUMERIC,
  new_value NUMERIC,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_fee_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_intent_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_fee_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies: only users with admin or super_admin role in public.users
-- Aligns with the pattern used in 002_admin_tauri_schema.sql.

CREATE POLICY "admin_fee_config_select" ON public.admin_fee_config
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_fee_config_insert" ON public.admin_fee_config
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_fee_config_update" ON public.admin_fee_config
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_intent_mappings_select" ON public.admin_intent_mappings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_intent_mappings_insert" ON public.admin_intent_mappings
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_intent_mappings_update" ON public.admin_intent_mappings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_intent_mappings_delete" ON public.admin_intent_mappings
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_fee_audit_log_select" ON public.admin_fee_audit_log
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "admin_fee_audit_log_insert" ON public.admin_fee_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'super_admin')
    )
  );

-- Seed default fee config
INSERT INTO public.admin_fee_config (fee_type, amount_sol, reserve_address, auto_forward)
VALUES
  ('admin_dev_fee',    0.0000022, 'monads.skr', true),
  ('mint_fee',         0.000022,  'monads.skr', true),
  ('transfer_fee',     0.000005,  'monads.skr', true),
  ('airdrop_fee',      0.000001,  'monads.skr', true),
  ('nft_mint_fee',     0.000022,  'monads.skr', true),
  ('nft_listing_fee',  0.000011,  'monads.skr', true),
  ('defi_swap_fee',    0.000010,  'monads.skr', true)
ON CONFLICT (fee_type) DO NOTHING;

-- Seed default intent mappings
INSERT INTO public.admin_intent_mappings (intent_keywords, route, feature_name, description, priority)
VALUES
  (ARRAY['launch a token', 'create token', 'deploy token'],           '/tokens',    'Deploy SPL Token',    'Deploy a new SPL token on Solana',                    100),
  (ARRAY['send tokens', 'transfer'],                                   '/tokens',    'Transfer Tokens',     'Send SPL tokens to another wallet',                   90),
  (ARRAY['airdrop', 'mass send', 'zk airdrop'],                       '/tokens',    'ZK Airdrop',          'Compressed airdrop via Light Protocol',               85),
  (ARRAY['swap', 'exchange', 'trade'],                                 '/defi',      'Jupiter Swap',        'Token swap via Jupiter aggregator',                   80),
  (ARRAY['mint nft', 'create nft'],                                    '/nfts',      'Mint NFT',            'Mint a new NFT via Metaplex',                         75),
  (ARRAY['create collection', 'nft collection'],                       '/nfts',      'Create Collection',   'Create Metaplex NFT collection',                      70),
  (ARRAY['list nft', 'sell nft'],                                      '/nfts',      '3.Land Listing',      'List NFT on 3.Land marketplace',                      65),
  (ARRAY['check balance', 'my portfolio', 'holdings'],                 '/dashboard', 'Portfolio Overview',  'View wallet balances and holdings',                   60),
  (ARRAY['market', 'trending', 'prices'],                              '/market',    'Market Data',         'View trending tokens and market data',                55),
  (ARRAY['stake', 'staking'],                                          '/defi',      'Staking',             'Stake tokens via supported protocols',                50),
  (ARRAY['provide liquidity', 'LP', 'pool'],                           '/defi',      'Liquidity Pool',      'Add liquidity to DEX pools',                          45),
  (ARRAY['bridge', 'cross-chain'],                                     '/defi',      'deBridge DLN',        'Cross-chain bridge via deBridge',                     40),
  (ARRAY['signals', 'alerts', 'notifications'],                        '/signals',   'Trading Signals',     'View and manage trading signals',                     35),
  (ARRAY['timeline', 'activity', 'history'],                           '/timeline',  'Activity Timeline',   'View transaction and activity history',               30),
  (ARRAY['ask ai', 'chat', 'help'],                                    '/ai-agent',  'AI Agent Chat',       'Interactive AI assistant',                            25),
  (ARRAY['farm', 'yield', 'farming'],                                  '/defi',      'Yield Farming',       'Yield farming via Raydium/Orca/Meteora',              20),
  (ARRAY['leverage', 'perps', 'perpetuals'],                           '/defi',      'Drift Perpetuals',    'Leveraged trading via Drift Protocol',                15),
  (ARRAY['lend', 'borrow', 'lending'],                                 '/defi',      'Kamino Lending',      'Lending/borrowing via Kamino',                        10),
  (ARRAY['bundle', 'jito', 'mev'],                                     '/defi',      'Jito Bundles',        'MEV-protected transaction bundles',                   5),
  (ARRAY['oracle', 'price feed'],                                      '/market',    'Pyth Oracle',         'Real-time price feeds via Pyth',                      1)
ON CONFLICT DO NOTHING;
