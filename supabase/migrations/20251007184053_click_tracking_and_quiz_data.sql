-- =====================================================
-- CLICK TRACKING & ENHANCED ANALYTICS MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. CREATE broker_clicks table for tracking CTA button clicks
CREATE TABLE IF NOT EXISTS broker_clicks (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  broker_id TEXT NOT NULL,
  user_mobile TEXT,
  user_name TEXT,
  clicked_at TIMESTAMP DEFAULT NOW(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  fb_click_id TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_broker_clicks_broker_id ON broker_clicks(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_clicks_mobile ON broker_clicks(user_mobile);
CREATE INDEX IF NOT EXISTS idx_broker_clicks_session ON broker_clicks(session_id);
CREATE INDEX IF NOT EXISTS idx_broker_clicks_date ON broker_clicks(clicked_at);

-- 2. ADD new columns to user_submissions table for full quiz data
ALTER TABLE user_submissions
  ADD COLUMN IF NOT EXISTS has_account TEXT,
  ADD COLUMN IF NOT EXISTS broker_info JSONB,
  ADD COLUMN IF NOT EXISTS user_type JSONB,
  ADD COLUMN IF NOT EXISTS main_challenge JSONB,
  ADD COLUMN IF NOT EXISTS trading_frequency TEXT,
  ADD COLUMN IF NOT EXISTS what_matters_most JSONB,
  ADD COLUMN IF NOT EXISTS investment_amount TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- 3. Add click tracking flag to user_submissions
ALTER TABLE user_submissions
  ADD COLUMN IF NOT EXISTS cta_clicked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cta_clicked_at TIMESTAMP;

-- 4. Create view for complete user analytics
CREATE OR REPLACE VIEW user_analytics_complete AS
SELECT
  us.*,
  bc.clicked_at as cta_clicked_at_actual,
  CASE WHEN bc.id IS NOT NULL THEN TRUE ELSE FALSE END as has_clicked_cta
FROM user_submissions us
LEFT JOIN broker_clicks bc ON us.session_id = bc.session_id;

-- 5. Grant permissions (adjust if needed)
ALTER TABLE broker_clicks ENABLE ROW LEVEL SECURITY;

-- Allow authenticated access
CREATE POLICY "Allow all operations for authenticated users"
  ON broker_clicks
  FOR ALL
  TO authenticated
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow all operations for service role"
  ON broker_clicks
  FOR ALL
  TO service_role
  USING (true);

-- 6. Create function to get broker performance metrics
CREATE OR REPLACE FUNCTION get_broker_performance()
RETURNS TABLE (
  broker_id TEXT,
  recommended_count BIGINT,
  click_count BIGINT,
  click_rate NUMERIC,
  conversion_count BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    us.recommended_broker as broker_id,
    COUNT(DISTINCT us.id) as recommended_count,
    COUNT(DISTINCT bc.id) as click_count,
    ROUND(
      CAST(COUNT(DISTINCT bc.id) AS NUMERIC) /
      NULLIF(COUNT(DISTINCT us.id), 0) * 100,
      2
    ) as click_rate,
    COUNT(DISTINCT CASE WHEN us.conversion_status = 'converted' THEN us.id END) as conversion_count,
    ROUND(
      CAST(COUNT(DISTINCT CASE WHEN us.conversion_status = 'converted' THEN us.id END) AS NUMERIC) /
      NULLIF(COUNT(DISTINCT us.id), 0) * 100,
      2
    ) as conversion_rate
  FROM user_submissions us
  LEFT JOIN broker_clicks bc ON us.session_id = bc.session_id
  GROUP BY us.recommended_broker
  ORDER BY recommended_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Migration complete
