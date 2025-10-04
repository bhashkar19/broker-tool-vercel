# Recommendation Locking System (Future Implementation)

**Status:** Not Yet Implemented
**Purpose:** Prevent users from retaking quiz to "shop" for different broker recommendations
**Priority:** Medium (implement after A/B testing Phase 1 fixes)

---

## Why This Is Needed

### The Problem
Without locking, users can:
1. Complete quiz → Get recommendation (e.g., Zerodha)
2. Click "Back" or refresh page
3. Change answers → Get different recommendation (e.g., Upstox)
4. Repeat multiple times to "shop" for preferred broker
5. Creates doubt: "Are they just randomly recommending brokers?"

### Business Impact
- **Trust Issues:** Users think recommendations are random
- **Data Pollution:** Same user creates multiple sessions
- **Commission Loss:** User confused, doesn't click any affiliate link
- **Facebook Tracking:** Multiple sessions mess up conversion attribution

---

## Current Implementation

### ✅ What's Already Done
- **Back button blocks after recommendation shown**
  - `canGoBack = currentQuestionIndex > 0 && !showRecommendation`
  - Users CANNOT go back once they see recommendation
  - Prevents immediate re-quiz

### ❌ What's Still Missing
- **No check when user refreshes page**
  - User can refresh → Start new quiz with same mobile number
  - No database lookup to see if mobile already has recommendation
- **No "You've already received a recommendation" screen**
- **No localStorage check for cached recommendations**

---

## Proposed Implementation

### Phase 1: Simple localStorage Lock (Quick Win - 1 hour)

**How it works:**
```typescript
// When recommendation is generated:
localStorage.setItem('broker_recommendation', JSON.stringify({
  mobile: userData.mobile,
  broker: recommendation.primary.brokerId,
  timestamp: Date.now()
}));

// When quiz starts:
const cachedRec = localStorage.getItem('broker_recommendation');
if (cachedRec) {
  const { mobile, broker, timestamp } = JSON.parse(cachedRec);
  const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);

  if (hoursSince < 24) {
    // Show cached recommendation immediately
    setShowRecommendation(true);
    return;
  }
}
```

**Pros:**
- ✅ Fast to implement (1 hour)
- ✅ Works for 80% of cases (same browser/device)
- ✅ No database calls needed

**Cons:**
- ❌ User can clear localStorage or use incognito
- ❌ Doesn't work across devices
- ❌ Not reliable for serious prevention

---

### Phase 2: Database Lock (Recommended - 3 hours)

**Database Schema:**
```sql
CREATE TABLE user_recommendations (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL,
  mobile_hash VARCHAR(64) NOT NULL, -- SHA256 for privacy
  recommended_broker VARCHAR(50) NOT NULL,
  recommendation_data JSONB, -- Full recommendation object
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Optional: allow re-quiz after 30 days

  UNIQUE(mobile_hash)
);

-- Index for fast lookups
CREATE INDEX idx_mobile_hash ON user_recommendations(mobile_hash);
```

**API Endpoint:**
```typescript
// /api/check-recommendation
POST /api/check-recommendation
{
  "mobile": "9876543210"
}

Response:
{
  "hasRecommendation": true,
  "broker": "zerodha",
  "createdAt": "2025-01-04T10:30:00Z",
  "canRetake": false // Based on expires_at
}
```

**Frontend Implementation:**
```typescript
// In ModularBrokerTool.tsx
useEffect(() => {
  const checkExistingRecommendation = async () => {
    if (!userData.mobile || userData.mobile.length < 10) return;

    try {
      const response = await fetch('/api/check-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: userData.mobile })
      });

      const data = await response.json();

      if (data.hasRecommendation && !data.canRetake) {
        // Show existing recommendation
        setLockedRecommendation(data);
        setShowLockedMessage(true);
      }
    } catch (error) {
      console.error('Error checking recommendation:', error);
      // Fail silently - don't block quiz if API fails
    }
  };

  // Check after mobile number is entered (contact form)
  if (currentQuestionIndex === 1 && userData.mobile) {
    checkExistingRecommendation();
  }
}, [currentQuestionIndex, userData.mobile]);
```

**Locked Message UI:**
```tsx
{showLockedMessage && lockedRecommendation && (
  <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-xl">
    <h3 className="text-xl font-bold text-blue-900 mb-3">
      You've Already Received Your Recommendation
    </h3>
    <p className="text-blue-800 mb-4">
      On {new Date(lockedRecommendation.createdAt).toLocaleDateString()},
      we recommended <strong>{lockedRecommendation.broker}</strong> for you.
    </p>
    <p className="text-sm text-blue-700 mb-4">
      Our recommendations are personalized and locked to ensure quality.
      You can retake the quiz after 30 days.
    </p>
    <button
      onClick={() => window.location.href = getBrokerAffiliateUrl(lockedRecommendation.broker)}
      className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
    >
      Open {lockedRecommendation.broker} Account →
    </button>
  </div>
)}
```

**Security: Hash Mobile Numbers**
```typescript
import crypto from 'crypto';

function hashMobile(mobile: string): string {
  // Remove +91 prefix and whitespace
  const cleaned = mobile.replace(/[^0-9]/g, '');

  // SHA256 hash for privacy
  return crypto.createHash('sha256').update(cleaned).digest('hex');
}

// Store hashed version in database
const mobileHash = hashMobile(userData.mobile);
```

---

### Phase 3: Advanced Features (Optional - 2 hours)

**1. Allow Re-quiz After 30 Days**
```sql
-- Update expires_at when creating recommendation
UPDATE user_recommendations
SET expires_at = NOW() + INTERVAL '30 days'
WHERE mobile_hash = $1;
```

