# 🔄 CONVERSION TRACKING - TECHNICAL DEEP DIVE

**Last Updated:** January 7, 2025
**Audience:** Technical teams, AI systems, integration partners

---

## 🎯 TRACKING ARCHITECTURE OVERVIEW

### **Dual Tracking System:**

We use **both** browser-side (Pixel) and server-side (Conversions API) tracking:

```
User Journey
    ├─ Browser-Side (Facebook Pixel)
    │   ├─ PageView (immediate)
    │   ├─ Lead (quiz completed)
    │   ├─ ViewContent (results viewed)
    │   └─ InitiateCheckout (contact submitted)
    │
    └─ Server-Side (Conversions API)
        ├─ CompleteRegistration (broker lead)
        └─ Purchase (broker conversion) ← PRIMARY GOAL
```

**Why Both?**
- **Pixel:** Real-time, immediate optimization signal
- **Conversions API:** Bypasses ad blockers, includes hashed PII for better matching, more accurate
- **Together:** ~30% better attribution accuracy

---

## 📊 DETAILED EVENT FLOW

### **Event 1: User Clicks Facebook Ad**

**URL Structure:**
```
https://findbroker.paisowala.com/
  ?fbclid=AbCdEf123GhI456JkL789  ← Facebook Click ID
  &utm_source=facebook
  &utm_medium=cpc
  &utm_campaign=broker-discovery-jan2025
  &utm_content=ad-set-new-users
  &utm_term=stock-broker-india
```

**What Happens in Code:**

**File:** `src/components/ModularBrokerTool.tsx` (Line 1180)
```typescript
// Capture fbclid from URL
const urlParams = new URLSearchParams(window.location.search);
const fbClickId = urlParams.get('fbclid');  // "AbCdEf123GhI456JkL789"

// Store for later submission
submissionData.fb_click_id = fbClickId;
```

**File:** `src/components/FacebookPixelInit.tsx`
```typescript
useEffect(() => {
  // Track PageView when component mounts
  initPageView();  // Fires: fbq('track', 'PageView')
}, []);
```

**Result:**
- fbclid stored in component state
- PageView event sent to Facebook
- User browsing session begins

---

### **Event 2: User Completes Quiz**

**What Happens:**

**File:** `src/lib/facebook-pixel.ts`
```typescript
// Track Lead event
await trackEvent('Lead', {
  content_name: 'broker_quiz',
  content_category: 'quiz_completion'
});
```

**Facebook Pixel Call:**
```javascript
fbq('track', 'Lead', {
  content_name: 'broker_quiz',
  content_category: 'quiz_completion'
});
```

**Result:**
- Facebook knows user engaged with quiz
- Early signal for optimization
- No PII sent (privacy compliant)

---

### **Event 3: User Views Results**

**What Happens:**

**File:** `src/components/ModularBrokerTool.tsx`
```typescript
// Track ViewContent event
await trackEvent('ViewContent', {
  content_name: recommendedBroker,  // e.g., "zerodha"
  content_category: 'broker_recommendation'
});
```

**Result:**
- Facebook knows which broker was recommended
- Can optimize for users interested in specific brokers
- Still no PII

---

### **Event 4: User Submits Contact Info**

**What Happens:**

**File:** `src/components/ModularBrokerTool.tsx` (Line 1176-1184)
```typescript
const submissionData = {
  name: "Raj Kumar",
  mobile: "9876543210",
  sessionId: "unique-session-id",
  recommended_broker: "zerodha",
  timestamp: new Date().toISOString(),
  user_agent: navigator.userAgent,

  // CRITICAL: Facebook attribution data
  fb_click_id: "AbCdEf123GhI456JkL789",  // ← Captured from URL!
  utm_source: "facebook",
  utm_medium: "cpc",
  utm_campaign: "broker-discovery-jan2025",

  // Quiz answers
  hasAccount: "no",
  tradingFrequency: "daily",
  mainChallenge: "high_brokerage",
  // ... other fields
};
```

**API Call:**
```typescript
// Send to backend
const response = await fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(submissionData)
});
```

