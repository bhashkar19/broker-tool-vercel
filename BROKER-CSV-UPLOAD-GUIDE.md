# Broker CSV Upload Guide

## 🎯 Purpose
This guide explains how to use the **Broker Clicks Tracker** to know exactly which broker CSV data to upload.

---

## 📊 How It Works

### 1. **Database Setup (One-time)**
First, run this SQL in your Supabase database:

```sql
-- Copy and paste the contents of: supabase-migration-broker-upload-tracking.sql
```

This creates the `broker_upload_tracking` table.

### 2. **Check the Admin Dashboard**
Go to: `https://yourdomain.com/admin`

Look at the **"🎯 Broker Clicks - CSV Upload Tracker"** section.

You'll see something like:

```
┌─────────────────────────────────────────────────────┐
│ Zerodha                            [45 NEW]         │
│ Total: 120 clicks • Last uploaded: Oct 1, 2025      │
│                           [Mark as Uploaded] button  │
├─────────────────────────────────────────────────────┤
│ Upstox                             [12 NEW]         │
│ Total: 32 clicks • Last uploaded: Oct 1, 2025       │
│                           [Mark as Uploaded] button  │
├─────────────────────────────────────────────────────┤
│ Groww                                                │
│ Total: 5 clicks • Never uploaded                    │
│                           [Mark as Uploaded] button  │
└─────────────────────────────────────────────────────┘
```

### 3. **Understanding the Display**

- **Orange highlight with "NEW" badge** = This broker has NEW clicks since last upload
- **Gray background** = No new clicks since last upload
- **"Never uploaded"** = You haven't uploaded CSV for this broker yet
- **Last uploaded date** = Shows when you last uploaded CSV

### 4. **Your Workflow**

#### **Step 1: Check for NEW clicks**
- Look for brokers with orange "NEW" badge
- Example: "Zerodha - 45 NEW clicks"

#### **Step 2: Decide which CSVs to upload**
- If **NEW clicks > 10** → Upload CSV for that broker
- If **NEW clicks < 10** → Maybe wait for more data
- If **"Never uploaded"** and clicks > 5 → Upload CSV

#### **Step 3: Upload the CSV**
- Get the conversion CSV from that broker
- Go to "Upload CSV" tab
- Upload the file

#### **Step 4: Mark as Uploaded**
- After uploading, click **"Mark as Uploaded"** button
- This resets the counter
- NEW clicks will now start counting from this point

---

## 💡 Example Scenario

### Week 1 (Oct 1)
```
Dashboard shows:
- Zerodha: 50 clicks (Never uploaded)
- Upstox: 30 clicks (Never uploaded)
- Groww: 5 clicks (Never uploaded)
```

**Action:** Upload CSV for Zerodha and Upstox only (Groww has too few clicks).
Then click "Mark as Uploaded" for both.

### Week 2 (Oct 8)
```
Dashboard shows:
- Zerodha: 75 total, 25 NEW (Last uploaded: Oct 1)
- Upstox: 45 total, 15 NEW (Last uploaded: Oct 1)
- Groww: 18 total, 18 NEW (Never uploaded)
```

**Action:** Upload CSV for all three brokers (Groww now has enough clicks).
Then click "Mark as Uploaded" for all three.

### Week 3 (Oct 15)
```
Dashboard shows:
- Zerodha: 90 total, 15 NEW (Last uploaded: Oct 8)
- Upstox: 50 total, 5 NEW (Last uploaded: Oct 8)
- Groww: 22 total, 4 NEW (Last uploaded: Oct 8)
```

**Action:** Maybe only upload Zerodha (has most NEW clicks). Wait on others.

---

## 🚀 Benefits

1. **Save Time** - Don't upload CSV for brokers nobody uses
2. **Stay Updated** - Know exactly when you need fresh data
3. **Data-Driven** - Make decisions based on actual user behavior
4. **Track Everything** - See which brokers are popular over time

---

## 📝 Notes

- The tracker automatically counts clicks from users
- Clicking "Mark as Uploaded" does NOT upload files - it just marks the date
- You still need to manually upload CSV files in the "Upload CSV" tab
- The system tracks both primary broker clicks and alternative broker clicks

---

## ❓ Questions?

If something isn't working:
1. Check that the database migration was run
2. Make sure tracking_events table exists
3. Verify broker clicks are being recorded (check raw data in Supabase)
