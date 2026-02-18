-- Admin Tauri Schema Migration
-- This migration adds all tables needed for the Tauri Admin Panel

-- ============================================================================
-- 1. AGENTS TABLES
-- ============================================================================

-- Main agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('builder', 'worker', 'crawler', 'generator', 'sync')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
    description TEXT,
    avatar_url TEXT,
    
    -- AI Configuration
    model TEXT NOT NULL DEFAULT 'gpt-4',
    temperature DECIMAL NOT NULL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
    max_tokens INTEGER NOT NULL DEFAULT 2000,
    memory TEXT NOT NULL DEFAULT 'short' CHECK (memory IN ('short', 'long', 'vector')),
    
    -- Advanced Configuration
    config JSONB NOT NULL DEFAULT '{
        "retries": 3,
        "timeout_ms": 30000,
        "concurrency": 1,
        "memory_limit": 1024
    }'::jsonb,
    
    -- Rate Limits
    limits JSONB NOT NULL DEFAULT '{
        "daily_calls": 1000,
        "monthly_calls": 30000,
        "per_user_limit": 100
    }'::jsonb,
    
    -- Billing Configuration
    billing JSONB NOT NULL DEFAULT '{
        "cost_per_call": 0.01,
        "cost_per_token": 0.00001
    }'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent tools junction table
CREATE TABLE IF NOT EXISTS public.agent_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL,
    tool_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, tool_name)
);

-- Agent skills junction table
CREATE TABLE IF NOT EXISTS public.agent_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, skill_name)
);

-- Agent pipelines table
CREATE TABLE IF NOT EXISTS public.agent_pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    step_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, step_order)
);

-- Agent schedules table
CREATE TABLE IF NOT EXISTS public.agent_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    cron TEXT,
    timezone TEXT DEFAULT 'UTC',
    enabled BOOLEAN DEFAULT true,
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. USERS TABLE ENHANCEMENTS
-- ============================================================================

-- Add new columns to existing users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise'));
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS credits DECIMAL NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS rate_limits JSONB DEFAULT '{
    "requests_per_minute": 10,
    "requests_per_hour": 100,
    "requests_per_day": 1000
}'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned'));
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));

-- ============================================================================
-- 3. BILLING TABLES
-- ============================================================================

-- Billing plans table
CREATE TABLE IF NOT EXISTS public.billing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL NOT NULL DEFAULT 0,
    price_yearly DECIMAL NOT NULL DEFAULT 0,
    credits_included DECIMAL NOT NULL DEFAULT 0,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    limits JSONB NOT NULL DEFAULT '{}'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing invoices table
CREATE TABLE IF NOT EXISTS public.billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    amount DECIMAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('stripe', 'crypto', 'credits')),
    stripe_invoice_id TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing payments table
CREATE TABLE IF NOT EXISTS public.billing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.billing_invoices(id) ON DELETE SET NULL,
    amount DECIMAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'crypto_sol', 'crypto_usdc')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Payment provider details
    stripe_payment_intent_id TEXT,
    crypto_transaction_signature TEXT,
    crypto_wallet_address TEXT,
    
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 4. FEES TABLES
-- ============================================================================

-- Global fees table
CREATE TABLE IF NOT EXISTS public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_type TEXT NOT NULL UNIQUE CHECK (fee_type IN ('base', 'network', 'agent', 'priority')),
    amount DECIMAL NOT NULL DEFAULT 0,
    percentage DECIMAL CHECK (percentage >= 0 AND percentage <= 100),
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee overrides table (per-agent or per-user)
CREATE TABLE IF NOT EXISTS public.fee_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_type TEXT NOT NULL CHECK (fee_type IN ('base', 'network', 'agent', 'priority')),
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL DEFAULT 0,
    percentage DECIMAL CHECK (percentage >= 0 AND percentage <= 100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK ((agent_id IS NOT NULL AND user_id IS NULL) OR (agent_id IS NULL AND user_id IS NOT NULL))
);