**Facebook Pixel:**
```typescript
// Track InitiateCheckout (backup conversion event)
await trackEvent('InitiateCheckout', {
  content_name: "zerodha",
  value: 350,  // Expected commission
  currency: 'INR'
});
```

**Result:**
- Contact info submitted to backend
- Facebook Pixel fires InitiateCheckout
- Still NO PII sent to Facebook Pixel (only backend)

---

### **Event 5: Backend Saves to Database**

**What Happens:**

**File:** `src/app/api/submit/route.ts` (Line 196-212)
```typescript
const submissionData = {
  name: data.name,                    // "Raj Kumar"
  mobile: data.mobile,                // "9876543210" (cleaned)
  session_id: data.sessionId,
  recommended_broker: data.recommended_broker,  // "zerodha"
  user_agent: data.user_agent,
  ip_address: ip,

  // Facebook attribution (CRITICAL!)
  fb_click_id: data.fb_click_id,      // "AbCdEf123GhI456JkL789"
  utm_source: data.utm_source,        // "facebook"
  utm_medium: data.utm_medium,        // "cpc"
  utm_campaign: data.utm_campaign,    // "broker-discovery-jan2025"

  // Conversion tracking fields
  conversion_status: 'pending',       // Not converted yet
  fb_sync_status: null,               // Not synced yet
  conversion_date: null,              // Don't know yet
  broker_client_id: null              // Don't know yet
};

await saveUserSubmission(submissionData);
```

**Database Insert:**
```sql
INSERT INTO user_submissions (
  name, mobile, session_id, recommended_broker,
  fb_click_id, utm_source, utm_medium, utm_campaign,
  conversion_status, fb_sync_status, created_at
) VALUES (
  'Raj Kumar',
  '9876543210',
  'session-12345',
  'zerodha',
  'AbCdEf123GhI456JkL789',  -- ← STORED FOREVER!
  'facebook',
  'cpc',
  'broker-discovery-jan2025',
  'pending',                 -- Not converted yet
  NULL,                      -- Not synced yet
  '2025-01-07 10:30:00'
);
```

**Result:**
- User data securely stored in Supabase
- fbclid preserved for future attribution
- Ready for conversion tracking later

---

### **Event 6: User Opens Account at Broker (Outside System)**

**Timeline:** 1-7 days later

**What Happens:**
- User clicks "Open Account" button
- Redirected to broker's website (e.g., zerodha.com)
- Fills KYC form, uploads documents
- Broker verifies and approves
- Account opened: January 9, 2025
- Broker assigns Client ID: "ZD987654"

**We don't know this happened yet!** This is normal and expected.

---

### **Event 7: Broker Sends CSV**

**Timeline:** 3-14 days after account opening

**CSV Format (Zerodha Example):**
```csv
Client ID,Name,Account Opening Date,Status
ZD987654,Rajkumar,09-01-2025,Active
ZD987655,Priya Singh,10-01-2025,Active
ZD987656,AmitKumar,08-01-2025,Active
```

**Note the variations:**
- "Rajkumar" vs "Raj Kumar" (database)
- "AmitKumar" vs "Amit Kumar"
- This is why we need fuzzy matching!

---

### **Event 8: CSV Upload & Name Matching**

**What Happens:**

**File:** `src/app/api/admin/upload-csv/route.ts`

**Step 1: Parse CSV (Lines 18-89)**
```typescript
function parseCSV(csvContent: string, brokerId: string, fileType: 'conversions' | 'leads') {
  // Read broker-specific config
  const config = getFileTypeConfig(brokerId, fileType);

  // Parse columns based on broker format
  const results = [];
  for (const row of csvRows) {
    results.push({
      name: row[nameColumn],          // "Rajkumar"
      clientId: row[clientIdColumn],  // "ZD987654"
      date: row[dateColumn],          // "09-01-2025"
      status: row[statusColumn]       // "Active"
    });
  }

  return results;
}
```

