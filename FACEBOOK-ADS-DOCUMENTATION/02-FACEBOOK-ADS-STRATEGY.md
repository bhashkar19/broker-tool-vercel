# 🎯 FACEBOOK ADS STRATEGY & OPTIMIZATION GUIDE

**Last Updated:** January 7, 2025
**Document Purpose:** Complete Facebook ads strategy, campaign structure, and optimization playbook

---

## 🎨 CAMPAIGN STRATEGY OVERVIEW

### **Primary Objective: CONVERSIONS (Purchase)**

**Why Conversions, Not Leads?**
- We don't care about quiz completions
- We care about actual broker account openings
- Facebook optimizes for users most likely to CONVERT, not just fill forms
- Higher quality traffic, better ROI long-term

**Campaign Goal:**
- Optimize for: **Purchase** event (account opening)
- Backup optimization: **CompleteRegistration** (lead)
- Tracking: Both browser-side Pixel + server-side Conversions API

---

## 📊 CAMPAIGN STRUCTURE

### **Account Setup:**

```
Facebook Ad Account
├─ Pixel ID: 1069181438510520
├─ Conversions API: Enabled (server-side tracking)
├─ Attribution Window: 7-day click, 1-day view (can extend to 28 days)
└─ Currency: INR
```

### **Campaign Hierarchy:**

```
Campaign 1: Broker Discovery - Conversions (Primary)
│
├─ Ad Set 1: New Users - No Demat Account
│   ├─ Audience: Interest-based (stock market, trading, investment)
│   ├─ Age: 25-45
│   ├─ Exclude: People with demat accounts (if possible)
│   ├─ Optimization: Purchase
│   ├─ Budget: ₹500/day
│   └─ Ads:
│       ├─ Ad 1: Confusion-focused creative
│       ├─ Ad 2: Decision confidence creative
│       └─ Ad 3: Perfect fit creative
│
├─ Ad Set 2: Existing Users - Unhappy with Current Broker
│   ├─ Audience: Engaged with stock market content + complained about brokers
│   ├─ Age: 25-45
│   ├─ Optimization: Purchase
│   ├─ Budget: ₹300/day
│   └─ Ads:
│       ├─ Ad 1: "Is your broker the right fit?"
│       ├─ Ad 2: "Still paying high brokerage?"
│       └─ Ad 3: "Find a better match"
│
├─ Ad Set 3: Lookalike - Converters (Once we have 100+ conversions)
│   ├─ Audience: 1% Lookalike of Purchase event completers
│   ├─ Age: 25-45
│   ├─ Optimization: Purchase
│   ├─ Budget: ₹400/day
│   └─ Ads: Best performers from above
│
└─ Ad Set 4: Retargeting - Engaged but Didn't Convert
    ├─ Audience: Visited site, didn't submit contact info
    ├─ Exclusions: Purchasers
    ├─ Optimization: Purchase
    ├─ Budget: ₹200/day
    └─ Ads: Urgency + social proof creatives
```

### **Budget Allocation (Total: ₹1,400/day = ₹42,000/month):**

| Ad Set | Daily Budget | Expected Leads | Expected Conversions | CPA Target |
|--------|--------------|----------------|---------------------|------------|
| New Users | ₹500 | 10-12 | 1-2 | ₹250-350 |
| Existing Users | ₹300 | 6-8 | 0.5-1 | ₹300-400 |
| Lookalike | ₹400 | 8-10 | 1-1.5 | ₹250-350 |
| Retargeting | ₹200 | 4-5 | 0.5-0.8 | ₹200-300 |
| **Total** | **₹1,400** | **28-35** | **3-5** | **₹280-467** |

---

## 🎯 AUDIENCE TARGETING

### **Interest-Based Targeting (Cold Traffic):**

**Financial Interests:**
- Stock market
- Stock trading
- Mutual funds
- Investment
- Personal finance
- Equity trading
- F&O trading
- IPO
- Demat account
- Zerodha (competitor audiences)
- Angel One (competitor audiences)
- Upstox (competitor audiences)

**Behavioral Targeting:**
- Engaged shoppers (financial services)
- Technology early adopters
- Mobile device users (primary)

**Demographic Refinement:**
- Age: 25-45 (core), 18-24 (beginner segment), 45-55 (experienced investors)
- Income: Middle to upper-middle class
- Education: College educated+
- Job titles: IT professionals, business owners, entrepreneurs, finance professionals

### **Custom Audiences (Warm Traffic):**

