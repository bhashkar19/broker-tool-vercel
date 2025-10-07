# 🚀 PRE-LAUNCH TEST CHECKLIST

**Date**: _______________
**Tester**: _______________
**Environment**: Production (https://findbroker.paisowala.com)

---

## ✅ CRITICAL PATH TESTS (MUST PASS)

### 1. Health Check
- [ ] Visit `/api/health` endpoint
- [ ] Verify response status: `200 OK`
- [ ] Check `status: "healthy"`
- [ ] Verify `database: "healthy"`
- [ ] Check response time < 1 second

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-07T...",
  "checks": {
    "database": { "status": "healthy", "latency": 50 },
    "environment": { "status": "healthy" }
  }
}
```

---

### 2. Quiz Flow - New User (Full Journey)

#### Step A: Landing Page
- [ ] Page loads within 3 seconds
- [ ] All broker logos visible
- [ ] "Start Quiz" button works
- [ ] Google Analytics fires `page_view`
- [ ] Facebook Pixel fires `PageView`

#### Step B: Contact Form (First Question)
- [ ] Name field accepts text
- [ ] Mobile field validates format
- [ ] Error shows for invalid mobile (e.g., "1234")
- [ ] Error shows for empty fields
- [ ] Can proceed to next question

**Test with**:
- Valid: `9876543210` ✅
- Invalid: `1234567890` ❌
- Invalid: `+919876543210` (should auto-clean) ✅

#### Step C: Quiz Questions
- [ ] Q1: "Do you have a trading account?" - radio buttons work
- [ ] Q2: Broker selection works (if "Yes" selected)
- [ ] Q3: User type - checkboxes or radio work
- [ ] Q4: Main challenge - radio buttons work
- [ ] Q5: Trading frequency - radio works
- [ ] Q6: What matters most - radio works
- [ ] Progress bar updates correctly
- [ ] Can go "Back" and answers persist

#### Step D: Recommendation Page
- [ ] Broker recommendation appears
- [ ] Recommended broker shows:
  - [ ] Logo
  - [ ] Name
  - [ ] Brokerage details
  - [ ] Features list
  - [ ] "Open Account" CTA button
- [ ] Alternative brokers show (2-3 options)
- [ ] Facebook Pixel fires `Lead` event
- [ ] Google Analytics fires `generate_lead`

#### Step E: CTA Click
- [ ] Click "Open Account" button
- [ ] Button shows loading state
- [ ] Opens broker website in new tab
- [ ] Facebook Pixel fires `InitiateCheckout`
- [ ] Database logs click event

---

### 3. Quiz Flow - Returning User (Retake Prevention)

- [ ] Complete quiz once (use same mobile: `9999988888`)
- [ ] Try to start quiz again with same mobile
- [ ] Should immediately show previous recommendation
- [ ] Should NOT allow re-taking quiz
- [ ] Message shows: "You've already taken this quiz"

---

### 4. Database Verification

#### Via Admin Panel:
- [ ] Visit `/admin`
- [ ] Login with credentials
- [ ] See submitted lead in table
- [ ] Verify all fields captured:
  - [ ] Name
  - [ ] Mobile (10 digits, no +91)
  - [ ] Recommended broker
  - [ ] Session ID
  - [ ] Timestamp
  - [ ] User agent
  - [ ] IP address
  - [ ] UTM parameters (if used)

---

### 5. Error Handling Tests

#### Test A: Database Failure Simulation
⚠️ **Skip this in production - only for staging**

#### Test B: Invalid Inputs
- [ ] Enter mobile: `abc123` → Shows error
- [ ] Enter mobile: `00000` → Shows error
- [ ] Submit with empty name → Shows error
- [ ] Submit with empty mobile → Shows error

#### Test C: Network Failure
- [ ] Disable network mid-quiz
- [ ] Try to submit
- [ ] Should show error message
- [ ] Re-enable network and retry
- [ ] Should succeed

---

### 6. API Endpoints Check

#### `/api/brokers`
- [ ] Returns broker list
- [ ] Status: `200 OK`
- [ ] Contains broker configs

#### `/api/check-completion`
POST with `{ "mobile": "9876543210" }`
- [ ] Returns `completed: false` for new user
- [ ] Returns `completed: true` for returning user

#### `/api/submit`
POST with quiz data
- [ ] Returns `success: true` on success
- [ ] Returns `success: false` with error if DB fails
- [ ] Rate limiting works (try 4 times in 1 min → 429 error)

#### `/api/track`
- [ ] Facebook pixel events track correctly
- [ ] Stores events in database

---

## 📱 MOBILE TESTING

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] All buttons easily tappable
- [ ] Text readable without zoom
- [ ] Forms work correctly
- [ ] No horizontal scrolling

---

## 🔒 SECURITY TESTS

- [ ] Try SQL injection in name field: `' OR 1=1--`
  - Should be sanitized/rejected
- [ ] Try XSS in name field: `<script>alert('xss')</script>`
  - Should be escaped
- [ ] Try accessing `/admin` without auth
  - Should show login prompt
- [ ] Try accessing `/api/admin/*` without auth
  - Should return `401 Unauthorized`

---

## ⚡ PERFORMANCE TESTS

- [ ] Page loads in < 3 seconds
- [ ] Health check responds in < 1 second
- [ ] Quiz submission completes in < 2 seconds
- [ ] No console errors in browser
- [ ] No 404 errors in Network tab
- [ ] All images load properly

---

## 🎯 UTM TRACKING TEST

Test URL: `https://findbroker.paisowala.com?utm_source=test&utm_medium=manual&utm_campaign=prelaunch&fbclid=test123`

- [ ] Complete quiz
- [ ] Check admin panel
- [ ] Verify UTM params captured:
  - [ ] `utm_source: "test"`
  - [ ] `utm_medium: "manual"`
  - [ ] `utm_campaign: "prelaunch"`
  - [ ] `fb_click_id: "test123"`

---

## 🔍 BROWSER TESTING

- [ ] Chrome (Desktop)
- [ ] Safari (Desktop)
- [ ] Firefox (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)

---

## ✅ FINAL CHECKS

- [ ] All above tests passing
- [ ] No console errors
- [ ] No broken images
- [ ] All links work
- [ ] Forms submit correctly
- [ ] Data saves to database
- [ ] Analytics tracking works
- [ ] Health endpoint returns healthy

---

## 🚨 ROLLBACK PLAN

If critical issues found:

1. **Immediate**: Revert deployment in Vercel dashboard
2. **Notify**: Alert team in Slack/WhatsApp
3. **Document**: Log issue in GitHub Issues
4. **Fix**: Address issues in staging
5. **Re-test**: Run this checklist again
6. **Re-deploy**: Only after all tests pass

---

## 📊 TEST RESULTS

**Overall Status**: ⬜ PASS / ⬜ FAIL
**Critical Issues Found**: _____
**Minor Issues Found**: _____
**Ready for Launch**: ⬜ YES / ⬜ NO

**Tester Signature**: _______________
**Date**: _______________

---

## 🎉 LAUNCH APPROVAL

- [ ] All critical tests passed
- [ ] All secrets rotated
- [ ] Health check responding
- [ ] Database backups verified
- [ ] Team notified

**Approved by**: _______________
**Launch time**: _______________
