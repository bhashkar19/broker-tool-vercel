# 📊 BROKER DISCOVERY TOOL - COMPLETE SYSTEM OVERVIEW

**Last Updated:** January 7, 2025
**Document Purpose:** Comprehensive guide for marketing agencies, AI systems, and ad creators

---

## 🎯 WHAT WE DO (In Simple Terms)

**The Problem We Solve:**
- India has 50+ stock brokers - choosing is overwhelming
- Every trader has different needs (frequency, budget, segments, experience)
- Most people choose brokers randomly (friend's recommendation, first ad they see)
- This leads to wrong fit → frustration → switching costs

**Our Solution:**
- Free 60-second quiz that analyzes trading style
- Smart algorithm matches user with best-fit broker
- Not "cheapest" or "most popular" - the RIGHT FIT for them
- 100% free, no signup required, instant results

**Our Website:** https://findbroker.paisowala.com

---

## 💰 HOW WE MAKE MONEY (Revenue Model)

### **Revenue Stream: Affiliate Commissions**

When a user:
1. Takes our quiz → Gets broker recommendation
2. Clicks "Open Account" → Goes to broker's website
3. Opens account → We earn commission from broker

### **Commission Structure:**

| Broker | New User Commission | Existing User (Switching) | Average Per Conversion |
|--------|---------------------|---------------------------|------------------------|
| Zerodha | ₹300-400 | ₹200-300 | ₹350 |
| Angel One | ₹250-350 | ₹150-250 | ₹300 |
| Upstox | ₹300-400 | ₹200-300 | ₹350 |
| Groww | ₹200-300 | ₹100-200 | ₹250 |
| ICICI Direct | ₹400-500 | ₹300-400 | ₹450 |

**Key Insight:** New users (no existing demat account) are worth MORE than existing users (switching brokers)

### **Unit Economics:**

**Cost Per Lead (CPL):**
- Facebook Ads: ₹30-50 per lead (someone who fills the quiz)
- Google Search Ads: ₹20-40 per lead

**Conversion Rate:**
- Quiz completion → Contact submission: 65%
- Contact submission → Account opening: 8-12% (varies by broker)

**Cost Per Acquisition (CPA):**
- Target: ₹250-400 per conversion
- Current: ~₹350 average
- Revenue per conversion: ₹300-350 commission
- Breakeven/slight profit margin

**Economics Example:**
```
1000 website visitors
├─ 350 complete quiz (35% engagement)
├─ 228 submit contact info (65% of quiz takers)
└─ 23 open broker account (10% conversion)

Revenue: 23 × ₹350 = ₹8,050
Ad Spend: 228 leads × ₹40 CPL = ₹9,120
Net: -₹1,070 (loss)

BUT: Long-term value increases if users trade actively
```

### **Monetization Strategy:**

1. **Primary:** Broker affiliate commissions (current)
2. **Future (Planned):**
   - Brokerage charge sharing (revenue share from trading)
   - Premium features (advanced tools, research)
   - Broker advertising/sponsorships

---

## 🏗️ SYSTEM ARCHITECTURE (How It Works)

### **Frontend Journey (User Experience):**

```
User lands on site
    ↓
Sees hero message: "Find the broker that fits YOUR trading style"
    ↓
Clicks "Find My Match"
    ↓
Quiz starts (6 questions):
    1. Do you have a demat account? (New vs Existing user)
    2. How many brokers do you use?
    3. What type of trader are you? (Day trader, Investor, Options trader, etc.)
    4. What's your main challenge? (High charges, slow execution, etc.)
    5. How often do you trade? (Daily, Weekly, Monthly, Rarely)
    6. What matters most? (Cost, Tools, Support, Research)
    ↓
Algorithm calculates scores for 15+ brokers
    ↓
Shows TOP recommendation + 2-3 alternatives
    ↓
User enters: Name + Mobile number
    ↓
Results page with:
    - Recommended broker details
    - Why it's the best fit
    - "Open Account" button (affiliate link)
    - Comparison with alternatives
    ↓
User clicks "Open Account"
    ↓
Goes to broker's website
    ↓
Opens account on broker's site (outside our system)
```

### **Backend Architecture:**

**Technologies Used:**
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Analytics:** Google Analytics, Microsoft Clarity, Facebook Pixel

**Database Schema (Simplified):**

```sql
user_submissions (Main table)
├─ id (unique identifier)
├─ name (user's name)
├─ mobile (10-digit Indian mobile)
├─ recommended_broker (zerodha, angel, upstox, etc.)
├─ session_id (tracking unique sessions)
├─ created_at (submission timestamp)
├─ fb_click_id (Facebook click ID for attribution)
├─ utm_source, utm_medium, utm_campaign (tracking params)
├─ conversion_status (pending/lead/converted)
├─ conversion_date (when account was opened - from broker CSV)
├─ broker_client_id (broker's client ID - from CSV)
├─ fb_sync_status (pending/synced/failed)
└─ fb_sync_date (when synced to Facebook)
```

---

## 📈 CONVERSION TRACKING FLOW (Step-by-Step)

### **Day 1: User Clicks Facebook Ad**

```
Facebook Ad shown to user
    ↓
User clicks ad
    ↓
Lands on: https://findbroker.paisowala.com/?fbclid=AbCdEf123&utm_source=facebook
    ↓
Our system captures:
    - fbclid=AbCdEf123 (CRITICAL for attribution!)
    - utm_source=facebook
    - utm_medium=cpc
    - utm_campaign=broker-discovery-jan2025
    ↓
Facebook Pixel fires: PageView event
    ↓
User takes quiz
    ↓
Facebook Pixel fires: Lead event
    ↓
User submits contact info (Name: "Raj Kumar", Mobile: "9876543210")
    ↓
Saved to database:
    {
      name: "Raj Kumar",
      mobile: "9876543210",
      recommended_broker: "zerodha",
      fb_click_id: "AbCdEf123",  ← Stored for later!
      conversion_status: "pending",
      created_at: "2025-01-07 10:30:00"
    }
    ↓
Facebook Pixel fires: InitiateCheckout event
```

### **Day 1-3: User Opens Account at Broker**

```
User clicks "Open Account" button
    ↓
Goes to broker's website (e.g., zerodha.com)
    ↓
Fills KYC form, uploads documents
    ↓
Broker verifies & approves
    ↓
Account opened on January 9, 2025
    ↓
Broker assigns Client ID: "ZD987654"
    ↓
WE DON'T KNOW YET (normal!)
```

### **Day 5-7: Broker Sends Conversion CSV**

```
Broker emails us CSV file:
    Client ID,   Name,       Account Opening Date, Status
    ZD987654,    Rajkumar,   09-01-2025,          Active
    ↓
We download CSV
```

### **Day 5-7: We Upload CSV to Admin Dashboard**

```
Go to: /admin → Upload CSV tab
    ↓
Upload broker's CSV file
    ↓
System parses CSV and extracts:
    - Name: "Rajkumar"
    - Client ID: "ZD987654"
    - Date: "09-01-2025"
    ↓
System searches database for matches:
    - Broker: zerodha
    - Date range: Jan 7 ± 60 days
    - Finds: "Raj Kumar" (mobile: 9876543210)
    ↓
Fuzzy name matching:
    CSV: "Rajkumar"
    DB:  "Raj Kumar"
    Confidence: 95% ✅ (auto-matched!)
    ↓
Database updated:
    {
      id: 12345,
      name: "Raj Kumar",
      fb_click_id: "AbCdEf123",  ← Still stored!
      broker_client_id: "ZD987654",  ← NEW
      conversion_status: "converted",  ← Changed!
      conversion_date: "2025-01-09",  ← Broker's date!
      fb_sync_status: "pending"  ← Ready to sync!
    }
```

### **Day 5-7: Sync Conversion to Facebook**

```
Go to: /admin → Analytics → Click "Sync to Facebook"
    ↓
System fetches all records with:
    - conversion_status = "converted"
    - fb_sync_status = "pending"
    ↓
For each conversion:
    ↓
    Prepare Facebook event:
    {
      event_name: "Purchase",
      event_time: 1704787200,  ← Jan 9 timestamp (NOT today!)
      user_data: {
        phone: "sha256_hash_of_+919876543210",  ← Hashed for privacy!
        first_name: "sha256_hash_of_raj",
        last_name: "sha256_hash_of_kumar",
        fbclid: "fb.1.xxx.AbCdEf123",  ← From Day 1!
        country: "in"
      },
      custom_data: {
        value: 350,  ← Commission value
        currency: "INR",
        content_name: "zerodha",
        content_category: "new_user_conversion"
      }
    }
    ↓
    Send to Facebook Conversions API
    ↓
    Facebook response: SUCCESS ✅
    ↓
    Update database:
    {
      fb_sync_status: "synced",
      fb_sync_date: "2025-01-12 15:00:00"
    }
```

### **Day 5-7: Facebook Attributes Conversion**

```
Facebook receives event
    ↓
Looks up fbclid: "AbCdEf123"
    ↓
Finds: Ad click on Jan 7, 2025 at 10:15 AM
    ↓
Calculates: Jan 7 → Jan 9 = 2 days
    ↓
Within 7-day attribution window? YES ✅
    ↓
Attributes conversion to ad campaign:
    - Campaign: "Broker Discovery Jan 2025"
    - Ad Set: "Interest - Stock Market India"
    - Ad: "Find Your Perfect Broker"
    - Conversions: +1
    - Cost per conversion: ₹350
```

---

## 🎯 WHY DELAYED CSV UPLOAD STILL WORKS

**Critical Understanding:**

The system uses the **broker's conversion date** (from CSV), NOT the upload date!

**Example Timeline:**
- **Jan 7:** User clicks ad, fills quiz, captures fbclid
- **Jan 9:** User opens account (we don't know yet)
- **Jan 12:** We upload CSV (5 days later)
- **Jan 12:** We sync to Facebook with **event_time = Jan 9**
- **Facebook sees:** Click on Jan 7 → Convert on Jan 9 = 2 days ✅

**Attribution Window:**
- Default: 7-day click, 1-day view
- Can be extended to 28 days if needed
- Even if you upload CSV 30 days later, as long as the conversion happened within the window, it attributes correctly

---

## 📊 KEY METRICS WE TRACK

### **Frontend (Facebook Pixel):**
- PageView (all visitors)
- Lead (quiz completed)
- ViewContent (viewing results)
- InitiateCheckout (contact info submitted)

### **Backend (Conversions API):**
- **CompleteRegistration** (broker lead - signup started but not complete)
- **Purchase** (broker conversion - account fully opened)

### **Business Metrics:**
- Quiz completion rate: ~35%
- Contact submission rate: ~65% of quiz takers
- Conversion rate: ~8-12% of contacts
- Cost per lead: ₹30-50
- Cost per acquisition: ₹250-400
- Revenue per conversion: ₹300-350

---

## 🚀 USER SEGMENTATION

### **Segment 1: New Users (No Demat Account)**
- **Value:** HIGH (commission ₹300-400)
- **Message:** "Start your trading journey RIGHT"
- **Focus:** Education, guidance, simplicity
- **Percentage:** ~40% of traffic

### **Segment 2: Existing Users (Unhappy with Current Broker)**
- **Value:** MEDIUM (commission ₹200-300)
- **Message:** "Is your broker the right fit?"
- **Focus:** Pain points, better features, switching benefits
- **Percentage:** ~35% of traffic

### **Segment 3: Multi-Broker Users**
- **Value:** MEDIUM (commission ₹200-300)
- **Message:** "Simplify your trading life"
- **Focus:** Consolidation, one broker for all needs
- **Percentage:** ~15% of traffic

### **Segment 4: Research Phase (Actively Comparing)**
- **Value:** HIGH (high intent)
- **Message:** "End the research rabbit hole"
- **Focus:** Quick decision, confidence, clarity
- **Percentage:** ~10% of traffic

---

## 🎨 BRAND POSITIONING

### **Core Message:**
**"Discover the broker that perfectly matches YOUR trading style"**

### **Value Propositions:**
1. **Personalization:** Not one-size-fits-all, matched to YOUR needs
2. **Clarity:** End confusion, get clear answer in 60 seconds
3. **Confidence:** Choose with certainty, no second-guessing
4. **Free & Easy:** No cost, no signup, no commitment

### **What We DON'T Say:**
- ❌ "Cheapest broker" (all brokers have similar pricing)
- ❌ "Best broker for everyone" (no universal best)
- ❌ "Save thousands" (unrealistic promises)
- ❌ Negative comparisons ("Broker X is bad")

### **What We DO Say:**
- ✅ "Right fit for YOU"
- ✅ "Matched to YOUR trading style"
- ✅ "End the confusion"
- ✅ "Choose with confidence"

---

## 🔐 COMPLIANCE & PRIVACY

### **Data Handling:**
- ✅ All PII hashed before sending to Facebook (SHA256)
- ✅ No raw phone/email sent to Facebook Pixel
- ✅ Only server-side API sends hashed data
- ✅ Secure database (Supabase with encryption)

### **Regulatory:**
- SEBI doesn't regulate broker comparison tools (we're educational)
- No investment advice given (just matching algorithm)
- Users make final decision on broker site

---

## 📁 TECHNICAL FILES REFERENCE

**Frontend:**
- Quiz component: `src/components/ModularBrokerTool.tsx`
- Facebook Pixel: `src/components/FacebookPixelInit.tsx`
- Pixel helper: `src/lib/facebook-pixel.ts`

**Backend:**
- Submit API: `src/app/api/submit/route.ts`
- CSV Upload: `src/app/api/admin/upload-csv/route.ts`
- Facebook Sync: `src/app/api/admin/sync-facebook/route.ts`
- Conversions API: `src/lib/facebook-conversions-api.ts`

**Database:**
- Main schema: `supabase/migrations/20251002000001_add_conversion_tracking.sql`

---

**This document provides the foundation for understanding our entire system. Use this to inform ad strategy, creative direction, and campaign optimization.**
