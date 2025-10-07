# 📚 FACEBOOK ADS DOCUMENTATION - COMPLETE PACKAGE

**Last Updated:** January 7, 2025
**Purpose:** Comprehensive documentation for Facebook ads campaign creation, optimization, and management

---

## 📖 DOCUMENT OVERVIEW

This folder contains **everything** needed to understand and execute Facebook ads for the Broker Discovery Tool.

### **Who Should Read This:**
- Marketing agencies creating Facebook ads
- AI systems generating ad creatives
- Campaign managers optimizing performance
- Technical teams implementing tracking
- Business stakeholders understanding ROI

---

## 📂 DOCUMENTS IN THIS PACKAGE

### **01-SYSTEM-OVERVIEW.md**
**📊 MUST READ FIRST!**

**What It Covers:**
- What the product is (broker discovery tool)
- How we make money (affiliate commissions)
- System architecture (frontend + backend)
- Complete conversion tracking flow (Day 1 to Day 30)
- User journey from ad click to account opening
- Technical files reference

**Read This If You Want To:**
- Understand the business model
- See the full user journey
- Learn how conversions are tracked
- Get technical architecture overview

**Time to Read:** 20-30 minutes

---

### **02-FACEBOOK-ADS-STRATEGY.md**
**🎯 Campaign Planning & Optimization**

**What It Covers:**
- Campaign structure (ad sets, budgets, targeting)
- Audience segmentation (new users, existing users, lookalikes)
- Budget allocation (₹1,400/day = ₹42K/month recommended)
- Creative testing strategy
- Conversion events (Purchase, CompleteRegistration)
- Optimization playbook (launch → scale)
- Key metrics & benchmarks
- Common issues & solutions

**Read This If You Want To:**
- Set up Facebook campaigns
- Know how to structure ad sets
- Understand budget allocation
- Learn optimization tactics

**Time to Read:** 30-40 minutes

---

### **03-CONVERSION-TRACKING-TECHNICAL.md**
**🔄 Technical Deep Dive**

**What It Covers:**
- Detailed event-by-event tracking flow
- Code-level implementation (with file references)
- Database schema & updates
- CSV upload & name matching algorithm
- Facebook Conversions API payload structure
- Attribution logic (how Facebook matches clicks → conversions)
- Monitoring queries & debugging
- Common tracking issues & fixes

**Read This If You Want To:**
- Understand technical implementation
- Troubleshoot tracking issues
- Verify events are firing correctly
- Integrate with the system

**Time to Read:** 45-60 minutes (technical)

---

### **04-AI-CREATIVE-BRIEFING.md**
**🎨 Ad Creation Guide**

**What It Covers:**
- Brand voice & messaging pillars
- Target audience segments (with demographics & psychographics)
- Approved creative concepts (with visuals & copy)
- Ad copy templates (ready to use)
- Video ad scripts (storyboards)
- Design guidelines (colors, fonts, imagery)
- Creative specifications (dimensions, file sizes)
- Testing matrix & success criteria

