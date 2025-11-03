# 🔧 Vercel Database Connection Fix

## The Problem

You're seeing this error in production:
```
Can't reach database server at `db.ithrzpkgpvpxproczrie.supabase.co:6543`
```

This happens because the Supabase **pooled connection** (port 6543) has connection limits and can timeout in serverless environments like Vercel.

## The Solution

You have **two options**:

---

### Option 1: Use Direct Connection (Recommended)

Change your Vercel `DATABASE_URL` to use port **5432** (direct) instead of **6543** (pooled).

**Steps:**

1. **Go to Vercel Dashboard**
   - Project → Settings → Environment Variables

2. **Update `DATABASE_URL`**
   
   **Current (Pooled - causes timeouts):**
   ```
   postgresql://postgres:PASSWORD@db.ithrzpkgpvpxproczrie.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
   ```

   **New (Direct - more reliable):**
   ```
   postgresql://postgres:ls3FxqBQ5gEKqA0X@db.ithrzpkgpvpxproczrie.supabase.co:5432/postgres?sslmode=require
   ```

3. **Redeploy** your app in Vercel

**Why this works:**
- Port 5432 = Direct connection to Postgres (more reliable, higher timeout)
- Port 6543 = PgBouncer pooler (can timeout on cold starts)
- Vercel serverless functions handle connection pooling automatically

---

### Option 2: Keep Pooled Connection + Add Timeout Handling

If you want to keep the pooled connection, I've already added:
- Timeout handling (5 seconds)
- Graceful fallback (dashboard loads even if DB is slow)
- Warning banner when DB connection fails

**But you still need to check:**

1. **Supabase Database Status**
   - Go to your Supabase dashboard
   - Check if database is paused (free tier pauses after inactivity)
   - Click "Restore" if paused

2. **Connection Limits**
   - Free tier Supabase has limited pooled connections
   - Upgrading to Pro increases limits

---

## Quick Fix (Do This Now)

**In Vercel Dashboard:**

1. Environment Variables → Edit `DATABASE_URL`
2. Change port from `:6543` to `:5432`
3. Remove `?pgbouncer=true&connection_limit=1` query params
4. Keep `?sslmode=require`
5. Redeploy

**Final URL should look like:**
```
postgresql://postgres:ls3FxqBQ5gEKqA0X@db.ithrzpkgpvpxproczrie.supabase.co:5432/postgres?sslmode=require
```

---

## Verify It Works

After redeploying:

1. Visit: `https://your-app.vercel.app/emily/admin`
2. Log in with your admin key
3. You should reach the dashboard without errors
4. Stats should load (not show 0)

---

## Local Development

Your local `.env` can keep the pooled connection since it's not serverless:
```
DATABASE_URL="postgresql://postgres:ls3FxqBQ5gEKqA0X@db.ithrzpkgpvpxproczrie.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres:ls3FxqBQ5gEKqA0X@db.ithrzpkgpvpxproczrie.supabase.co:5432/postgres"
```

But for **Vercel/Production**, use the direct connection (port 5432).

---

## Additional Vercel Env Vars Needed

Make sure these are also set in Vercel:

```bash
# Admin system
EMILY_ADMIN_KEY=<your-secure-key>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_EMILY_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ithrzpkgpvpxproczrie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (for uploads)
```

---

## Dashboard Improvements Made

I've updated the dashboard to:
- ✅ Handle DB connection timeouts gracefully
- ✅ Show a warning banner if DB is unreachable
- ✅ Still load the content editor even if stats fail
- ✅ Use 5-second timeout for queries
- ✅ Log errors for debugging

So even if the DB is slow, **you can still use the dashboard and upload content**.

---

## Summary

**Root cause:** Pooled connection (port 6543) timing out on Vercel serverless  
**Best fix:** Change Vercel `DATABASE_URL` to use port 5432 (direct)  
**Already done:** Dashboard now handles timeouts gracefully  

🎯 **Action:** Update Vercel env var and redeploy!
