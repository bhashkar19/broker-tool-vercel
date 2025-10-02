# 📊 Backup Tracking System Setup Guide

## What Was Done

We've implemented a **dual tracking system**:
- ✅ **Primary**: Facebook Pixel (existing)
- ✅ **Backup**: Supabase tracking_events table (NEW)

This ensures you capture conversion data even when Facebook Pixel is blocked by ad blockers (~30% of users).

---

## ⚙️ Setup Required (5 minutes)

### Step 1: Create the tracking_events Table

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/dqmpityshhywzayjysru/editor

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy & Run the SQL**
   - Open file: `supabase-migration-tracking-events.sql`
   - Copy ALL contents
   - Paste into Supabase SQL Editor
   - Click "Run" button (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - You should see: "tracking_events table created successfully!"
   - Message shows: "initial_row_count: 0"

### Step 2: Verify Everything Works

Run the verification script:

```bash
bun run check-tables.ts
```

You should see:
```
✅ user_submissions table exists!
✅ tracking_events table exists!
```

---

## 📈 What Gets Tracked

Every user interaction is now tracked to **both** systems:

| Event | When It Happens | Data Captured |
|-------|----------------|---------------|
| **tool_started** | User lands on tool | session_id, config_version |
| **lead_captured** | User enters name/mobile | name, mobile, session_id |
| **question_progressed** | User answers each question | progress, session_id |
| **recommendation_viewed** | User sees broker recommendation | broker_id, match_%, session_id |
| **cta_clicked** | User clicks "Open Account" | broker_id, affiliate_url, session_id |

---

## 📊 View Tracking Data

### Option 1: Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/dqmpityshhywzayjysru/editor
2. Click "Table Editor"
3. Select "tracking_events" table
4. View all events in real-time

### Option 2: SQL Queries

**Get today's conversions:**
```sql
SELECT
  event_name,
  broker_id,
  COUNT(*) as count
FROM tracking_events
WHERE created_at >= CURRENT_DATE
GROUP BY event_name, broker_id
ORDER BY count DESC;
```

**Track funnel drop-off:**
```sql
SELECT
  session_id,
  STRING_AGG(event_name, ' → ' ORDER BY created_at) as funnel
FROM tracking_events
GROUP BY session_id
ORDER BY MAX(created_at) DESC
LIMIT 20;
```

**Compare brokers:**
```sql
SELECT
  broker_id,
  COUNT(DISTINCT session_id) as unique_users,
  COUNT(*) FILTER (WHERE event_name = 'cta_clicked') as conversions
FROM tracking_events
WHERE broker_id IS NOT NULL
GROUP BY broker_id
ORDER BY conversions DESC;
```

---

## 🔍 Troubleshooting

### Issue: "Table not found" error
**Solution:** Run Step 1 again - the table wasn't created

### Issue: "Permission denied" error
**Solution:** Check that RLS policies were created:
```sql
SELECT * FROM pg_policies WHERE tablename = 'tracking_events';
```

### Issue: Events not showing up
**Solution:** Check browser console for errors:
- Press F12 → Console tab
- Look for "Tracking error" messages

---

## 🎯 Next Steps

Once the table is created:

1. ✅ All tracking code is already implemented
2. ✅ Events will start saving automatically
3. ✅ No code changes needed
4. ✅ Test by completing the broker tool questionnaire
5. ✅ Check tracking_events table for new rows

---

## 📝 Technical Details

**Files Modified:**
- `src/lib/supabase-database.ts` - Added trackEvent() function
- `src/app/api/track/route.ts` - Created tracking API endpoint
- `src/components/ModularBrokerTool.tsx` - Added dual tracking calls

**Database Schema:**
```sql
CREATE TABLE tracking_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,           -- tool_started, lead_captured, etc.
  session_id TEXT NOT NULL,           -- Unique user session
  broker_id TEXT,                     -- zerodha, upstox, etc.
  event_data JSONB DEFAULT '{}'::jsonb, -- Extra metadata
  user_agent TEXT,                    -- Browser info
  ip_address TEXT,                    -- User IP
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes Created:**
- session_id (group by user)
- event_name (filter by event type)
- created_at (time-based queries)
- broker_id (compare brokers)

---

## ✅ Checklist

- [ ] Run SQL migration in Supabase Dashboard
- [ ] Verify with `bun run check-tables.ts`
- [ ] Test the tool and check tracking_events table
- [ ] Monitor Facebook Pixel vs Supabase tracking ratio

**Expected Result:** ~30% more conversions tracked in Supabase (blocked FB Pixel users)

---

Need help? Check:
- Supabase logs: https://supabase.com/dashboard/project/dqmpityshhywzayjysru/logs/explorer
- Browser console: Press F12 → Console tab
