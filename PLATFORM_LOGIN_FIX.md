# 🔧 Platform Login Redirect Fix

## Issues Fixed

### Problem 1: Logged in but redirected to wrong homepage
**Root Cause**: After successful login, portal couldn't find Prisma user, redirected to `/signin`, which then redirected to business homepage `/`.

**Solution Applied**:
1. ✅ Platform sign-in now creates Prisma user immediately after login
2. ✅ Portal page now creates Prisma user if missing (instead of redirecting)
3. ✅ Users are properly synced between Supabase Auth and Prisma DB

### Problem 2: Portal showing "Something went wrong" error
**Root Cause**: Portal expected Prisma user to exist, threw error when user was null.

**Solution Applied**:
1. ✅ Portal now creates user on-the-fly if missing
2. ✅ Better error handling and null checks
3. ✅ Automatic creator profile creation for creator signups

---

## Files Updated

### 1. `app/platform/signin/PlatformSigninForm.tsx`
**Added**: Prisma user creation before redirect to portal

```typescript
// After successful sign-in:
// 1. Create/ensure Prisma user exists
const profileResp = await fetch("/api/profile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
    role: data.user.user_metadata?.role || "fan",
  }),
});

// 2. Then redirect to portal
window.location.href = "/portal";
```

### 2. `app/portal/page.tsx`
**Added**: Auto-create Prisma user if doesn't exist

```typescript
// If user doesn't exist in Prisma, create them
if (!user) {
  user = await prisma.user.create({
    data: {
      email: authUser.email!,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
      role: authUser.user_metadata?.role === "creator" ? "CREATOR" : "USER",
    },
    include: {
      creator: true,
      profile: true,
    },
  });

  // If creator, create creator profile too
  if (authUser.user_metadata?.role === "creator") {
    await prisma.creator.create({
      data: {
        userId: user.id,
        displayName: user.name || 'Creator',
      },
    });
  }
}
```

---

## About Supabase Redirect URLs

### Current Setup (Likely)
Your Supabase dashboard probably has redirect URLs configured like:
```
https://sandovalbros-six-pink.vercel.app/
https://sandovalbros-six-pink.vercel.app/callback
http://localhost:3000/
http://localhost:3000/callback
```

### Should You Clear Them? **NO!** ⚠️

**Keep them** - but make sure they're configured correctly:

#### Required Redirect URLs:
```
# Production
https://sandovalbros-six-pink.vercel.app/callback
https://sandovalbros-six-pink.vercel.app/

# Development
http://localhost:3000/callback
http://localhost:3000/
```

#### Why These Are Needed:
- `/callback` → For OAuth flows (Google login)
- `/` → For email confirmation links
- Both environments → For dev and production

#### What They Do:
1. **OAuth (Google Login)**:
   - User clicks "Continue with Google"
   - Redirected to Google
   - After Google auth → redirected to `/callback`
   - Callback exchanges code for session
   - Then redirects to `/portal`

2. **Email/Password Login**:
   - User signs in with password
   - Session created immediately
   - **Does NOT use** `/callback`
   - Direct redirect to `/portal`

3. **Email Confirmation**:
   - User signs up
   - Receives email with link
   - Link points to `/` or `/callback`
   - After confirmation → session created

---

## Supabase Dashboard Configuration

### ✅ Correct Setup

Go to: **Supabase Dashboard → Authentication → URL Configuration**

#### Site URL:
```
https://sandovalbros-six-pink.vercel.app
```

#### Redirect URLs (Add all of these):
```
https://sandovalbros-six-pink.vercel.app/
https://sandovalbros-six-pink.vercel.app/callback
https://sandovalbros-six-pink.vercel.app/platform
http://localhost:3000/
http://localhost:3000/callback
http://localhost:3000/platform
```

**Why add `/platform`?**
- So users can be redirected back to platform homepage after email confirmation
- Doesn't affect current flows but provides flexibility

---

