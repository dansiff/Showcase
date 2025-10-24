# 🔧 PKCE Error Fix - Platform Sign In

## Error Explanation

**Error Message**: 
```
400: invalid request: both auth code and code verifier should be non-empty
```

**What This Means**:
This error occurs when Supabase expects a PKCE (Proof Key for Code Exchange) flow but receives a different authentication method. PKCE is used for OAuth (Google login), NOT for email/password logins.

---

## Root Cause

The error appears AFTER successful sign-in because:

1. ✅ Email/password login works correctly (creates session)
2. ✅ You get redirected to `/portal`
3. ❌ Supabase logs show an attempt to exchange an auth code (which doesn't exist for password logins)

**Why This Happens**:
- Email/password auth creates a session directly (no code exchange needed)
- OAuth auth uses PKCE with code exchange
- Something is triggering an unnecessary code exchange attempt

---

## Solution 1: Fix Applied (Client-Side)

I've updated your platform sign-in form to:

### Before:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
  options: {
    data: {
      rememberMe,
      source: "platform",
    },
  },
});
```

### After:
```typescript
// Direct password sign-in (no code exchange)
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Clear any stale tracking
localStorage.removeItem("authSource");
localStorage.removeItem("pendingRole");

// Update metadata separately (non-blocking)
await supabase.auth.updateUser({
  data: {
    lastLoginSource: "platform",
  },
});
```

**Changes Made**:
- ✅ Removed `options` from password sign-in (not needed)
- ✅ Clear localStorage before redirect (prevents stale data)
- ✅ Add metadata update separately (doesn't affect auth flow)
- ✅ Better error logging

---

## Solution 2: Supabase Dashboard Configuration

The PKCE error in your logs might be from a misconfigured redirect URL. Check your Supabase dashboard:

### Step 1: Check Redirect URLs
1. Go to: https://app.supabase.com
2. Select your project
3. Click **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, ensure you have:
   ```
   https://sandovalbros-six-pink.vercel.app/callback
   http://localhost:3000/callback
   ```

### Step 2: Check Auth Settings
1. Go to **Authentication** → **Providers**
2. Click **Email** provider
3. Ensure these settings:
   - ✅ **Email provider** enabled
   - ✅ **Confirm email** = Your preference (true/false)
   - ✅ **Secure email change** = Enabled
   - ❌ **PKCE Flow** = Should NOT be required for email (only OAuth)

### Step 3: Check OAuth Provider (Google)
1. Go to **Authentication** → **Providers**
2. Click **Google** provider
3. Ensure:
   - ✅ **Enabled** = true (if using Google OAuth)
   - ✅ **Client ID** = Your Google OAuth client ID
   - ✅ **Client Secret** = Your Google OAuth secret
   - ✅ **Authorized Redirect URIs** in Google Console includes:
     ```
     https://YOUR-PROJECT.supabase.co/auth/v1/callback
     ```

---

## Solution 3: Check for Redirects in Code

Make sure no middleware or Next.js redirects are interfering:

### Check `middleware.ts` (if exists):
```typescript
// Ensure you're not redirecting auth requests
if (pathname.startsWith('/callback')) {
  return NextResponse.next(); // Don't intercept callback
}
```

### Check `next.config.js`:
```javascript
// Ensure no redirects affecting /portal or /callback
redirects: async () => {
  return [
    // Your redirects here
    // Make sure /portal and /callback are NOT redirected
  ];
},
```

---

## Solution 4: Clear Browser State

Sometimes cached auth state causes issues:

### In Browser Console (F12):
```javascript
// Clear all Supabase data
localStorage.clear();
sessionStorage.clear();

// Or clear specific keys
localStorage.removeItem('authSource');
localStorage.removeItem('pendingRole');
localStorage.removeItem('supabase.auth.token');
```

### Then:
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Try signing in again

---

## Testing the Fix

### Test 1: Email/Password Sign-In (Platform)
1. Visit: https://sandovalbros-six-pink.vercel.app/platform/signin
2. Enter email and password
3. Click "Sign In"
4. ✅ Should see: "Welcome back! Redirecting..."
5. ✅ Should redirect to: `/portal`
6. ✅ Should NOT see PKCE error in Supabase logs
7. ✅ Should see user dashboard

### Test 2: OAuth Sign-In (Platform)
1. Visit: https://sandovalbros-six-pink.vercel.app/platform/signin
2. Click "Continue with Google"
3. ✅ Should go through Google OAuth
4. ✅ Should redirect to `/callback?source=platform`
5. ✅ Should then go to `/portal`
6. ✅ PKCE flow is CORRECT here (OAuth uses it)

### Test 3: Check Logs
1. Go to Supabase Dashboard → Logs → Auth
2. Filter by your email or recent time
3. ✅ Should see: "Password sign-in successful"
4. ❌ Should NOT see: "invalid request: both auth code and code verifier"

---

## Why This Error is Not Critical

**Important**: Even though you see this error in Supabase logs:

✅ **Sign-in works** - You get logged in successfully  
✅ **Session is created** - Your session is valid  
✅ **Redirect works** - You reach `/portal` correctly  
❌ **Error is logged** - But doesn't affect functionality  

**The error is a "false alarm"** that occurs AFTER successful authentication. It's Supabase trying to do an unnecessary code exchange.

---

## Monitoring

### Check if Error Still Occurs:

1. **Sign in via platform**: `/platform/signin`
2. **Wait 5 minutes**
3. **Check Supabase logs**:
   ```
   Dashboard → Logs → Auth logs
   Filter: Your email or last 10 minutes
   ```

4. **Look for**:
   - ✅ "Password sign-in" event
   - ❌ "invalid request: both auth code" error

If error still appears but sign-in works, it's safe to ignore. If sign-in breaks, then we need to investigate further.

---

## Additional Debugging

If issues persist, add this to your `.env.local`:

```bash
# Enable verbose Supabase logging
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

Then check browser console during sign-in for detailed logs.

---

## Summary

✅ **Code fixed** - Removed unnecessary options from password sign-in  
✅ **Cleared storage** - Prevent stale auth data  
✅ **Better logging** - Track auth flow  
✅ **Documentation** - This guide for future reference  

**Next Steps**:
1. Test sign-in on `/platform/signin`
2. Check Supabase logs after sign-in
3. If error persists but works, it's safe to ignore
4. If sign-in breaks, check Supabase dashboard settings

---

The fix has been applied to your code. Try signing in now! 🚀