**Step 2: Fetch Matching Candidates (Lines 212-224)**
```typescript
// Get all submissions for this broker within date range
const { data: submissions } = await supabaseAdmin
  .from('user_submissions')
  .select('id, name, mobile, created_at, recommended_broker')
  .eq('recommended_broker', 'zerodha')
  .gte('created_at', earliestDate.toISOString());

// Result: [
//   { id: 12345, name: "Raj Kumar", mobile: "9876543210", ... }
//   { id: 12346, name: "Priya Singh", mobile: "9988776655", ... }
//   { id: 12347, name: "Amit Kumar", mobile: "8877665544", ... }
// ]
```

**Step 3: Fuzzy Name Matching (Lines 226-244)**
```typescript
const matchResults = batchMatchNames(
  csvRows,      // [{ name: "Rajkumar", clientId: "ZD987654", ... }]
  submissions,  // [{ id: 12345, name: "Raj Kumar", ... }]
  'zerodha',
  {
    autoMatchThreshold: 0.90,  // ≥90% = auto-match
    reviewThreshold: 0.70,     // 70-89% = manual review
    dateRangeDays: 60          // Match within ±60 days
  }
);
```

**Matching Algorithm (Simplified):**
```typescript
function calculateSimilarity(csvName: string, dbName: string): number {
  // 1. Normalize: lowercase, remove spaces, special chars
  const csv = csvName.toLowerCase().replace(/\s+/g, '');
  const db = dbName.toLowerCase().replace(/\s+/g, '');

  // 2. Compare: "rajkumar" vs "rajkumar" = 100% match!
  if (csv === db) return 1.0;

  // 3. Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(csv, db);
  const maxLength = Math.max(csv.length, db.length);

  return 1 - (distance / maxLength);

  // Example:
  // "rajkumar" vs "rajkumar" = 1.0 (100%)
  // "amitkumar" vs "amitkumar" = 1.0 (100%)
  // "priyadarshini" vs "priyadarshani" = 0.95 (95%)
}
```

**Match Results:**
```typescript
{
  autoMatched: [
    {
      confidence: 0.95,  // ≥90% threshold
      input: { name: "Rajkumar", clientId: "ZD987654", date: "2025-01-09" },
      match: { submissionId: 12345, submissionName: "Raj Kumar", mobile: "9876543210" }
    }
  ],
  needsReview: [
    // Matches with 70-89% confidence (ambiguous)
  ],
  noMatch: [
    // No matches found
  ]
}
```

**Step 4: Update Database (Lines 248-289)**
```typescript
for (const match of matchResults.autoMatched) {
  // Determine if it's a lead or conversion
  let conversionStatus: 'lead' | 'converted' = 'converted';

  // If client_id is empty → lead (signup started but not completed)
  if (!match.input.brokerClientId || match.input.brokerClientId.trim() === '') {
    conversionStatus = 'lead';
  }

  // Update database
  await supabaseAdmin
    .from('user_submissions')
    .update({
      broker_client_id: match.input.brokerClientId,   // "ZD987654"
      conversion_status: conversionStatus,            // "converted"
      conversion_date: match.input.brokerDate,        // "2025-01-09" ← BROKER'S DATE!
      match_confidence: match.confidence,             // 0.95
      fb_sync_status: 'pending',                      // Ready to sync!
      import_hash: generateImportHash(...)            // Prevent duplicates
    })
    .eq('id', match.match.submissionId);  // 12345
}
```

**Database After Update:**
```sql
-- Before:
id: 12345, name: "Raj Kumar", fb_click_id: "AbCdEf123...",
conversion_status: "pending", fb_sync_status: NULL,
conversion_date: NULL, broker_client_id: NULL

-- After:
id: 12345, name: "Raj Kumar", fb_click_id: "AbCdEf123...",
conversion_status: "converted", fb_sync_status: "pending",
conversion_date: "2025-01-09", broker_client_id: "ZD987654"
                    ↑ BROKER'S DATE (NOT upload date!)
```

**Result:**
- Conversion matched and stored
- fb_click_id still preserved from Day 1
- Ready to sync to Facebook

---

### **Event 9: Sync to Facebook Conversions API**

**What Happens:**

**File:** `src/app/api/admin/sync-facebook/route.ts`

