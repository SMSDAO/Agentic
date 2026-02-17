-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    wallet_address TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    signature TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('transfer', 'swap', 'stake', 'mint', 'other')),
    amount DECIMAL NOT NULL,
    token_address TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create token_portfolios table
CREATE TABLE IF NOT EXISTS public.token_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token_address TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    balance DECIMAL NOT NULL DEFAULT 0,
    value_usd DECIMAL NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, token_address)
);

-- Create nft_collections table
CREATE TABLE IF NOT EXISTS public.nft_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    collection_address TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    total_supply INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nfts table
CREATE TABLE IF NOT EXISTS public.nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES public.nft_collections(id) ON DELETE CASCADE,
    mint_address TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    uri TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create defi_positions table
CREATE TABLE IF NOT EXISTS public.defi_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    protocol TEXT NOT NULL,
    position_type TEXT NOT NULL CHECK (position_type IN ('liquidity', 'stake', 'lend', 'borrow', 'farm')),
    token_address TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    value_usd DECIMAL NOT NULL DEFAULT 0,
    apy DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_configurations table
CREATE TABLE IF NOT EXISTS public.agent_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_memory table
CREATE TABLE IF NOT EXISTS public.agent_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.agent_configurations(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_signature ON public.transactions(signature);
CREATE INDEX IF NOT EXISTS idx_token_portfolios_user_id ON public.token_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_nfts_user_id ON public.nfts(user_id);
CREATE INDEX IF NOT EXISTS idx_nfts_collection_id ON public.nfts(collection_id);
CREATE INDEX IF NOT EXISTS idx_defi_positions_user_id ON public.defi_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent_id ON public.agent_memory(agent_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defi_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can read their own data
CREATE POLICY users_read_own ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY users_update_own ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can read their own transactions
CREATE POLICY transactions_read_own ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY transactions_insert_own ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own portfolios
CREATE POLICY portfolios_read_own ON public.token_portfolios
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own portfolios
CREATE POLICY portfolios_manage_own ON public.token_portfolios
    FOR ALL USING (auth.uid() = user_id);

-- Users can read their own NFTs
CREATE POLICY nfts_read_own ON public.nfts
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own NFTs
CREATE POLICY nfts_manage_own ON public.nfts
    FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own DeFi positions
CREATE POLICY defi_read_own ON public.defi_positions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY defi_manage_own ON public.defi_positions
    FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own agent configurations
CREATE POLICY agent_config_read_own ON public.agent_configurations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY agent_config_manage_own ON public.agent_configurations
    FOR ALL USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_token_portfolios_updated_at
    BEFORE UPDATE ON public.token_portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_defi_positions_updated_at
    BEFORE UPDATE ON public.defi_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agent_configurations_updated_at
    BEFORE UPDATE ON public.agent_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
