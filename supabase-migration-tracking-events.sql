-- ============================================
-- TRACKING EVENTS TABLE MIGRATION
-- Purpose: Backup tracking system (alternative to Facebook Pixel)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Create tracking_events table
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

-- 2. Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tracking_events_session ON tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_name ON tracking_events(event_name);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created ON tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_broker ON tracking_events(broker_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- 4. Create policy to allow service role to insert
DROP POLICY IF EXISTS "Allow service role to insert" ON tracking_events;
CREATE POLICY "Allow service role to insert" ON tracking_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 5. Create policy to allow service role to select
DROP POLICY IF EXISTS "Allow service role to select" ON tracking_events;
CREATE POLICY "Allow service role to select" ON tracking_events
  FOR SELECT
  TO service_role
  USING (true);

-- 6. Grant permissions
GRANT ALL ON tracking_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE tracking_events_id_seq TO service_role;

-- 7. Add table comment
COMMENT ON TABLE tracking_events IS 'Backup tracking events (alternative to Facebook Pixel blocked by ad blockers)';

-- 8. Verify table creation
SELECT
  'tracking_events table created successfully!' as message,
  COUNT(*) as initial_row_count
FROM tracking_events;