**Step 1: Fetch Pending Conversions (Lines 14-20)**
```typescript
const { data: pendingSubmissions } = await supabaseAdmin
  .from('user_submissions')
  .select('*')
  .in('conversion_status', ['lead', 'converted'])
  .eq('fb_sync_status', 'pending')
  .not('conversion_date', 'is', null)
  .limit(100);

// Result: [
//   { id: 12345, name: "Raj Kumar", mobile: "9876543210",
//     fb_click_id: "AbCdEf123...", broker_client_id: "ZD987654",
//     conversion_status: "converted", conversion_date: "2025-01-09" }
// ]
```

**Step 2: For Each Conversion, Prepare Event (Lines 44-74)**
```typescript
for (const submission of pendingSubmissions) {
  if (submission.conversion_status === 'converted') {
    // Send Purchase event
    const result = await sendPurchaseEvent({
      name: submission.name,                      // "Raj Kumar"
      phone: submission.mobile,                   // "9876543210"
      brokerId: submission.recommended_broker,    // "zerodha"
      brokerClientId: submission.broker_client_id, // "ZD987654"
      conversionDate: new Date(submission.conversion_date!), // Jan 9, 2025
      fbclid: submission.fb_click_id || undefined, // "AbCdEf123..."
      value: 350,  // Commission value
      contentCategory: 'new_user_conversion'
    });
  }
}
```

**Step 3: Build Conversions API Payload**

**File:** `src/lib/facebook-conversions-api.ts` (Lines 292-329)

```typescript
export async function sendPurchaseEvent(params) {
  // Split name
  const nameParts = params.name.trim().split(' ');  // ["Raj", "Kumar"]
  const firstName = nameParts[0];                   // "Raj"
  const lastName = nameParts.slice(1).join(' ');    // "Kumar"

  return sendConversionEvent({
    eventName: 'Purchase',
    eventTime: params.conversionDate,  // ← Jan 9, 2025 (NOT today!)
    userData: {
      phone: params.phone,       // "9876543210"
      firstName: firstName,      // "Raj"
      lastName: lastName,        // "Kumar"
      country: 'in'              // India
    },
    fbclid: params.fbclid,       // "AbCdEf123..."
    customData: {
      value: params.value,       // 350
      currency: 'INR',
      contentName: params.brokerId,  // "zerodha"
      contentCategory: params.contentCategory,  // "new_user_conversion"
      brokerId: params.brokerId
    },
    eventId: `purchase_${params.brokerClientId}_${params.conversionDate.getTime()}`
  });
}
```

**Step 4: Hash PII & Send to Facebook (Lines 125-242)**

```typescript
async function sendConversionEvent(params) {
  // Hash all PII with SHA256
  const hashedUserData = {
    ph: [sha256(normalizePhone(params.userData.phone))],  // SHA256("+919876543210")
    fn: [sha256(params.userData.firstName.toLowerCase())], // SHA256("raj")
    ln: [sha256(params.userData.lastName.toLowerCase())],  // SHA256("kumar")
    country: [sha256(params.userData.country)],            // SHA256("in")

    // Facebook Click ID (for attribution)
    fbc: params.fbclid
      ? `fb.1.${Date.now()}.${params.fbclid}`  // "fb.1.1704614400.AbCdEf123..."
      : undefined
  };

  // Build event
  const event = {
    event_name: 'Purchase',
    event_time: Math.floor(params.eventTime.getTime() / 1000),  // Unix timestamp: 1704787200
    event_source_url: 'https://findbroker.paisowala.com',
    user_data: hashedUserData,
    custom_data: {
      value: 350,
      currency: 'INR',
      content_name: 'zerodha',
      content_category: 'new_user_conversion',
      broker_id: 'zerodha'
    },
    action_source: 'website',
    event_id: 'purchase_ZD987654_1704787200'  // Deduplication ID
  };

  // Send to Facebook
  const response = await fetch(
    'https://graph.facebook.com/v18.0/1069181438510520/events',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [event],
        access_token: process.env.FACEBOOK_CONVERSION_API_ACCESS_TOKEN
      })
    }
  );

  const result = await response.json();
  // { events_received: 1, fbtrace_id: "AnW8tZJY12L7n1Q0WlSwC0D" }

  return { success: true };
}
```