-- ============================================================================
-- 5. WALLET CONNECTORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wallet_connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    connector_type TEXT NOT NULL CHECK (connector_type IN ('phantom', 'solflare', 'backpack', 'ledger', 'coinbase', 'walletconnect')),
    enabled BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{
        "rpc_endpoint": "https://api.mainnet-beta.solana.com",
        "fallback_rpc": "https://solana-api.projectserum.com"
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. PRICE ORACLES TABLES
-- ============================================================================

-- Price oracles configuration table
CREATE TABLE IF NOT EXISTS public.price_oracles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    oracle_type TEXT NOT NULL CHECK (oracle_type IN ('pyth', 'coinbase', 'chainlink', 'custom')),
    enabled BOOLEAN DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 0,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oracle feeds table (individual price feeds)
CREATE TABLE IF NOT EXISTS public.oracle_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oracle_id UUID NOT NULL REFERENCES public.price_oracles(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    feed_id TEXT NOT NULL,
    token_address TEXT,
    refresh_interval_seconds INTEGER NOT NULL DEFAULT 60,
    last_price DECIMAL,
    last_updated TIMESTAMP WITH TIME ZONE,
    enabled BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(oracle_id, symbol)
);

-- ============================================================================
-- 7. RPC ENDPOINTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.rpc_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    network TEXT NOT NULL DEFAULT 'mainnet-beta' CHECK (network IN ('mainnet-beta', 'devnet', 'testnet')),
    endpoint_type TEXT NOT NULL DEFAULT 'http' CHECK (endpoint_type IN ('http', 'websocket')),
    priority INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    rate_limit INTEGER DEFAULT 100,
    proxy_mode BOOLEAN DEFAULT false,
    health_check_url TEXT,
    last_health_check TIMESTAMP WITH TIME ZONE,
    health_status TEXT DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'unhealthy', 'unknown')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. ADDONS TABLES
-- ============================================================================

-- Addons table
CREATE TABLE IF NOT EXISTS public.addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    addon_type TEXT NOT NULL CHECK (addon_type IN ('ai_builder', 'nft_generator', 'defi_automation', 'market_scanner', 'webhook', 'custom_tool')),
    version TEXT NOT NULL DEFAULT '1.0.0',
    enabled BOOLEAN DEFAULT true,
    installed BOOLEAN DEFAULT false,
    config_schema JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addon configurations table
CREATE TABLE IF NOT EXISTS public.addon_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    addon_id UUID NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. SDK & API KEYS TABLES
-- ============================================================================

-- API keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    name TEXT NOT NULL,
    scopes JSONB NOT NULL DEFAULT '["read"]'::jsonb,
    rate_limits JSONB DEFAULT '{
        "requests_per_minute": 60,
        "requests_per_hour": 1000
    }'::jsonb,
    billing_config JSONB DEFAULT '{}'::jsonb,
    enabled BOOLEAN DEFAULT true,
    last_used TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SDK configurations table
CREATE TABLE IF NOT EXISTS public.sdk_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sdk_type TEXT NOT NULL UNIQUE CHECK (sdk_type IN ('javascript', 'python', 'rust', 'webhooks', 'rest', 'websocket')),
    version TEXT NOT NULL DEFAULT '1.0.0',
    endpoint TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 10. AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 11. PLATFORM SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    setting_type TEXT NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 12. CREATE INDEXES
-- ============================================================================

-- Agents indexes
CREATE INDEX IF NOT EXISTS idx_agents_type ON public.agents(type);
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON public.agents(created_at DESC);

