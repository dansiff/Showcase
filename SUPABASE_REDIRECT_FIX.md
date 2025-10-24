# 🎯 QUICK FIX: Supabase Redirect URLs

## The Problem
**Error ID 2762402105** is almost always caused by **missing redirect URLs** in Supabase.

## The Solution (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** (left sidebar)
4. Click **URL Configuration**

### Step 2: Add These Redirect URLs
In the **"Redirect URLs"** section, add each of these URLs (click "Add URL" for each):

#### Production URLs:
```
https://sandovalbros-six-pink.vercel.app/callback
https://sandovalbros-six-pink.vercel.app/auth/callback
```

#### Local Development URLs:
```
http://localhost:3000/callback
http://localhost:3000/auth/callback
```

### Step 3: Set Site URL
In the **"Site URL"** field, make sure it's set to:
```
https://sandovalbros-six-pink.vercel.app
```

### Step 4: Save
Click **Save** at the bottom of the page.

### Step 5: Test Again
1. Clear your browser cache and cookies
2. Go to `/platform/signin`
3. Click "Continue with Google"
4. Should work now! ✅

---

## What These URLs Do

- **/callback** - Handles OAuth redirects from Google
- **/auth/callback** - Alternative callback route (backup)

When Google finishes authenticating you, it redirects back to your app. If the redirect URL isn't in Supabase's allowlist, **it will fail with a generic error**.

---

## How to Verify It's Fixed

After adding the URLs, you should see in your browser console:
```
[CALLBACK] Starting auth callback handler
[CALLBACK] Code present: true
[CALLBACK] Code exchanged successfully ✅
```

Instead of an error! 🎉

---

## Still Not Working?

If you still get the error after adding redirect URLs:

### Check DATABASE_URL Format
Your `.env.local` should use a **pooled connection** for Vercel:

```env
# WRONG (direct connection - will fail on Vercel)
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# CORRECT (pooled connection)
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

Notice the differences:
- ✅ `.pooler.supabase.com` instead of `db.xxx.supabase.co`
- ✅ Port `:6543` instead of `:5432`
- ✅ Query params `?pgbouncer=true&connection_limit=1`

Get your pooled connection URL from:
**Supabase Dashboard → Project Settings → Database → Connection Pooling → Connection string**

### Apply Database Migrations
```powershell
cd "c:\Users\Danie\New folder (2)\Showcase"
npx prisma migrate deploy
npx prisma generate
```

### Clear Everything and Try Again
1. Clear browser cache (`Ctrl+Shift+Delete`)
2. Clear localStorage (DevTools Console → `localStorage.clear()`)
3. Sign out of Google in your browser
4. Try OAuth sign-in again

---

## Production Deployment

When you deploy to Vercel, make sure:

1. **Environment variables are set** in Vercel Dashboard:
   - `DATABASE_URL` (pooled connection)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - All other required env vars

2. **Supabase redirect URLs include your Vercel domain**:
   ```
   https://sandovalbros-six-pink.vercel.app/callback
   https://sandovalbros-six-pink.vercel.app/auth/callback
   ```

3. **Prisma generates after install** (should auto-run via postinstall):
   ```json
   {
     "scripts": {
       "postinstall": "prisma generate"
     }
   }
   ```

---

## That's It!

**99% of the time**, adding the redirect URLs to Supabase fixes the OAuth error.

If you're still stuck after this, open your browser console and share the logs with me! 🔍