**Actual HTTP Request to Facebook:**
```http
POST https://graph.facebook.com/v18.0/1069181438510520/events
Content-Type: application/json

{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1704787200,
    "event_source_url": "https://findbroker.paisowala.com",
    "user_data": {
      "ph": ["a1b2c3d4e5f6..."],  // SHA256 hash
      "fn": ["1a2b3c4d5e6f..."],  // SHA256 hash
      "ln": ["9z8y7x6w5v4u..."],  // SHA256 hash
      "country": ["3t4r5e6w7q8..."],  // SHA256 hash
      "fbc": "fb.1.1704614400.AbCdEf123GhI456JkL789"
    },
    "custom_data": {
      "value": 350,
      "currency": "INR",
      "content_name": "zerodha",
      "content_category": "new_user_conversion"
    },
    "action_source": "website",
    "event_id": "purchase_ZD987654_1704787200"
  }],
  "access_token": "EAAxxxxxxx..."  // Your access token
}
```

**Facebook Response:**
```json
{
  "events_received": 1,
  "messages": [],
  "fbtrace_id": "AnW8tZJY12L7n1Q0WlSwC0D"
}
```

**Step 5: Update Database (Lines 77-84)**
```typescript
if (result.success) {
  await supabaseAdmin
    .from('user_submissions')
    .update({
      fb_sync_status: 'synced',              // Changed from 'pending'
      fb_sync_date: new Date().toISOString()  // "2025-01-12 15:00:00"
    })
    .eq('id', submission.id);  // 12345
}
```

**Database After Sync:**
```sql
id: 12345, name: "Raj Kumar", fb_click_id: "AbCdEf123...",
conversion_status: "converted", conversion_date: "2025-01-09",
fb_sync_status: "synced", fb_sync_date: "2025-01-12 15:00:00"
```

**Result:**
- Conversion sent to Facebook
- Attribution preserved (fbclid linked click → conversion)
- Database marked as synced

---

### **Event 10: Facebook Attribution**

**What Facebook Does:**

1. **Receives Event:**
   - Event: Purchase
   - Time: Jan 9, 2025 10:00 AM (Unix: 1704787200)
   - fbclid: "AbCdEf123GhI456JkL789"

2. **Looks Up Click:**
   - Searches for fbclid in their system
   - Finds: Ad click on Jan 7, 2025 at 10:15 AM

3. **Calculates Time Delta:**
   - Click: Jan 7, 10:15 AM
   - Conversion: Jan 9, 10:00 AM
   - Delta: **1 day, 23 hours, 45 minutes**

4. **Checks Attribution Window:**
   - Your setting: 7-day click, 1-day view
   - Delta: ~2 days
   - Within window? **YES ✅**

5. **Matches User:**
   - Hashed phone matches their database
   - Hashed name matches their database
   - High confidence match

6. **Attributes Conversion:**
   - Campaign: "Broker Discovery Jan 2025"
   - Ad Set: "New Users - No Demat Account"
   - Ad: "Confused which broker to choose?"
   - **Conversions: +1**
   - **Revenue: ₹350**

**Shows in Ads Manager:**
```
Campaign: Broker Discovery Jan 2025
├─ Ad Set: New Users - No Demat Account
│   ├─ Spend: ₹5,000
│   ├─ Link Clicks: 120
│   ├─ Leads (InitiateCheckout): 25
│   ├─ Purchases: 3  ← Your conversion!
│   ├─ Revenue: ₹1,050  ← 3 × ₹350
│   ├─ CPA: ₹1,667  ← ₹5,000 ÷ 3
│   └─ ROAS: 0.21  ← ₹1,050 ÷ ₹5,000
```

---

## 🔑 CRITICAL SUCCESS FACTORS

### **1. fbclid Capture is CRITICAL**