**Read This If You Want To:**
- Create ad creatives (images, videos, copy)
- Understand messaging strategy
- Know what works (and what doesn't)
- Design ads that convert

**Time to Read:** 30-40 minutes

---

### **05-MARKETING-MESSAGING-REFERENCE.md**
**💡 Messaging & Positioning**

**What It Covers:**
- Core message shift (from "cheapest" to "personalized match")
- Value propositions
- Revised ad copy examples
- Visual concepts
- Video scripts
- Key messaging pillars (personalization, clarity, free & easy)
- What NOT to say (avoid price claims, "best" claims)
- Audience segmentation
- Carousel concepts
- Midjourney prompts for image generation

**Read This If You Want To:**
- Understand positioning strategy
- See example ad copy
- Get visual concept ideas
- Learn brand messaging

**Time to Read:** 25-35 minutes

---

### **06-CONVERSION-TRACKING-AUDIT.md**
**✅ System Status & Verification**

**What It Covers:**
- Complete system audit (all components verified)
- Test results (conversion API successfully tested)
- Step-by-step workflow (how to use the system)
- Database schema details
- CSV upload process
- Facebook sync process
- Compliance & privacy notes
- Troubleshooting guide

**Read This If You Want To:**
- Verify system is working
- Understand daily operations
- Learn CSV upload workflow
- Check system status

**Time to Read:** 20-25 minutes

---

## 🚀 QUICK START GUIDE

### **If You're Creating Facebook Ads:**

**Step 1:** Read [01-SYSTEM-OVERVIEW.md](01-SYSTEM-OVERVIEW.md) (20 min)
- Understand what we do, how we make money

**Step 2:** Read [04-AI-CREATIVE-BRIEFING.md](04-AI-CREATIVE-BRIEFING.md) (30 min)
- Get messaging, visuals, copy templates

**Step 3:** Skim [05-MARKETING-MESSAGING-REFERENCE.md](05-MARKETING-MESSAGING-REFERENCE.md) (15 min)
- See example ads, copy variations

**Step 4:** Create ads using templates & guidelines

**Total Time:** ~65 minutes + creation time

---

### **If You're Setting Up Campaigns:**

**Step 1:** Read [01-SYSTEM-OVERVIEW.md](01-SYSTEM-OVERVIEW.md) (20 min)
- Understand business model & user journey

**Step 2:** Read [02-FACEBOOK-ADS-STRATEGY.md](02-FACEBOOK-ADS-STRATEGY.md) (40 min)
- Campaign structure, budgets, targeting

**Step 3:** Skim [04-AI-CREATIVE-BRIEFING.md](04-AI-CREATIVE-BRIEFING.md) (15 min)
- Know what creatives will look like

**Step 4:** Set up campaigns in Ads Manager

**Total Time:** ~75 minutes + setup time

---

### **If You're Troubleshooting Tracking:**

**Step 1:** Read [06-CONVERSION-TRACKING-AUDIT.md](06-CONVERSION-TRACKING-AUDIT.md) (20 min)
- See current system status

**Step 2:** Read [03-CONVERSION-TRACKING-TECHNICAL.md](03-CONVERSION-TRACKING-TECHNICAL.md) (60 min)
- Deep dive into technical implementation

**Step 3:** Run diagnostic queries from Technical doc

**Step 4:** Check Facebook Events Manager for verification

**Total Time:** ~80 minutes + debugging time

---

### **If You're an AI System Creating Ads:**

**Step 1:** Read [04-AI-CREATIVE-BRIEFING.md](04-AI-CREATIVE-BRIEFING.md) (full)
- Complete creative brief with all guidelines

**Step 2:** Skim [01-SYSTEM-OVERVIEW.md](01-SYSTEM-OVERVIEW.md) (focus on "What We Do" section)
- Context on product & business

**Step 3:** Use templates & guidelines to generate:
- Ad copy (headlines, primary text, CTAs)
- Visual concepts (describe images/videos)
- Targeting recommendations

**Total Time:** ~45 minutes + generation time

---

## 🎯 KEY TAKEAWAYS (TL;DR)

### **Business Model:**
- FREE broker discovery tool (quiz-based matching)
- Revenue: Affiliate commissions (₹300-400 per conversion)
- Target: New traders (higher value) + existing traders (switchers)

### **Messaging Strategy:**
- **Focus:** Personalized matching (not "cheapest" or "best")
- **Avoid:** Price claims, universal "best" claims, broker bashing
- **Emphasize:** Right fit for YOU, clarity, confidence, free & easy

### **Campaign Structure:**
- **Objective:** Conversions (Purchase event = account opening)
- **Budget:** ₹1,400/day = ₹42K/month recommended
- **Target CPA:** ₹250-400 per conversion
- **Key Metric:** ROAS (target 0.8-1.2, aim for >1.2)

### **Conversion Tracking:**
- **Dual system:** Facebook Pixel (browser) + Conversions API (server)
- **Critical:** fbclid capture (for attribution)
- **Process:** CSV upload → Name matching → Sync to Facebook
- **Timeline:** Works even if CSV uploaded 5-30 days later (uses broker's date)

### **Target Audiences:**
1. **New users** (no demat account) - HIGH PRIORITY
2. **Existing users** (unhappy with current broker) - MEDIUM PRIORITY
3. **Research phase** (actively comparing) - HIGH-CONVERTING

### **Creative Guidelines:**
- **Colors:** Blue (trust), Green (growth), Orange (CTA)
- **Tone:** Helpful, honest, smart, empathetic, confident, friendly
- **Visuals:** Real people, mobile-first, Indian context, confident expressions
- **Format:** 80% mobile traffic - design for small screens!

---

## 📊 SUCCESS METRICS

### **Campaign Performance Benchmarks:**

| Metric | Target | Excellent |
|--------|--------|-----------|
| CTR (Click-Through Rate) | 1.5-2% | >2.5% |
| Cost Per Lead | ₹30-50 | <₹30 |
| CPA (Cost Per Acquisition) | ₹250-400 | <₹250 |
| Conversion Rate (Contact → Account) | 8-12% | >12% |
| ROAS (Return on Ad Spend) | 0.8-1.2 | >1.2 |

### **Tracking Health:**

| Metric | Target | Status |
|--------|--------|--------|
| fbclid Capture Rate | >70% | Check daily |
| CSV Upload Frequency | Weekly | Faster = better |
| Pending Syncs | <50 | Sync regularly |
| Sync Success Rate | >95% | Monitor failures |

---

## ✅ DAILY/WEEKLY CHECKLIST

### **Daily (Campaign Manager):**
- [ ] Check: Spend, impressions, link clicks
- [ ] Monitor: Cost per lead (target ₹30-50)
- [ ] Review: Any ad with CPA >₹500 (consider pausing)
- [ ] Upload: Latest broker CSVs (if received)
- [ ] Sync: Conversions to Facebook (after CSV upload)

### **Weekly (Every Monday):**
- [ ] Review: CPA, conversion rate, ROAS
- [ ] Pause: Ads with CPA >₹500 (3+ days)
- [ ] Increase budget: Ads with CPA <₹300 (by 20%)
- [ ] Check frequency: Refresh creative if >3
- [ ] Test: Launch new creative variations

### **Monthly (1st of Month):**
- [ ] Analyze: Best performing brokers
- [ ] Refresh: All ad creatives (new images/videos)
- [ ] Test: New audience segments
- [ ] Review: Attribution window (extend if needed)
- [ ] Update: Conversion values (if commissions change)

---

## 🔗 EXTERNAL RESOURCES

### **Facebook Tools:**
- **Events Manager:** https://www.facebook.com/events_manager2/list/pixel/1069181438510520
- **Test Events:** https://www.facebook.com/events_manager2/list/pixel/1069181438510520/test_events
- **Ads Manager:** https://www.facebook.com/adsmanager
- **Business Settings:** https://business.facebook.com/settings

### **Your System:**
- **Website:** https://findbroker.paisowala.com
- **Admin Dashboard:** /admin
- **CSV Upload:** /admin → Upload CSV tab
- **Facebook Sync:** /admin → Analytics → "Sync to Facebook" button

### **Tracking:**
- **Pixel ID:** 1069181438510520
- **Conversions API:** Enabled (server-side)
- **Database:** Supabase (PostgreSQL)

---

## 💡 PRO TIPS

### **1. Focus on Conversions, Not Clicks**
- Optimize for Purchase event (account opening)
- Don't get distracted by high CTR if CPA is bad
- Quality leads > quantity of clicks

### **2. Upload CSVs Quickly**
- Faster upload = better Facebook optimization
- Target: 3-5 day lag from conversion to upload
- Set reminders to check for broker CSVs

### **3. Test Aggressively**
- New hooks every week
- New visuals every 2 weeks
- New audiences monthly
- Never stop testing!

### **4. Watch Broker Performance**
- Some brokers convert better than others
- Zerodha/Angel One = highest volume
- ICICI Direct = highest commission
- Adjust strategy based on data

### **5. Mobile-First Everything**
- 80% of traffic is mobile
- Design for small screens
- Test on actual phones
- Videos must work without sound

---

## 🆘 NEED HELP?

### **For Campaign Issues:**
- Reference: [02-FACEBOOK-ADS-STRATEGY.md](02-FACEBOOK-ADS-STRATEGY.md) → "Common Issues & Solutions" section

### **For Tracking Issues:**
- Reference: [03-CONVERSION-TRACKING-TECHNICAL.md](03-CONVERSION-TRACKING-TECHNICAL.md) → "Common Tracking Issues" section
- Check: Facebook Events Manager Test Events
- Verify: Database queries (fbclid capture rate, pending syncs)

### **For Creative Direction:**
- Reference: [04-AI-CREATIVE-BRIEFING.md](04-AI-CREATIVE-BRIEFING.md) → "Messaging Red Flags" section
- Review: [05-MARKETING-MESSAGING-REFERENCE.md](05-MARKETING-MESSAGING-REFERENCE.md) → Example ads

### **For System Verification:**
- Reference: [06-CONVERSION-TRACKING-AUDIT.md](06-CONVERSION-TRACKING-AUDIT.md) → "System Status" section
- Check: Admin dashboard analytics

---

## 📧 DOCUMENT UPDATES

**Version History:**
- **v1.0** (Jan 7, 2025): Initial comprehensive documentation package created

**How to Update:**
- These documents should be updated when:
  - Campaign strategy changes
  - New creative concepts tested
  - Conversion tracking modified
  - Commission rates change
  - New brokers added

---

## 🎉 FINAL NOTE

**This documentation package contains everything needed to:**
- ✅ Understand the business & technical architecture
- ✅ Create high-performing Facebook ads
- ✅ Set up & optimize campaigns
- ✅ Track conversions accurately
- ✅ Troubleshoot issues
- ✅ Scale profitably

**Start with the Quick Start Guide above based on your role, then dive into specific documents as needed.**

**Good luck with your Facebook ads campaign! 🚀**

---

**Questions? Check the relevant document section first. Most answers are already here!**
