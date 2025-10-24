# 🔧 Google OAuth Login Troubleshooting Guide

## Current Issue
**Error**: "Something went wrong" (Error ID: 2762402105)  
**Symptoms**: Portal page fails after Google sign-in  
**Location**: Happens on `/portal` page after OAuth callback

---

## ✅ Step 1: Fix Supabase Redirect URLs (MOST IMPORTANT)

### Where to Configure
1. Go to **Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Scroll to **Redirect URLs** section

### Required URLs
Add ALL of these URLs (one per line):

**For Production:**
```
https://sandovalbros-six-pink.vercel.app/callback
https://sandovalbros-six-pink.vercel.app/auth/callback
```

**For Local Development:**
```
http://localhost:3000/callback
http://localhost:3000/auth/callback
```

**For Platform Routes (if using separate platform auth):**
```
https://sandovalbros-six-pink.vercel.app/platform/callback
http://localhost:3000/platform/callback
```

### Site URL
Make sure **Site URL** is set to:
- Production: `https://sandovalbros-six-pink.vercel.app`
- Local: `http://localhost:3000`

### Wildcard Redirect URL (Optional but helpful)
Enable wildcards and add:
```
http://localhost:*/**
https://sandovalbros-six-pink.vercel.app/**
```

---

## ✅ Step 2: Enable Console Logging

### Open Browser DevTools
1. **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
2. **Firefox**: Press `F12` or `Ctrl+Shift+K`
3. Go to **Console** tab

### Clear Console
- Click the 🚫 icon to clear old logs

### Test OAuth Flow Again
1. Sign out completely (clear cookies if needed)
2. Go to `/platform/signin` or `/signin`
3. Click **"Continue with Google"**
4. Complete Google authentication
5. **Watch the console logs** - you should see:

```
[CALLBACK] Starting auth callback handler
[CALLBACK] Platform auth: true
[CALLBACK] Code present: true
[CALLBACK] Attempting code exchange for OAuth flow
[CALLBACK] Code exchanged successfully
[CALLBACK] Session status: { hasSession: true, userId: '...', userMetadata: {...} }
[CALLBACK] Creating new profile with: { role: 'creator', name: '...', userEmail: '...' }
[CALLBACK] Profile creation response: { status: 200, ok: true }
[CALLBACK] Profile created successfully
[CALLBACK] Redirecting to portal hub at /portal
[PORTAL] Auth user check: { hasUser: true, email: '...', error: null }
[PORTAL] Database user check: { found: true, email: '...', hasCreator: true }
[PORTAL] Available portals: { creator: true, fan: false, client: false, admin: false }
```

### Look for Error Logs
If you see errors, they'll look like:
```
[CALLBACK] Error exchanging code: ...
[CALLBACK] Failed to create profile: ...
[PORTAL] Error in getUserWithPortals: ...
```

**Copy the full error message** and share it with me!

---

## ✅ Step 3: Check Database Connection

### Verify Environment Variables
Make sure these are set in your `.env.local`:

```env
# Database (use pooled connection for Vercel)
DATABASE_URL="postgresql://postgres.xxx:xxx@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."

# Supabase Service Role (for server actions)
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
```

### Test Database Connection
Run this in your terminal:
```powershell
cd "c:\Users\Danie\New folder (2)\Showcase"
npm run dev
```

Then visit: `http://localhost:3000/api/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

If database shows `"error"`, your `DATABASE_URL` is wrong.

---

## ✅ Step 4: Check Prisma Schema

### Verify User Model
Your `prisma/schema.prisma` should have:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  creator   Creator?
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  CREATOR
  CLIENT
  ADMIN
}

model Creator {
  id           String    @id @default(cuid())
  userId       String    @unique
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName  String
  promoEndsAt  DateTime?
  // ... other fields
}
```

### Check if Migration is Needed
```powershell
npx prisma migrate status
```

If it says migrations are pending:
```powershell
npx prisma migrate deploy
```

### Regenerate Prisma Client
```powershell
npx prisma generate
```