**Without fbclid:**
- Facebook cannot match click → conversion
- Attribution fails
- You waste ad spend on untrackable traffic

**How to ensure capture:**
- All Facebook ads automatically append `fbclid` parameter
- Your code captures it from URL (Line 1180)
- Stored in database forever (even if user converts 30 days later)

**Check capture rate:**
```sql
SELECT
  COUNT(*) AS total_submissions,
  COUNT(fb_click_id) AS has_fbclid,
  (COUNT(fb_click_id) * 100.0 / COUNT(*)) AS capture_rate
FROM user_submissions
WHERE utm_source = 'facebook';

-- Target: >70% capture rate
-- If <70%: Something is wrong (check tracking code)
```

### **2. event_time Must Be Broker's Date**

**CORRECT:**
```typescript
event_time: new Date(submission.conversion_date).getTime()  // Jan 9
```

**WRONG:**
```typescript
event_time: Date.now()  // Jan 12 (upload date) ❌
```

**Why it matters:**
- Facebook checks: Click time → Conversion time
- If you use upload date, delta could be outside attribution window
- Always use broker's actual conversion date from CSV

### **3. Deduplication is Important**

**Event ID Format:**
```typescript
event_id: `purchase_${brokerClientId}_${conversionDate.getTime()}`
// Example: "purchase_ZD987654_1704787200"
```

**Why:**
- Prevents sending same conversion twice
- If you re-upload CSV, Facebook ignores duplicates
- Ensures accurate conversion counting

### **4. Hashing PII is Required**

**Before sending to Facebook:**
```typescript
{
  "ph": ["sha256_hash_of_+919876543210"],  // ✅ Hashed
  "fn": ["sha256_hash_of_raj"],            // ✅ Hashed
  "ln": ["sha256_hash_of_kumar"]           // ✅ Hashed
}
```

**NOT:**
```typescript
{
  "ph": ["+919876543210"],  // ❌ Raw PII (violates policy!)
  "fn": ["Raj"],            // ❌ Raw PII
  "ln": ["Kumar"]           // ❌ Raw PII
}
```

**Why:**
- Privacy compliance (GDPR, user data protection)
- Facebook policy requirement
- Account suspension risk if violated

---

## 🚨 COMMON TRACKING ISSUES

### **Issue 1: Conversions Not Showing in Facebook**

**Symptoms:**
- Database shows conversions
- Facebook Ads Manager shows 0 conversions

**Diagnoses & Solutions:**

| Cause | Check | Fix |
|-------|-------|-----|
| Forgot to sync | Admin dashboard | Click "Sync to Facebook" button |
| Access token expired | Events Manager → Test Events | Regenerate token in FB Business Settings |
| fbclid not captured | Database query | Verify capture rate >70% |
| Event_time outside window | Check conversion_date | Verify within 7 days of click |
| API error | Server logs | Check error messages, fix payload |

**Diagnostic Query:**
```sql
SELECT
  id, name, mobile,
  recommended_broker,
  conversion_status,
  conversion_date,
  fb_click_id,
  fb_sync_status,
  fb_sync_date
FROM user_submissions
WHERE conversion_status = 'converted'
  AND fb_sync_status IS NULL
ORDER BY conversion_date DESC;

-- These need to be synced!
```

### **Issue 2: Attribution Mismatch**

**Symptoms:**
- You synced 10 conversions
- Facebook shows only 5 attributed

**Causes:**

1. **Outside Attribution Window (50%):**
   - Click on Jan 1 → Convert on Jan 15 = 14 days
   - Outside 7-day window
   - **Solution:** Extend to 28-day click attribution

2. **No fbclid (30%):**
   - Direct traffic, organic search
   - No click ID to match
   - **Solution:** These won't attribute (normal)

3. **User Matching Failed (15%):**
   - Hashed data doesn't match FB's records
   - User not on Facebook / different account
   - **Solution:** Can't fix (normal loss)

4. **Technical Error (5%):**
   - Wrong event_time format
   - Missing required fields
   - **Solution:** Check API response for errors

### **Issue 3: Duplicate Conversions**

**Symptoms:**
- Same user counted twice
- Inflated conversion numbers

