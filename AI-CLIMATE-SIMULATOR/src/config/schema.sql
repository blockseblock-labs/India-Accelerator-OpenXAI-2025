-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bins table
CREATE TABLE bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_code TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bin_events table
CREATE TABLE bin_events (
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

-- Create indexes
CREATE INDEX idx_bin_events_bin_id_created ON bin_events(bin_id, created_at DESC);
CREATE INDEX idx_bin_events_location_created ON bin_events(location, created_at DESC);

-- Enable RLS
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bin_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "devices_can_insert_bins" ON bins
    FOR INSERT TO authenticated
    WITH CHECK (auth.role() = 'device');

CREATE POLICY "devices_can_insert_events" ON bin_events
    FOR INSERT TO authenticated
    WITH CHECK (auth.role() = 'device');