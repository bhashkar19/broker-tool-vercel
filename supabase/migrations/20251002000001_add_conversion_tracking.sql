-- Add conversion tracking columns to user_submissions table
ALTER TABLE user_submissions
ADD COLUMN IF NOT EXISTS fb_click_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS broker_client_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS conversion_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS conversion_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS match_confidence DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS import_hash VARCHAR(64),
ADD COLUMN IF NOT EXISTS fb_sync_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS fb_sync_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_user_submissions_fb_click_id ON user_submissions(fb_click_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_broker_client_id ON user_submissions(broker_client_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_conversion_status ON user_submissions(conversion_status);
CREATE INDEX IF NOT EXISTS idx_user_submissions_fb_sync_status ON user_submissions(fb_sync_status);
CREATE INDEX IF NOT EXISTS idx_user_submissions_import_hash ON user_submissions(import_hash);

-- Create conversion_imports table to track CSV uploads
CREATE TABLE IF NOT EXISTS conversion_imports (
  id BIGSERIAL PRIMARY KEY,
  broker_id VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_hash VARCHAR(64) UNIQUE NOT NULL,
  total_rows INTEGER NOT NULL,
  matched_rows INTEGER DEFAULT 0,
  unmatched_rows INTEGER DEFAULT 0,
  duplicate_rows INTEGER DEFAULT 0,
  upload_status VARCHAR(50) DEFAULT 'processing',
  uploaded_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for conversion_imports
CREATE INDEX IF NOT EXISTS idx_conversion_imports_broker_id ON conversion_imports(broker_id);
CREATE INDEX IF NOT EXISTS idx_conversion_imports_created_at ON conversion_imports(created_at);
CREATE INDEX IF NOT EXISTS idx_conversion_imports_upload_status ON conversion_imports(upload_status);

-- Create manual_review_queue table for uncertain matches
CREATE TABLE IF NOT EXISTS manual_review_queue (
  id BIGSERIAL PRIMARY KEY,
  import_id BIGINT REFERENCES conversion_imports(id),
  broker_id VARCHAR(100) NOT NULL,
  broker_name VARCHAR(255) NOT NULL,
  broker_client_id VARCHAR(100),
  broker_conversion_date TIMESTAMP WITH TIME ZONE,

  -- Potential matches (JSON array of submission IDs with confidence scores)
  potential_matches JSONB,

  -- Selected match
  matched_submission_id BIGINT REFERENCES user_submissions(id),
  match_confidence DECIMAL(5,2),

  -- Review status
  review_status VARCHAR(50) DEFAULT 'pending',
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMP WITH TIME ZONE,

  -- Raw CSV row data
  csv_row_data JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for manual_review_queue
CREATE INDEX IF NOT EXISTS idx_manual_review_queue_import_id ON manual_review_queue(import_id);
CREATE INDEX IF NOT EXISTS idx_manual_review_queue_broker_id ON manual_review_queue(broker_id);
CREATE INDEX IF NOT EXISTS idx_manual_review_queue_review_status ON manual_review_queue(review_status);
CREATE INDEX IF NOT EXISTS idx_manual_review_queue_matched_submission_id ON manual_review_queue(matched_submission_id);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE conversion_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_review_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for conversion_imports
CREATE POLICY "Allow service role full access to conversion_imports"
  ON conversion_imports FOR ALL TO service_role USING (true);

-- Create policies for manual_review_queue
CREATE POLICY "Allow service role full access to manual_review_queue"
  ON manual_review_queue FOR ALL TO service_role USING (true);

-- Add comments for documentation
COMMENT ON COLUMN user_submissions.fb_click_id IS 'Facebook Click ID (fbclid) for attribution';
COMMENT ON COLUMN user_submissions.broker_client_id IS 'Client ID assigned by the broker after account opening';
COMMENT ON COLUMN user_submissions.conversion_status IS 'pending | converted | rejected';
COMMENT ON COLUMN user_submissions.conversion_date IS 'Date when broker confirmed account opening';
COMMENT ON COLUMN user_submissions.match_confidence IS 'Confidence score (0-100) for CSV name matching';
COMMENT ON COLUMN user_submissions.import_hash IS 'Hash of broker CSV row to prevent duplicates';
COMMENT ON COLUMN user_submissions.fb_sync_status IS 'pending | synced | failed - Facebook Conversions API sync status';
COMMENT ON COLUMN user_submissions.fb_sync_date IS 'Date when conversion was synced to Facebook via Conversions API';

COMMENT ON TABLE conversion_imports IS 'Tracks CSV file uploads from brokers';
COMMENT ON TABLE manual_review_queue IS 'Queue for manually reviewing uncertain name matches';