-- Agent relationships indexes
CREATE INDEX IF NOT EXISTS idx_agent_tools_agent_id ON public.agent_tools(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_skills_agent_id ON public.agent_skills(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_pipelines_agent_id ON public.agent_pipelines(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_pipelines_order ON public.agent_pipelines(agent_id, step_order);
CREATE INDEX IF NOT EXISTS idx_agent_schedules_agent_id ON public.agent_schedules(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_schedules_next_run ON public.agent_schedules(next_run) WHERE enabled = true;

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Billing indexes
CREATE INDEX IF NOT EXISTS idx_billing_invoices_user_id ON public.billing_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_status ON public.billing_invoices(status);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_due_date ON public.billing_invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_billing_payments_user_id ON public.billing_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_payments_invoice_id ON public.billing_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_billing_payments_status ON public.billing_payments(status);

-- Fees indexes
CREATE INDEX IF NOT EXISTS idx_fee_overrides_agent_id ON public.fee_overrides(agent_id);
CREATE INDEX IF NOT EXISTS idx_fee_overrides_user_id ON public.fee_overrides(user_id);

-- Oracles indexes
CREATE INDEX IF NOT EXISTS idx_oracle_feeds_oracle_id ON public.oracle_feeds(oracle_id);
CREATE INDEX IF NOT EXISTS idx_oracle_feeds_symbol ON public.oracle_feeds(symbol);
CREATE INDEX IF NOT EXISTS idx_oracle_feeds_enabled ON public.oracle_feeds(enabled) WHERE enabled = true;

-- RPC endpoints indexes
CREATE INDEX IF NOT EXISTS idx_rpc_endpoints_network ON public.rpc_endpoints(network);
CREATE INDEX IF NOT EXISTS idx_rpc_endpoints_enabled ON public.rpc_endpoints(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_rpc_endpoints_priority ON public.rpc_endpoints(priority DESC) WHERE enabled = true;

-- Addons indexes
CREATE INDEX IF NOT EXISTS idx_addons_type ON public.addons(addon_type);
CREATE INDEX IF NOT EXISTS idx_addons_installed ON public.addons(installed) WHERE installed = true;
CREATE INDEX IF NOT EXISTS idx_addon_configs_addon_id ON public.addon_configs(addon_id);
CREATE INDEX IF NOT EXISTS idx_addon_configs_user_id ON public.addon_configs(user_id);

-- API keys indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_enabled ON public.api_keys(enabled) WHERE enabled = true;

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_agent_id ON public.audit_log(agent_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_oracles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oracle_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rpc_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addon_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sdk_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only policies (for Tauri desktop app using service role)
-- Agents table policies
CREATE POLICY agents_admin_all ON public.agents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Agent tools policies
CREATE POLICY agent_tools_admin_all ON public.agent_tools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Agent skills policies
CREATE POLICY agent_skills_admin_all ON public.agent_skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Agent pipelines policies
CREATE POLICY agent_pipelines_admin_all ON public.agent_pipelines
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Agent schedules policies
CREATE POLICY agent_schedules_admin_all ON public.agent_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Billing plans policies (public read, admin write)
CREATE POLICY billing_plans_public_read ON public.billing_plans
    FOR SELECT USING (active = true);

CREATE POLICY billing_plans_admin_all ON public.billing_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Billing invoices policies (users see their own, admins see all)
CREATE POLICY billing_invoices_own_read ON public.billing_invoices
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY billing_invoices_admin_all ON public.billing_invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Billing payments policies (users see their own, admins see all)
CREATE POLICY billing_payments_own_read ON public.billing_payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY billing_payments_admin_all ON public.billing_payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Fees policies (public read, admin write)
CREATE POLICY fees_public_read ON public.fees
    FOR SELECT USING (active = true);

CREATE POLICY fees_admin_all ON public.fees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Fee overrides policies (admin only)
CREATE POLICY fee_overrides_admin_all ON public.fee_overrides
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Wallet connectors policies (public read, admin write)
CREATE POLICY wallet_connectors_public_read ON public.wallet_connectors
    FOR SELECT USING (enabled = true);

CREATE POLICY wallet_connectors_admin_all ON public.wallet_connectors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Price oracles policies (public read, admin write)
CREATE POLICY price_oracles_public_read ON public.price_oracles
    FOR SELECT USING (enabled = true);

CREATE POLICY price_oracles_admin_all ON public.price_oracles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Oracle feeds policies (public read, admin write)
CREATE POLICY oracle_feeds_public_read ON public.oracle_feeds
    FOR SELECT USING (enabled = true);

CREATE POLICY oracle_feeds_admin_all ON public.oracle_feeds
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- RPC endpoints policies (public read, admin write)
CREATE POLICY rpc_endpoints_public_read ON public.rpc_endpoints
    FOR SELECT USING (enabled = true);

CREATE POLICY rpc_endpoints_admin_all ON public.rpc_endpoints
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Addons policies (public read, admin write)
CREATE POLICY addons_public_read ON public.addons
    FOR SELECT USING (enabled = true);

CREATE POLICY addons_admin_all ON public.addons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Addon configs policies (users see their own, admins see all)
CREATE POLICY addon_configs_own_all ON public.addon_configs
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY addon_configs_admin_all ON public.addon_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- API keys policies (users manage their own, admins see all)
CREATE POLICY api_keys_own_all ON public.api_keys
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY api_keys_admin_read ON public.api_keys
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- SDK configs policies (public read, admin write)
CREATE POLICY sdk_configs_public_read ON public.sdk_configs
    FOR SELECT USING (enabled = true);

CREATE POLICY sdk_configs_admin_all ON public.sdk_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Audit log policies (admin read only)
CREATE POLICY audit_log_admin_read ON public.audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Platform settings policies (public read for public settings, admin all)
CREATE POLICY platform_settings_public_read ON public.platform_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY platform_settings_admin_all ON public.platform_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- ============================================================================
-- 14. INSERT DEFAULT DATA
-- ============================================================================

-- Insert default billing plans
INSERT INTO public.billing_plans (name, display_name, description, price_monthly, price_yearly, credits_included, features, limits)
VALUES
    ('free', 'Free', 'Perfect for trying out the platform', 0, 0, 100, 
     '["10 requests/minute", "Basic agents", "Community support"]'::jsonb,
     '{"requests_per_minute": 10, "agents": 3}'::jsonb),
    ('pro', 'Pro', 'For power users and small teams', 49, 490, 10000,
     '["100 requests/minute", "All agents", "Priority support", "Custom tools"]'::jsonb,
     '{"requests_per_minute": 100, "agents": 50}'::jsonb),
    ('enterprise', 'Enterprise', 'For large organizations', 499, 4990, 100000,
     '["Unlimited requests", "All agents", "24/7 support", "Custom integrations", "Dedicated infrastructure"]'::jsonb,
     '{"requests_per_minute": -1, "agents": -1}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert default fees
INSERT INTO public.fees (fee_type, amount, percentage, description, active)
VALUES
    ('base', 0.001, NULL, 'Base platform fee per request', true),
    ('network', 0.0001, NULL, 'Network transaction fee', true),
    ('agent', 0.0, 1.0, 'Agent-specific fee (1% of cost)', true),
    ('priority', 0.01, NULL, 'Priority processing fee', false)
ON CONFLICT (fee_type) DO NOTHING;

-- Insert default wallet connectors
INSERT INTO public.wallet_connectors (name, display_name, connector_type, enabled, config)
VALUES
    ('phantom', 'Phantom', 'phantom', true, '{"rpc_endpoint": "https://api.mainnet-beta.solana.com"}'::jsonb),
    ('solflare', 'Solflare', 'solflare', true, '{"rpc_endpoint": "https://api.mainnet-beta.solana.com"}'::jsonb),
    ('backpack', 'Backpack', 'backpack', true, '{"rpc_endpoint": "https://api.mainnet-beta.solana.com"}'::jsonb),
    ('ledger', 'Ledger', 'ledger', true, '{"rpc_endpoint": "https://api.mainnet-beta.solana.com"}'::jsonb),
    ('coinbase', 'Coinbase Wallet', 'coinbase', true, '{"rpc_endpoint": "https://api.mainnet-beta.solana.com"}'::jsonb),
    ('walletconnect', 'WalletConnect', 'walletconnect', true, '{"rpc_endpoint": "https://api.mainnet-beta.solana.com"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert default price oracles
INSERT INTO public.price_oracles (name, oracle_type, enabled, priority, config)
VALUES
    ('pyth', 'pyth', true, 1, '{"network": "mainnet-beta"}'::jsonb),
    ('coinbase', 'coinbase', true, 2, '{"api_url": "https://api.coinbase.com"}'::jsonb),
    ('chainlink', 'chainlink', true, 3, '{"network": "mainnet"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert default RPC endpoints
INSERT INTO public.rpc_endpoints (name, url, network, endpoint_type, priority, enabled, rate_limit)
VALUES
    ('solana-mainnet-primary', 'https://api.mainnet-beta.solana.com', 'mainnet-beta', 'http', 1, true, 100),
    ('solana-mainnet-serum', 'https://solana-api.projectserum.com', 'mainnet-beta', 'http', 2, true, 100),
    ('solana-devnet-primary', 'https://api.devnet.solana.com', 'devnet', 'http', 1, true, 100)
ON CONFLICT (name) DO NOTHING;

-- Insert default SDK configs
INSERT INTO public.sdk_configs (sdk_type, version, endpoint, enabled, config)
VALUES
    ('javascript', '1.0.0', 'https://cdn.jsdelivr.net/npm/@agentic/sdk@latest', true, '{}'::jsonb),
    ('python', '1.0.0', 'https://pypi.org/project/agentic-sdk/', true, '{}'::jsonb),
    ('rust', '1.0.0', 'https://crates.io/crates/agentic-sdk', true, '{}'::jsonb),
    ('rest', '1.0.0', '/api/v1', true, '{}'::jsonb),
    ('websocket', '1.0.0', 'wss://ws.agentic.dev', true, '{}'::jsonb),
    ('webhooks', '1.0.0', '/api/webhooks', true, '{}'::jsonb)
ON CONFLICT (sdk_type) DO NOTHING;

-- Insert default addons
INSERT INTO public.addons (name, display_name, description, addon_type, version, enabled, installed)
VALUES
    ('ai-builder', 'AI Builder', 'Build custom AI agents with natural language', 'ai_builder', '1.0.0', true, true),
    ('nft-generator', 'NFT Generator', 'Generate and mint NFT collections automatically', 'nft_generator', '1.0.0', true, false),
    ('defi-automation', 'DeFi Automation', 'Automate DeFi strategies and yield farming', 'defi_automation', '1.0.0', true, false),
    ('market-scanner', 'Market Scanner', 'Real-time market data and trading signals', 'market_scanner', '1.0.0', true, false),
    ('webhooks', 'Webhooks', 'Trigger actions with HTTP webhooks', 'webhook', '1.0.0', true, true)
ON CONFLICT (name) DO NOTHING;

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, setting_type, description, is_public)
VALUES
    ('platform_name', '"Agentic"'::jsonb, 'string', 'Platform name', true),
    ('maintenance_mode', 'false'::jsonb, 'boolean', 'Enable maintenance mode', false),
    ('max_agents_per_user', '50'::jsonb, 'number', 'Maximum agents per user', false),
    ('default_agent_timeout', '30000'::jsonb, 'number', 'Default agent timeout in milliseconds', false),
    ('enable_crypto_payments', 'true'::jsonb, 'boolean', 'Enable cryptocurrency payments', true)
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- 15. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_schedules_updated_at BEFORE UPDATE ON public.agent_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_plans_updated_at BEFORE UPDATE ON public.billing_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fees_updated_at BEFORE UPDATE ON public.fees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_overrides_updated_at BEFORE UPDATE ON public.fee_overrides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_connectors_updated_at BEFORE UPDATE ON public.wallet_connectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_oracles_updated_at BEFORE UPDATE ON public.price_oracles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rpc_endpoints_updated_at BEFORE UPDATE ON public.rpc_endpoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addons_updated_at BEFORE UPDATE ON public.addons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addon_configs_updated_at BEFORE UPDATE ON public.addon_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sdk_configs_updated_at BEFORE UPDATE ON public.sdk_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