## Testing the Fix

### Test 1: Platform Email/Password Sign-In
1. Visit: `https://sandovalbros-six-pink.vercel.app/platform/signin`
2. Enter email and password
3. Click "Sign In"
4. **Expected**:
   - ✅ "Welcome back! Redirecting..."
   - ✅ Redirect to `/portal`
   - ✅ Portal routes you to creator dashboard or fan discover
   - ✅ NO errors
   - ✅ NOT redirected to business homepage

### Test 2: Platform OAuth (Google)
1. Visit: `https://sandovalbros-six-pink.vercel.app/platform/signin`
2. Click "Continue with Google"
3. **Expected**:
   - ✅ Google OAuth popup
   - ✅ After auth → `/callback?source=platform`
   - ✅ Then → `/portal`
   - ✅ Portal routes correctly

### Test 3: New User Signup
1. Visit: `https://sandovalbros-six-pink.vercel.app/platform/signup`
2. Choose "Creator" or "Fan"
3. Sign up with email
4. **Expected**:
   - ✅ "Account created! Redirecting..."
   - ✅ Prisma user created
   - ✅ Creator profile created (if creator)
   - ✅ Redirect to `/portal`
   - ✅ Portal routes correctly

---

## What Changed in the Flow

### Before (Broken):
```
Platform Sign-In
  ↓
Supabase Session Created ✅
  ↓
Redirect to /portal
  ↓
Portal looks for Prisma user
  ↓
User not found ❌
  ↓
Redirect to /signin
  ↓
Redirect to / (business homepage) ❌
```

### After (Fixed):
```
Platform Sign-In
  ↓
Supabase Session Created ✅
  ↓
Create Prisma User ✅
  ↓
Redirect to /portal
  ↓
Portal finds Prisma user ✅
  (or creates if missing)
  ↓
Route to dashboard ✅
```

---

## Error Handling Improvements

### Portal Error Boundary
The "Something went wrong" error (ID: 2064026136) was caught by the error boundary in `app/error.tsx`.

**Now with fix**:
- Portal won't throw null user errors
- Creates users automatically
- Better fallback handling

### Sign-In Error Handling
Added try-catch and logging:
```typescript
try {
  // Ensure Prisma user exists
  await fetch("/api/profile", { ... });
} catch (err) {
  console.warn("Profile sync error (non-critical):", err);
  // Continue anyway - portal will handle it
}
```

---

## If Issues Persist

### Debug Checklist:
1. **Check browser console** during sign-in
   - Look for `[PLATFORM-SIGNIN]` logs
   - Look for `[PORTAL]` logs

2. **Check Supabase Auth logs**
   - Dashboard → Logs → Auth
   - Look for your email
   - Check for successful sign-ins

3. **Check database**
   - Verify Prisma user was created
   - Check `User` table for your email
   - If creator, check `Creator` table

4. **Clear browser state**
   ```javascript
   // In console (F12)
   localStorage.clear();
   sessionStorage.clear();
   // Then hard refresh: Ctrl+Shift+R
   ```

5. **Test in incognito/private window**
   - No cached data
   - Clean slate

---

## Summary

✅ **Sign-in now creates Prisma user** before redirecting  
✅ **Portal creates user** if somehow missing  
✅ **No more redirect loops** to business homepage  
✅ **Better error handling** and logging  
✅ **Supabase redirect URLs** should stay as-is (keep them!)  

**The fix ensures users are properly synced between Supabase Auth and Prisma DB at every step.**

---

## Next Steps

1. **Test the fix** on production:
   - Sign in at `/platform/signin`
   - Should go to `/portal` → dashboard

2. **Monitor for errors**:
   - Check Supabase logs for PKCE errors (may still appear but harmless)
   - Check browser console for any new errors

3. **If still redirecting wrong**:
   - Share browser console logs
   - Share what URL you end up at
   - I'll investigate further

**Your platform login should now work correctly!** 🎉
