-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('device', 'operator', 'host', 'buyer');
CREATE TYPE stream_type AS ENUM ('HV', 'LV', 'ORG');
CREATE TYPE unit_type AS ENUM ('count', 'kg');
CREATE TYPE severity_type AS ENUM ('low', 'medium', 'high');
CREATE TYPE purity_tier AS ENUM ('A', 'B', 'C');

-- Create profiles table (managed by auth provider)
CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY,
    display_name TEXT,
    role user_role NOT NULL,
    wallet_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bins table
CREATE TABLE IF NOT EXISTS bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_code TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    owner_user_id UUID REFERENCES profiles(user_id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bin_events table
CREATE TABLE IF NOT EXISTS bin_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID REFERENCES bins(id),
    bin_code TEXT NOT NULL,
    location TEXT NOT NULL,
    timestamp_utc TIMESTAMPTZ NOT NULL,
    fill_level_pct NUMERIC NOT NULL,
    weight_kg_total NUMERIC NOT NULL,
    weight_kg_delta NUMERIC,
    battery_pct INTEGER NOT NULL,
    ai_model_id TEXT,
    ai_confidence_avg NUMERIC,
    hv_count INTEGER NOT NULL,
    lv_count INTEGER NOT NULL,
    org_count INTEGER NOT NULL,
    payload_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create aggregates_location_daily table
CREATE TABLE IF NOT EXISTS aggregates_location_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT NOT NULL,
    date DATE NOT NULL,
    hv_count INTEGER DEFAULT 0,
    lv_count INTEGER DEFAULT 0,
    org_count INTEGER DEFAULT 0,
    weight_kg_total NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(location, date)
);

-- Create price_tables table
CREATE TABLE IF NOT EXISTS price_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT NOT NULL,
    stream stream_type NOT NULL,
    price_per_unit NUMERIC NOT NULL,
    unit unit_type DEFAULT 'count',
    effective_date DATE NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(location, stream, effective_date)
);

-- Create anomalies table
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID REFERENCES bins(id),
    bin_code TEXT NOT NULL,
    location TEXT NOT NULL,
    timestamp_utc TIMESTAMPTZ NOT NULL,
    type TEXT NOT NULL,
    severity severity_type NOT NULL,
    details JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create earnings_ledger table
CREATE TABLE IF NOT EXISTS earnings_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_user_id UUID REFERENCES profiles(user_id),
    bin_id UUID REFERENCES bins(id),
    location TEXT NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    sales_hv NUMERIC NOT NULL,
    sales_lv NUMERIC NOT NULL,
    commission NUMERIC NOT NULL,
    host_payout NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create rewards_ledger table
CREATE TABLE IF NOT EXISTS rewards_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_user_id UUID REFERENCES profiles(user_id),
    bin_id UUID REFERENCES bins(id),
    location TEXT NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    hv_count INTEGER NOT NULL,
    lv_count INTEGER NOT NULL,
    purity_tier purity_tier NOT NULL,
    points_awarded NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create badges_ledger table
CREATE TABLE IF NOT EXISTS badges_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_user_id UUID REFERENCES profiles(user_id),
    badge_type TEXT NOT NULL,
    threshold INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bin_events_bin_id_created ON bin_events(bin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bin_events_location_created ON bin_events(location, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aggregates_location_date ON aggregates_location_daily(location, date DESC);
CREATE INDEX IF NOT EXISTS idx_price_tables_location_date ON price_tables(location, effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_anomalies_bin_created ON anomalies(bin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_earnings_host_period ON earnings_ledger(host_user_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_rewards_host_period ON rewards_ledger(host_user_id, period_start DESC);

-- Enable Row Level Security
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bin_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregates_location_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges_ledger ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Devices can only insert events
CREATE POLICY "devices_can_insert_bins" ON bins
    FOR INSERT TO authenticated
    WITH CHECK (auth.role() = 'device');

CREATE POLICY "devices_can_insert_events" ON bin_events
    FOR INSERT TO authenticated
    WITH CHECK (auth.role() = 'device');

-- Operators can read everything and manage price tables
CREATE POLICY "operators_full_access" ON bins
    FOR ALL TO authenticated
    USING (auth.role() = 'operator');

CREATE POLICY "operators_full_access" ON bin_events
    FOR ALL TO authenticated
    USING (auth.role() = 'operator');

CREATE POLICY "operators_full_access" ON price_tables
    FOR ALL TO authenticated
    USING (auth.role() = 'operator');

CREATE POLICY "operators_full_access" ON anomalies
    FOR ALL TO authenticated
    USING (auth.role() = 'operator');

-- Hosts can read their own data
CREATE POLICY "hosts_read_own_bins" ON bins
    FOR SELECT TO authenticated
    USING (auth.role() = 'host' AND owner_user_id = auth.uid());

CREATE POLICY "hosts_read_own_events" ON bin_events
    FOR SELECT TO authenticated
    USING (auth.role() = 'host' AND bin_id IN (
        SELECT id FROM bins WHERE owner_user_id = auth.uid()
    ));

CREATE POLICY "hosts_read_own_earnings" ON earnings_ledger
    FOR SELECT TO authenticated
    USING (auth.role() = 'host' AND host_user_id = auth.uid());

CREATE POLICY "hosts_read_own_rewards" ON rewards_ledger
    FOR SELECT TO authenticated
    USING (auth.role() = 'host' AND host_user_id = auth.uid());

CREATE POLICY "hosts_read_own_badges" ON badges_ledger
    FOR SELECT TO authenticated
    USING (auth.role() = 'host' AND host_user_id = auth.uid());