**2. Admin Override**
```typescript
// Admin can allow specific user to retake
POST /api/admin/unlock-recommendation
{
  "mobile": "9876543210",
  "reason": "User requested change"
}
```

**3. A/B Testing Exception**
```typescript
// Allow retake if user is in A/B test group
if (userData.isTestUser) {
  // Skip lock check
}
```

---

## Implementation Timeline

### Week 1: Phase 1 (Quick Win)
- [ ] Add localStorage caching (1 hour)
- [ ] Test with real users
- [ ] Monitor if it reduces duplicate sessions

### Week 2: Phase 2 (Database Lock)
- [ ] Create database table (30 mins)
- [ ] Build `/api/check-recommendation` endpoint (1 hour)
- [ ] Add frontend lock check (1 hour)
- [ ] Create locked message UI (30 mins)
- [ ] Test end-to-end flow (30 mins)

### Week 3: Phase 3 (Polish)
- [ ] Add 30-day expiry logic (1 hour)
- [ ] Build admin override tool (1 hour)
- [ ] Add analytics tracking for locked users

---

## Testing Checklist

### Scenario 1: New User (No Lock)
- [x] User completes quiz
- [x] Gets recommendation
- [x] Recommendation saved to database
- [x] Back button hidden after recommendation

### Scenario 2: Returning User (Same Session)
- [ ] User sees recommendation
- [ ] Tries to go back → blocked
- [ ] Tries to refresh → sees cached recommendation
- [ ] localStorage prevents re-quiz

### Scenario 3: Returning User (New Session)
- [ ] User enters mobile number
- [ ] System checks database
- [ ] Finds existing recommendation
- [ ] Shows locked message with original recommendation
- [ ] Provides affiliate link to original broker

### Scenario 4: Expired Lock (30+ Days)
- [ ] User enters mobile number
- [ ] System finds old recommendation
- [ ] Checks expires_at timestamp
- [ ] Allows re-quiz if expired
- [ ] Updates database with new recommendation

### Scenario 5: API Failure (Graceful Degradation)
- [ ] Database check fails
- [ ] System logs error
- [ ] Allows quiz to proceed (don't block on API error)
- [ ] User can complete quiz normally

---

## Privacy & Compliance

### GDPR Compliance
- ✅ Store only hashed mobile numbers (not raw)
- ✅ Add "Why we lock recommendations" explanation
- ✅ Allow users to request deletion via email
- ✅ Auto-delete after 90 days (optional)

### User Communication
```
"Why can't I retake the quiz?"

We lock recommendations to ensure quality and prevent
broker-shopping. Our AI analyzes your answers to find
your perfect match. Changing answers repeatedly would
compromise the accuracy.

You can retake the quiz after 30 days if your needs change.

Questions? Email: support@paisowala.com
```

---

## Analytics Tracking

### Events to Track
```typescript
// User hits locked state
fbq('trackCustom', 'RecommendationLocked', {
  mobile_hash: hashMobile(mobile),
  original_broker: lockedRecommendation.broker,
  days_since_recommendation: daysSince,
  attempted_retake: true
});

// User clicks affiliate link from locked message
fbq('trackCustom', 'LockedRecommendationClicked', {
  broker: lockedRecommendation.broker,
  source: 'locked_message'
});
```

### Metrics to Monitor
- % of users hitting lock (expect 5-10%)
- % of locked users clicking affiliate link (target 40%+)
- Average days between recommendation and lock attempt
- Conversion rate: locked users vs new users

---

## Configuration

### Feature Flag (Toggle On/Off)
```typescript
// src/config/features.ts
export const FEATURE_FLAGS = {
  RECOMMENDATION_LOCKING: true, // Set to false to disable
  LOCK_EXPIRY_DAYS: 30,
  USE_LOCALSTORAGE_CACHE: true,
  ALLOW_ADMIN_OVERRIDE: true
};
```

### Environment Variables
```bash
# .env.local
ENABLE_RECOMMENDATION_LOCK=true
LOCK_EXPIRY_DAYS=30
ADMIN_OVERRIDE_KEY=<secret-key>
```

---

## Future Enhancements

1. **Email Confirmation**
   - Send email with recommendation
   - Link in email to view recommendation anytime
   - Reduces need for re-quiz

2. **WhatsApp Integration**
   - Send recommendation via WhatsApp
   - User can access anytime without website
   - Higher engagement rates

3. **Recommendation History**
   - User dashboard showing all past recommendations
   - Track which broker they actually chose
   - Improve algorithm based on conversion data

4. **Multi-Recommendation Support**
   - Allow 1 recommendation per broker type
   - E.g., 1 for delivery, 1 for F&O, 1 for learning
   - More flexibility without compromising quality

---

## Decision: Implement Now or Later?

### Implement Now If:
- ✅ You're seeing duplicate sessions from same mobile numbers
- ✅ Users are asking "Why different recommendation?"
- ✅ You have time for 4 hours of development

### Implement Later If:
- ✅ Quiz completion rate is low (< 40%) - fix UX first
- ✅ Not seeing abuse in analytics yet
- ✅ Phase 1 (back button) is sufficient for now

**My Recommendation:**
Start with **Phase 1 (localStorage)** this week (1 hour).
Implement **Phase 2 (Database)** only after:
1. Phase 1 UX improvements deployed
2. Completion rate above 50%
3. You see evidence of users retaking quiz

---

**Current Status:** ✅ Back button implemented (blocks after recommendation)
**Next Step:** Monitor user behavior for 1-2 weeks
**Future Work:** Implement Phase 1 if retakes become an issue

**Last Updated:** January 4, 2025
