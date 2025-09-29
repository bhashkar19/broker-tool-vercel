import { sql } from '@vercel/postgres';

export interface UserSubmission {
  id?: number;
  name: string;
  mobile: string;
  current_broker: string;
  execution_issues: string;
  tools_satisfaction: string;
  support_experience: string;
  charges_concern: string;
  session_id: string;
  recommended_broker: string;
  user_agent: string;
  ip_address: string;
  fb_click_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: Date;
}

// Initialize database table
export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_submissions (
        id SERIAL PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create index for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_submissions_created_at
      ON user_submissions(created_at);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_submissions_recommended_broker
      ON user_submissions(recommended_broker);
    `;

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
}

// Save user submission to database
export async function saveUserSubmission(data: UserSubmission) {
  try {
    const result = await sql`
      INSERT INTO user_submissions (
        name, mobile, current_broker, execution_issues, tools_satisfaction,
        support_experience, charges_concern, session_id, recommended_broker,
        user_agent, ip_address, fb_click_id, utm_source, utm_medium, utm_campaign
      ) VALUES (
        ${data.name}, ${data.mobile}, ${data.current_broker}, ${data.execution_issues},
        ${data.tools_satisfaction}, ${data.support_experience}, ${data.charges_concern},
        ${data.session_id}, ${data.recommended_broker}, ${data.user_agent}, ${data.ip_address},
        ${data.fb_click_id || null}, ${data.utm_source || null}, ${data.utm_medium || null},
        ${data.utm_campaign || null}
      )
      RETURNING id, created_at;
    `;

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error saving user submission:', error);
    return { success: false, error };
  }
}

// Get all submissions
export async function getAllSubmissions(limit: number = 100, offset: number = 0) {
  try {
    const result = await sql`
      SELECT * FROM user_submissions
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error };
  }
}

// Get submissions by broker
export async function getSubmissionsByBroker(broker: string) {
  try {
    const result = await sql`
      SELECT * FROM user_submissions
      WHERE recommended_broker = ${broker}
      ORDER BY created_at DESC;
    `;

    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error fetching submissions by broker:', error);
    return { success: false, error };
  }
}

// Get analytics summary
export async function getAnalyticsSummary() {
  try {
    const totalSubmissions = await sql`
      SELECT COUNT(*) as total FROM user_submissions;
    `;

    const brokerStats = await sql`
      SELECT recommended_broker, COUNT(*) as count
      FROM user_submissions
      GROUP BY recommended_broker
      ORDER BY count DESC;
    `;

    const recentSubmissions = await sql`
      SELECT COUNT(*) as count
      FROM user_submissions
      WHERE created_at >= NOW() - INTERVAL '24 hours';
    `;

    const topCurrentBrokers = await sql`
      SELECT current_broker, COUNT(*) as count
      FROM user_submissions
      GROUP BY current_broker
      ORDER BY count DESC
      LIMIT 5;
    `;

    return {
      success: true,
      data: {
        totalSubmissions: totalSubmissions.rows[0].total,
        recentSubmissions: recentSubmissions.rows[0].count,
        brokerRecommendations: brokerStats.rows,
        topCurrentBrokers: topCurrentBrokers.rows
      }
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { success: false, error };
  }
}