---

## ✅ Step 5: Test the Fixed Flow

### Clear Everything
1. **Clear browser cache and cookies**
   - Chrome: `Ctrl+Shift+Delete` → Check "Cookies" and "Cached images"
2. **Clear localStorage**
   - Open DevTools → Console → Run:
   ```javascript
   localStorage.clear()
   ```
3. **Sign out of Google** in your browser

### Test OAuth Sign-In
1. Go to `http://localhost:3000/platform/signin`
2. Open DevTools Console
3. Click **"Continue with Google"**
4. Sign in with Google
5. **Watch console logs** for any errors
6. Should land on `/portal` or your dashboard

### Expected Flow
```
/platform/signin 
  → Click "Continue with Google"
  → Google OAuth popup
  → Approve permissions
  → Redirect to /callback?code=xxx&source=platform
  → [CALLBACK] logs appear
  → Create/find Prisma user
  → Redirect to /portal
  → [PORTAL] logs appear
  → Detect portals
  → Redirect to /creator/dashboard (or other portal)
```

---

## 🔍 Common Errors and Solutions

### Error: "Invalid redirect URL"
**Cause**: Redirect URL not configured in Supabase  
**Solution**: Add `/callback` URL to Supabase (see Step 1)

### Error: "Code verifier should be non-empty"
**Cause**: PKCE flow mismatch (harmless warning)  
**Solution**: Already handled - code ignores this error

### Error: "Unauthorized" from /api/profile
**Cause**: Session not found on server  
**Solution**: 
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Clear cookies and sign in again

### Error: "User not found" at portal
**Cause**: Prisma user wasn't created  
**Solution**: Portal now auto-creates - check DATABASE_URL

### Error: "Something went wrong" (2762402105)
**Cause**: Database error or Prisma query failure  
**Solution**: 
1. Check DATABASE_URL format (should use pooler for Vercel)
2. Check console logs for the actual error
3. Verify Prisma migrations are applied

---

## 🎯 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Supabase Redirect URLs include `/callback` ✅
- [ ] `DATABASE_URL` uses pooled connection (`:6543` port) ✅
- [ ] `.env.local` has all required variables ✅
- [ ] Prisma migrations are applied (`npx prisma migrate deploy`) ✅
- [ ] Prisma client is generated (`npx prisma generate`) ✅
- [ ] Browser cookies/cache cleared ✅
- [ ] DevTools console open and monitoring logs ✅
- [ ] Tested with fresh Google sign-in ✅

---

## 📋 Information to Collect for Debugging

If still having issues, collect this info:

### 1. Console Logs
Copy the full console output from:
- Click "Continue with Google"
- Until you see the error

### 2. Network Tab
In DevTools → Network tab:
- Filter by "Fetch/XHR"
- Look for failed requests (red)
- Click failed request → Preview/Response tab
- Copy error message

### 3. Database Check
Run in terminal:
```powershell
npx prisma studio
```
- Open `User` table
- Check if your email exists
- Check the `role` column value

### 4. Supabase Auth Logs
In Supabase Dashboard:
- Go to Authentication → Logs
- Look for recent login attempts
- Copy any error messages

---

## 🚀 Next Steps After Fixing

Once OAuth works:

1. **Test both flows:**
   - Email/password sign-in ✅
   - Google OAuth sign-in ✅

2. **Test both portals:**
   - Platform sign-in (`/platform/signin`) ✅
   - Business sign-in (`/signin`) ✅

3. **Test both roles:**
   - Creator signup ✅
   - Fan signup ✅

4. **Deploy to Vercel:**
   - Push to GitHub
   - Vercel auto-deploys
   - Add production redirect URLs to Supabase

---

## 💡 Still Having Issues?

Share with me:
1. **Full console logs** (from clicking Google button to error)
2. **Network tab errors** (any failed API calls)
3. **Supabase redirect URLs** (screenshot of your config)
4. **Environment** (local dev or production?)

I'll help you debug further! 🔧
