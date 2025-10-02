-- Create tracking_events table for backup analytics
CREATE TABLE IF NOT EXISTS tracking_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  broker_id TEXT,
  event_data JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tracking_events_session ON tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_name ON tracking_events(event_name);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created ON tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_broker ON tracking_events(broker_id);

-- Enable Row Level Security
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role to insert" ON tracking_events;
DROP POLICY IF EXISTS "Allow service role to select" ON tracking_events;

-- Create policies to allow service role to insert and select
CREATE POLICY "Allow service role to insert" ON tracking_events
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Allow service role to select" ON tracking_events
  FOR SELECT TO service_role USING (true);

-- Grant permissions
GRANT ALL ON tracking_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE tracking_events_id_seq TO service_role;

-- Add table comment
COMMENT ON TABLE tracking_events IS 'Backup tracking events (alternative to Facebook Pixel blocked by ad blockers)';
