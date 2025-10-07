# Update Admin Credentials on Vercel

## Problem Found:
Your current Vercel environment variables have newline characters (`\n`) causing authentication to fail.

## New Credentials:
- **Username:** `paisowala`
- **Password:** `Course@Paisowala`

## How to Update:

### Option 1: Via Vercel Dashboard (RECOMMENDED - 2 minutes)
1. Go to: https://vercel.com/bhashkar19s-projects/broker-tool-vercel/settings/environment-variables
2. Find `ADMIN_USERNAME` for Production
3. Click the 3 dots menu → Edit
4. Replace value with: `paisowala` (make sure NO newline at end)
5. Click Save
6. Find `ADMIN_PASSWORD` for Production
7. Click the 3 dots menu → Edit
8. Replace value with: `Course@Paisowala` (make sure NO newline at end)
9. Click Save
10. Go to Deployments tab
11. Click the 3 dots on latest deployment → Redeploy
12. Wait for deployment to complete (~1 minute)

### Option 2: Via CLI (if you prefer)
```bash
# Remove old variables
npx vercel env rm ADMIN_USERNAME production
npx vercel env rm ADMIN_PASSWORD production

# Add new variables
echo -n "paisowala" | npx vercel env add ADMIN_USERNAME production
echo -n "Course@Paisowala" | npx vercel env add ADMIN_PASSWORD production

# Redeploy
npx vercel --prod
```

## After Update:
Access admin panel at: https://findbroker.paisowala.com/admin
- Username: `paisowala`
- Password: `Course@Paisowala`

---

**NOTE:** The `-n` flag in `echo -n` is CRITICAL - it prevents adding newline characters that caused the original issue!
