# 🔍 Sentry Setup Guide

## What is Sentry?
Sentry monitors errors in your production app and alerts you when things break. You'll get:
- Real-time error alerts
- Stack traces to debug issues
- Error frequency and trends
- User impact metrics

---

## Setup Steps (15 minutes)

### 1. Create Sentry Account
1. Go to https://sentry.io/signup/
2. Sign up with email or GitHub
3. Select **Free Plan** (50k events/month - plenty for your needs)

### 2. Create New Project
1. Click "Create Project"
2. Select platform: **Next.js**
3. Project name: `broker-tool-vercel`
4. Click "Create Project"

### 3. Get Your DSN
After creating project, you'll see your DSN. It looks like:
```
https://abc123def456@o123456.ingest.sentry.io/7891011
```

**Copy this!** You'll need it next.

### 4. Add DSN to Vercel Environment Variables

```bash
# In your terminal, run:
vercel env add NEXT_PUBLIC_SENTRY_DSN production

# When prompted, paste your Sentry DSN
# Example: https://abc123def456@o123456.ingest.sentry.io/7891011
```

Also add optional variables (not required, but useful for source maps):
```bash
vercel env add SENTRY_ORG production
# Enter your Sentry organization slug (find it in Sentry Settings)

vercel env add SENTRY_PROJECT production
# Enter: broker-tool-vercel
```

### 5. Add to Local Environment (for testing)

Create `.env.local` file:
```bash
echo "NEXT_PUBLIC_SENTRY_DSN=your-dsn-here" >> .env.local
```

### 6. Test Locally

```bash
# Build and run
npm run build
npm start

# Visit http://localhost:3000
# Open browser console and run:
throw new Error("Test Sentry Error");

# Check Sentry dashboard - error should appear within 1 minute
```

### 7. Deploy to Production

```bash
git add .
git commit -m "feat: Add Sentry error monitoring"
git push

# Or deploy directly
vercel --prod
```

---

## Verify It's Working

### Test 1: Trigger Test Error
1. Visit production site
2. Open browser console (F12)
3. Run: `throw new Error("Sentry test error");`
4. Check Sentry dashboard → should see error within 60 seconds

### Test 2: API Error
Create a test endpoint that throws error:
```bash
curl https://findbroker.paisowala.com/api/health
# Should work

# Then artificially break something to test alerts
```

---

## Configure Alerts

### Email Alerts (Recommended)
1. Go to Sentry project settings
2. Click "Alerts" → "Create Alert"
3. Select "Issues"
4. Conditions:
   - When: "A new issue is created"
   - Action: "Send email to team"
5. Save

### Slack Alerts (Optional)
1. Go to Settings → Integrations
2. Search for "Slack"
3. Click "Install"
4. Follow OAuth flow
5. Configure which channel gets alerts

---

## What Errors Get Tracked?

### ✅ Automatically Tracked:
- Unhandled exceptions in API routes
- React component errors
- Network failures
- Database connection errors
- JavaScript errors in browser

### Example Error Alert:
```
🚨 New Issue: TypeError: Cannot read property 'mobile' of undefined
Location: src/app/api/submit/route.ts:187
Users affected: 1
First seen: 2 minutes ago
Environment: production
```

---

## Useful Sentry Features

### 1. Breadcrumbs
Sentry automatically logs user actions before error:
```
User clicked "Submit" button
→ Made POST request to /api/submit
→ Database query started
→ ❌ Error: Connection timeout
```

### 2. Release Tracking
Tag errors by deployment:
```bash
# In Vercel, add env var:
SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA
```

### 3. User Context
Errors include user info (we're already doing this):
```javascript
Sentry.setUser({
  id: sessionId,
  mobile: mobile.slice(-4) // Last 4 digits only for privacy
});
```

---

## Cost Estimate

**Free Tier**: 50,000 events/month
- Plenty for 1,000+ daily users
- Each error = 1 event
- Each transaction = 1 event (we only sample 10%)

**If you exceed free tier:**
- $26/month for 100k events
- You'll get email warning before hitting limit

---

## Privacy & GDPR

Sentry configs already include:
- ✅ Mask all text in session replays
- ✅ Block all media
- ✅ Only log last 4 digits of mobile
- ✅ No PII (Personally Identifiable Info) sent

---

## Troubleshooting

### Issue: "No errors showing up in Sentry"
- Check `NEXT_PUBLIC_SENTRY_DSN` is set in Vercel
- Check env var starts with `NEXT_PUBLIC_` (required for client-side)
- Verify DSN is correct (copy-paste carefully)
- Check Sentry project is active (not paused)

### Issue: "Too many errors"
- Adjust `ignoreErrors` in sentry config files
- Reduce `tracesSampleRate` from 0.1 to 0.01
- Filter out noisy errors in Sentry dashboard

### Issue: "Source maps not uploading"
- Set `SENTRY_ORG` and `SENTRY_PROJECT` env vars
- Create auth token in Sentry → Settings → Auth Tokens
- Add to Vercel: `vercel env add SENTRY_AUTH_TOKEN production`

---

## Quick Reference

### Environment Variables Needed:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx  # Required
SENTRY_ORG=your-org-slug                                      # Optional
SENTRY_PROJECT=broker-tool-vercel                             # Optional
SENTRY_AUTH_TOKEN=xxx                                         # Optional (for source maps)
```

### Files Created:
```
✓ sentry.client.config.ts   - Browser error tracking
✓ sentry.server.config.ts   - API route error tracking
✓ sentry.edge.config.ts     - Middleware error tracking
✓ next.config.ts            - Updated with Sentry integration
```

---

## ✅ Success Checklist

- [ ] Sentry account created
- [ ] Project created in Sentry
- [ ] DSN copied
- [ ] `NEXT_PUBLIC_SENTRY_DSN` added to Vercel
- [ ] Code deployed to production
- [ ] Test error triggered
- [ ] Error appeared in Sentry dashboard
- [ ] Email alerts configured
- [ ] Team added to Sentry project

---

## Support

- Sentry Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Email: support@sentry.io
- Status: https://status.sentry.io/

---

**Estimated Setup Time**: 15 minutes
**Monthly Cost**: $0 (free tier)
**Value**: Invaluable for catching bugs before users complain
