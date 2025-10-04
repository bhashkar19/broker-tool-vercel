# Priority Broker Configuration Guide

## Quick Change Instructions

When commission agreements change, you can easily switch the recommended broker for first-time users (no demat account).

### How to Change Priority Broker (Takes 30 seconds)

**Step 1:** Open `/src/config/priorityBroker.ts`

**Step 2:** Change the `brokerId` value:

```typescript
export const PRIORITY_BROKER_CONFIG = {
  brokerId: 'zerodha',  // ← Change this to: 'upstox', 'angel_one', 'fyers', or '5paisa'
  reason: 'Highest commission partner as of Jan 2025',
  forceForNewUsers: true,
  lastUpdated: '2025-01-04'  // Update this date
}
```

**Step 3:** Save the file. That's it! ✅

---

## What This Controls

### ✅ Automatic Changes
When you change `brokerId` in the config, the system automatically:

1. **Forces this broker** for ALL first-time users (no demat account)
2. **Updates recommendation engine** to show the new priority broker
3. **Keeps existing user logic** - users with current brokers still get smart recommendations

### ⚠️ Manual Changes Needed
If you switch from Zerodha to another broker, you need to manually update:

**File:** `/src/components/ModularBrokerTool.tsx` (Line ~1321-1411)

**Section:** "FIRST-TIME USER GUIDE - Only for new_account users"

Currently hardcoded to Zerodha:
- Title: "Starting Your Investment Journey with **Zerodha**"
- Content: References Kite app, Varsity, ₹0 delivery, 1.6Cr+ users

**How to update:**
1. Search for: `FIRST-TIME USER GUIDE - Only for new_account users - ZERODHA SPECIFIC`
2. Replace all "Zerodha" references with your new broker name
3. Update benefits to match new broker's features

---

## Example: Switching to Upstox

### Config Change (Automatic)
```typescript
// /src/config/priorityBroker.ts
export const PRIORITY_BROKER_CONFIG = {
  brokerId: 'upstox',  // ← Changed from 'zerodha'
  reason: 'Highest commission partner as of Feb 2025',
  forceForNewUsers: true,
  lastUpdated: '2025-02-01'  // Updated
}
```

### Component Update (Manual)
```tsx
// /src/components/ModularBrokerTool.tsx (Line ~1326)
<h3 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
  <span className="text-2xl">🎯</span>
  Starting Your Investment Journey with Upstox  {/* Changed */}
</h3>

<p className="text-gray-800 text-sm mb-4 leading-relaxed">
  Since this is your <strong>first trading account</strong>, we recommend <strong>Upstox</strong> - Ratan Tata backed broker trusted by 1.3Cr+ users. Here&apos;s why:
</p>

{/* Update benefits section to Upstox features */}
<div className="flex items-start gap-2">
  <span className="text-indigo-600 font-bold mt-0.5">•</span>
  <p className="text-gray-700 text-xs"><strong>Reliable platform:</strong> Backed by Ratan Tata - won&apos;t crash when you need it most</p>
</div>
{/* ... etc */}
```

---

## Advanced: Disable Force Priority (Smart Recommendations)

If you want the system to intelligently recommend based on quiz answers instead of forcing one broker:

```typescript
export const PRIORITY_BROKER_CONFIG = {
  brokerId: 'zerodha',
  reason: 'Preferred partner but not forced',
  forceForNewUsers: false,  // ← Set to false
  lastUpdated: '2025-01-04'
}
```

When `forceForNewUsers: false`:
- New users get recommendations based on their quiz answers
- System uses business priority ranking (Zerodha > Upstox > Angel One > Fyers > 5paisa)
- No single broker is forced

---

## Technical Details

### Files Modified
1. **`/src/config/priorityBroker.ts`** - Central config (NEW FILE)
2. **`/src/config/recommendationEngine.ts`** - Uses priority broker config
3. **`/src/components/ModularBrokerTool.tsx`** - First-time user UI section

### How It Works
```typescript
// recommendationEngine.ts
const hasExistingAccount = currentBrokers.length > 0;
const forcePriorityBroker = shouldForcePriorityBroker(hasExistingAccount);

if (forcePriorityBroker) {
  // Force priority broker for new users
  recommendedBrokerId = PRIORITY_BROKER_CONFIG.brokerId;
} else {
  // For existing users, use normal business priority
  recommendedBrokerId = selectBestBrokerFromAvailable(availableBrokers);
}
```

### Current State (Jan 2025)
- **Priority Broker:** Zerodha
- **Reason:** Highest commission partner
- **Force Mode:** ON (`forceForNewUsers: true`)
- **Affects:** First-time users only (no demat account)

---

## Questions?

- **Q: Can I set different brokers for different user types?**
  A: Currently no - one priority broker for all first-timers. Would need custom development.

- **Q: What happens to users who already started the quiz?**
  A: Changes apply to new sessions only. Existing sessions keep their original recommendation.

- **Q: How do I test the change?**
  A: Visit `/` and select "No" when asked "Do you currently trade stocks?" - you should see the new priority broker.

---

**Last Updated:** Jan 4, 2025
**Current Priority Broker:** Zerodha
**Next Review:** When commission agreements change
