-- Create broker_upload_tracking table
-- This table tracks when CSV data was last uploaded for each broker
-- Used to calculate "NEW clicks since last upload"

CREATE TABLE IF NOT EXISTS broker_upload_tracking (
  id BIGSERIAL PRIMARY KEY,
  broker_id TEXT UNIQUE NOT NULL,
  last_upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_broker_upload_tracking_broker_id
ON broker_upload_tracking(broker_id);

-- Add comment
COMMENT ON TABLE broker_upload_tracking IS
'Tracks when CSV conversion data was last uploaded for each broker. Used to calculate new clicks since last upload.';
