-- Create user_submissions table
CREATE TABLE IF NOT EXISTS user_submissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  current_broker VARCHAR(100) NOT NULL,
  execution_issues VARCHAR(50) NOT NULL,
  tools_satisfaction VARCHAR(50) NOT NULL,
  support_experience VARCHAR(50) NOT NULL,
  charges_concern VARCHAR(50) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  recommended_broker VARCHAR(100) NOT NULL,
  user_agent TEXT,
  ip_address VARCHAR(45),
  fb_click_id VARCHAR(255),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_submissions_created_at ON user_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_submissions_recommended_broker ON user_submissions(recommended_broker);
CREATE INDEX IF NOT EXISTS idx_user_submissions_current_broker ON user_submissions(current_broker);
CREATE INDEX IF NOT EXISTS idx_user_submissions_session_id ON user_submissions(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for form submissions)
CREATE POLICY "Allow public insert" ON user_submissions FOR INSERT TO anon WITH CHECK (true);

-- Create policy to allow service role to read all data (for admin dashboard)
CREATE POLICY "Allow service role full access" ON user_submissions FOR ALL TO service_role USING (true);