**Causes:**

1. **CSV uploaded twice:**
   - **Prevention:** File hash check (already implemented)

2. **event_id not unique:**
   - **Fix:** Use `${clientId}_${timestamp}` format

3. **Multiple brokers:**
   - User opens accounts at 2 brokers
   - **This is VALID** (count both)

**Check for duplicates:**
```sql
SELECT
  name, mobile, broker_client_id,
  COUNT(*) as count
FROM user_submissions
WHERE conversion_status = 'converted'
GROUP BY name, mobile, broker_client_id
HAVING COUNT(*) > 1;

-- Should return 0 rows (no duplicates)
```

---

## 📊 MONITORING & DEBUGGING

### **Daily Health Check:**

```sql
-- 1. Check fbclid capture rate (target: >70%)
SELECT
  COUNT(*) AS total,
  COUNT(fb_click_id) AS with_fbclid,
  (COUNT(fb_click_id) * 100.0 / COUNT(*)) AS capture_rate
FROM user_submissions
WHERE created_at > NOW() - INTERVAL '24 hours';

-- 2. Check pending syncs
SELECT COUNT(*) AS pending_syncs
FROM user_submissions
WHERE conversion_status IN ('lead', 'converted')
  AND fb_sync_status = 'pending';

-- 3. Check sync failures
SELECT
  id, name, recommended_broker, notes
FROM user_submissions
WHERE fb_sync_status = 'failed'
  AND fb_sync_date > NOW() - INTERVAL '24 hours';

-- 4. Check conversion lag (time from click to conversion)
SELECT
  AVG(EXTRACT(DAY FROM (conversion_date::timestamp - created_at::timestamp))) AS avg_days_to_convert
FROM user_submissions
WHERE conversion_status = 'converted'
  AND conversion_date IS NOT NULL
  AND created_at > NOW() - INTERVAL '30 days';
```

### **Facebook Events Manager Verification:**

1. Go to: https://www.facebook.com/events_manager2/list/pixel/1069181438510520
2. Click "Test Events"
3. Visit your site from Facebook ad
4. Verify events appear in real-time:
   - PageView ✅
   - Lead ✅
   - InitiateCheckout ✅

5. Check "Conversions API" section
6. Verify Purchase events after sync:
   - Event Name: Purchase ✅
   - Event Time: Matches broker date ✅
   - fbc parameter present ✅
   - No errors ✅

---

## 🔧 TECHNICAL ENVIRONMENT

**Required Environment Variables:**

```bash
# .env.local

# Facebook Pixel (Public)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1069181438510520

# Facebook Conversions API (Secret)
FACEBOOK_CONVERSION_API_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx

# Optional: Test Events (for debugging)
FACEBOOK_TEST_EVENT_CODE=TEST12345
```

**How to Generate Access Token:**

1. Go to: https://business.facebook.com/settings/system-users
2. Create System User
3. Assign to Ad Account
4. Generate Token with permissions:
   - ads_management
   - business_management
5. Copy token → paste in .env.local
6. Token never expires (System User tokens are permanent)

---

## ✅ TRACKING CHECKLIST

**Before Launch:**
- [ ] Facebook Pixel installed on site
- [ ] Pixel ID correct (1069181438510520)
- [ ] fbclid capture tested (check URL params)
- [ ] Database table has fb_click_id column
- [ ] Conversions API access token configured
- [ ] Test event sent successfully
- [ ] Events Manager shows events

**After Launch (Daily):**
- [ ] Upload broker CSVs (as soon as received)
- [ ] Click "Sync to Facebook" button
- [ ] Verify conversions in Events Manager
- [ ] Check fbclid capture rate (>70%)
- [ ] Monitor pending_sync count

**Weekly:**
- [ ] Review attribution window (extend if needed)
- [ ] Check sync failures (fix errors)
- [ ] Analyze time-to-conversion (optimize CSV lag)
- [ ] Update conversion values (if commissions change)

---

**This technical documentation covers every detail of how conversion tracking works. Use it for troubleshooting, integration, and optimization.**