**Website Visitors:**
- All visitors (last 30 days)
- Quiz completers (didn't submit contact)
- Results viewers (engaged but didn't convert)
- Time on site > 2 minutes

**Engagement:**
- Instagram engaged (last 90 days)
- Facebook page engaged (last 90 days)
- Video viewers (75%+ watched)

**Customer Lists:**
- Database upload: All quiz submissions (for lookalike creation)
- Converters only (for high-value lookalike)

### **Lookalike Audiences (Scale):**

**Once you have 100+ conversions:**
- 1% Lookalike of Purchase completers (highest quality)
- 1% Lookalike of CompleteRegistration (medium quality)
- 2% Lookalike of Purchase completers (scale, lower quality)

**Exclude:**
- Existing converters (no need to retarget)
- Quiz takers from last 7 days (give them time)

---

## 📝 AD CREATIVE STRATEGY

### **Messaging Pillars (Priority Order):**

1. **PERSONALIZATION** (Primary)
   - "Find the broker that fits YOUR trading style"
   - "Not one-size-fits-all, matched to YOU"
   - "Every trader is different"

2. **CLARITY** (Secondary)
   - "End the confusion in 60 seconds"
   - "Stop guessing, start trading with confidence"
   - "Clear answer, not endless comparison"

3. **FREE & EASY** (Supporting)
   - "100% FREE, no signup required"
   - "60 seconds of your time"
   - "Instant results"

### **Ad Formats to Test:**

**Single Image Ads:**
- Confusion → Clarity split-screen
- Perfect fit concept (puzzle pieces)
- Trader with confident smile + phone
- DNA helix made of trading icons

**Carousel Ads:**
- "Why one broker isn't best for everyone" (6 slides)
- "6 questions that change everything" (8 slides)
- "How traders choose vs how they should" (7 slides)

**Video Ads (30-60 seconds):**
- The Problem (30s): Showing overwhelm → solution
- Testimonial (30s): Real user story
- How It Works (20s): Quick explainer with text overlays

**Collection Ads:**
- Hero video + product grid of different brokers
- "See which one fits YOU" CTA

### **Creative Testing Matrix:**

| Variable | Option A | Option B | Option C |
|----------|----------|----------|----------|
| **Hook** | "Confused which broker?" | "Stop second-guessing" | "50 brokers. 1 perfect match." |
| **Pain Point** | Confusion/overwhelm | Wrong fit/frustration | Analysis paralysis |
| **Solution** | Personalized match | Confidence in choice | Quick clarity |
| **CTA** | "Find My Match" | "Get My Match" | "Discover My Broker" |
| **Visual** | Confused person | Confident person | Split before/after |

**Test Plan:**
- Week 1: Test 3 hooks (same visual)
- Week 2: Test 3 visuals (winning hook)
- Week 3: Test 3 CTAs (winning combo)
- Week 4: Scale winners, test new angles

---

## 📊 CONVERSION EVENTS & TRACKING

### **Facebook Pixel Events (Browser-Side):**

| Event | When It Fires | Purpose |
|-------|---------------|---------|
| **PageView** | User lands on site | Standard tracking |
| **Lead** | Quiz completed | Engagement tracking |
| **ViewContent** | Results page viewed | Intent signal |
| **InitiateCheckout** | Contact info submitted | Strong intent, backup conversion |

### **Conversions API Events (Server-Side):**

| Event | When It Fires | Value | Priority |
|-------|---------------|-------|----------|
| **CompleteRegistration** | User started signup at broker (lead) | ₹145-165 | Medium |
| **Purchase** | User fully opened account | ₹300-350 | HIGH |

**Why Both?**
- Browser Pixel: Real-time tracking, immediate optimization
- Conversions API: Bypasses ad blockers, more accurate, includes PII matching
- Together: ~30% more accurate attribution

### **Event Values (For Optimization):**

**Purchase Event Values:**
- New user conversion: ₹350
- Existing user conversion: ₹300
- Premium broker (ICICI): ₹450
- Standard broker (Groww): ₹250

**Why Value Matters:**
- Facebook optimizes for highest value conversions
- Prioritizes new users over existing users automatically
- Better ROAS (Return on Ad Spend)

---

## 🎯 CAMPAIGN OPTIMIZATION PLAYBOOK

### **Phase 1: Launch (Week 1-2) - Learning Phase**

**Goal:** Gather data, find winning combinations

**Daily Tasks:**
- Check: Spend, impressions, link clicks
- Monitor: Cost per lead (target: ₹30-50)
- Don't optimize yet! Let Facebook learn

**Success Metrics:**
- 50+ ad set events (Purchase or InitiateCheckout)
- Cost per result under ₹400
- Click-through rate (CTR) > 1%

**If struggling:**
- Increase budget slightly (helps exit learning phase faster)
- Broaden audience if too narrow
- Test different creatives

### **Phase 2: Optimization (Week 3-4)**

**Goal:** Double down on winners, kill losers

**Weekly Tasks:**
- Pause ads with CPA > ₹500
- Increase budget on ads with CPA < ₹300 by 20%
- Create variations of winning ads
- Test new audiences based on learnings

**Metrics to Watch:**
- Frequency (if > 3, audience fatigue - refresh creative)
- Relevance score (aim for 7+)
- Landing page conversion rate (should stay consistent)

**If conversions drop:**
- Check: CSV upload lag (are you syncing conversions to FB?)
- Verify: Tracking still working (test in Events Manager)
- Consider: Ad fatigue (refresh creative)

### **Phase 3: Scale (Month 2+)**

**Goal:** Profitably increase spend

**How to Scale:**
- Increase winning ad set budgets by 20% every 3 days
- Launch lookalike audiences (1% converters)
- Expand to Instagram placement
- Test new creative angles (keep refresh cycle)

**Scaling Guidelines:**
- Don't increase budget >50% in one day (resets learning)
- Duplicate winning ad sets (CBO vs manual bidding)
- Expand audience incrementally (1% → 2% lookalike)

**Warning Signs:**
- CPA increasing >30% week-over-week
- Conversion rate dropping (check landing page!)
- Frequency >4 (audience exhaustion)

### **Phase 4: Evergreen (Month 3+)**

**Goal:** Maintain consistent performance

**Monthly Checklist:**
- Refresh creative (new images/videos every month)
- Analyze broker performance (which broker converts best?)
- Seasonal adjustments (tax season, budget announcements)
- Competitor monitoring (new broker campaigns?)

---

## 📊 KEY METRICS & BENCHMARKS

### **Top-of-Funnel (Ad Performance):**

| Metric | Benchmark | Excellent | Poor |
|--------|-----------|-----------|------|
| CPM (Cost per 1000 impressions) | ₹100-150 | <₹80 | >₹200 |
| CTR (Click-through rate) | 1.5-2% | >2.5% | <1% |
| CPC (Cost per click) | ₹5-10 | <₹5 | >₹15 |
| Landing page view rate | 75-85% | >85% | <70% |

### **Middle-of-Funnel (Engagement):**

| Metric | Benchmark | Excellent | Poor |
|--------|-----------|-----------|------|
| Cost per Lead (InitiateCheckout) | ₹30-50 | <₹30 | >₹70 |
| Quiz completion rate | 30-40% | >40% | <25% |
| Contact submission rate | 60-70% | >70% | <50% |

### **Bottom-of-Funnel (Conversions):**

| Metric | Benchmark | Excellent | Poor |
|--------|-----------|-----------|------|
| CPA (Cost per acquisition) | ₹250-400 | <₹250 | >₹500 |
| Conversion rate (contact → account) | 8-12% | >12% | <6% |
| ROAS (Return on ad spend) | 0.8-1.2 | >1.2 | <0.6 |

### **Time-to-Conversion:**

| Timeline | Percentage | Insight |
|----------|------------|---------|
| 0-3 days | 40% | High intent, quick decision makers |
| 4-7 days | 30% | Comparison shoppers, normal timeline |
| 8-14 days | 20% | Slow decision, may need remarketing |
| 15-30 days | 10% | Long consideration, lower attribution |

**Takeaway:** Most conversions happen within 7 days. Focus on 7-day click attribution window.

---

## 🔧 TRACKING & ATTRIBUTION SETUP

### **What's Currently Set Up:**

✅ Facebook Pixel installed on site (ID: 1069181438510520)
✅ Conversions API configured (server-side)
✅ fbclid capture & storage in database
✅ CSV upload & name matching system
✅ Manual Facebook sync button in admin dashboard
✅ Event deduplication (prevents double-counting)

### **Critical for Success:**

**1. Weekly CSV Upload Cadence:**
- Upload broker CSVs at least weekly
- Faster upload = better Facebook optimization
- Target: 3-5 day lag from conversion to upload

**2. Facebook Sync Frequency:**
- Click "Sync to Facebook" after every CSV upload
- Or set up automated sync (cron job every 6 hours)

**3. Event Verification:**
- Check Facebook Events Manager daily
- Look for: Purchase events appearing
- Verify: Event time matches broker's conversion date

**4. Attribution Window:**
- Current: 7-day click, 1-day view
- Consider: Extend to 28-day click if conversion lag is long
- Trade-off: Longer window = less accurate, but captures more conversions

---

## 🚨 COMMON ISSUES & SOLUTIONS

### **Issue 1: Low Conversion Rate**

**Symptoms:**
- Lots of quiz completions, few account openings
- CPA >₹500

**Diagnoses:**
- Wrong audience (not high-intent users)
- Poor broker recommendations (algorithm mismatch)
- Long CSV lag (Facebook can't optimize)

**Solutions:**
- Narrow audience to high-intent (exclude casual browsers)
- A/B test landing page copy
- Speed up CSV upload cadence
- Focus budget on best-converting broker recommendations

### **Issue 2: Facebook Not Seeing Conversions**

**Symptoms:**
- You have conversions in database, but Facebook shows 0
- Can't optimize for Purchase event

**Diagnoses:**
- Forgot to sync to Facebook
- fbclid not captured (direct traffic)
- Conversions API access token expired

**Solutions:**
- Click "Sync to Facebook" button
- Verify fbclid capture rate in database (should be >70%)
- Check access token validity in Events Manager
- Review Conversions API logs for errors

### **Issue 3: High Cost Per Lead, But Low CPA**

**Symptoms:**
- Spending ₹70 per contact submission
- But CPA is ₹280 (good!)

**This is GREAT!** It means:
- You're getting high-quality leads (not quantity)
- Conversion rate is excellent (>10%)
- Facebook is optimizing correctly for Purchase event

**Action:**
- Don't panic about high CPL
- Focus on final CPA
- Scale this winning formula

### **Issue 4: Conversions Dropping After 2 Weeks**

**Symptoms:**
- Week 1-2: 5 conversions/day
- Week 3-4: 2 conversions/day

**Diagnoses:**
- Ad fatigue (audience seen ad too many times)
- Frequency >3
- Audience saturation

**Solutions:**
- Refresh creative (new images, new hooks)
- Expand audience (lookalike, broader interests)
- Pause fatigued ads, launch fresh ones
- Increase budget to reach new people

---

## 🎯 OPTIMIZATION PRIORITY CHECKLIST

**Weekly (Every Monday):**
- [ ] Upload latest broker CSVs
- [ ] Sync conversions to Facebook
- [ ] Review: CPA, conversion rate, ROAS
- [ ] Pause: Ads with CPA >₹500
- [ ] Increase budget: Ads with CPA <₹300 (by 20%)
- [ ] Check frequency: Refresh if >3

**Monthly (1st of Month):**
- [ ] Analyze: Best performing brokers
- [ ] Refresh: All ad creatives (new images/videos)
- [ ] Test: New audience segments
- [ ] Review: Attribution window (adjust if needed)
- [ ] Update: Conversion values based on actual commissions

**Quarterly:**
- [ ] Deep dive: User journey analytics
- [ ] Experiment: New campaign structures
- [ ] Competitor analysis: What are others doing?
- [ ] Seasonal planning: Upcoming events (budget, tax season)

---

## 💡 PRO TIPS FOR SUCCESS

**1. Focus on New Users:**
- They convert at higher rates
- Higher commission value
- Easier messaging (no switching friction)
- Create dedicated ad sets for beginners

**2. Don't Compete on Price:**
- All brokers have similar pricing
- Focus on "right fit" not "cheapest"
- Avoid "lowest brokerage" messaging

**3. Use Social Proof:**
- "15,000+ traders found their match"
- Real testimonials (with permission)
- Trust indicators on landing page

**4. Speed Matters:**
- Faster CSV upload = better optimization
- Quick sync to Facebook = more data for AI
- Aim for 3-5 day lag max

**5. Test Aggressively:**
- New hooks every week
- New visuals every 2 weeks
- New audiences monthly
- Never stop testing

**6. Watch Broker Performance:**
- Some brokers convert better than others
- Zerodha/Angel One likely highest volume
- ICICI Direct highest commission
- Adjust quiz algorithm if needed

---

## 📈 SUCCESS ROADMAP

**Month 1: Foundation**
- Budget: ₹30,000-40,000
- Goal: 50-80 conversions
- Focus: Learning, finding winning ads
- CPA Target: ₹400-500

**Month 2: Optimization**
- Budget: ₹50,000-70,000
- Goal: 120-150 conversions
- Focus: Scale winners, kill losers
- CPA Target: ₹300-400

**Month 3: Scale**
- Budget: ₹80,000-100,000
- Goal: 200-250 conversions
- Focus: Lookalikes, new segments
- CPA Target: ₹280-350

**Month 4+: Profitability**
- Budget: ₹100,000+
- Goal: 300+ conversions/month
- Focus: ROAS >1, sustainable growth
- CPA Target: ₹250-300

---

**This strategy will guide your Facebook ads from launch to scale. Focus on conversions, not vanity metrics. Quality over quantity.**
