# 🔧 OAuth PKCE Error Fix

## The Problem

You're getting this error:
```
[CALLBACK] Error exchanging code: AuthApiError: invalid request: 
both auth code and code verifier should be non-empty
```

This means the **PKCE code verifier** is being lost between when you click "Sign in with Google" and when you return to the callback.

---

## Why This Happens

### PKCE Flow Explanation
1. Click "Sign in with Google"
2. Supabase generates a **code_verifier** and stores it in localStorage
3. You authenticate with Google
4. Google redirects back with a **code**
5. Callback page exchanges **code + code_verifier** for a session
6. ❌ **If code_verifier is missing from localStorage, it fails**

### Common Causes
- **Browser cache issues** - Old cached code interfering
- **localStorage being cleared** - Extensions or settings
- **Third-party cookies blocked** - Some browsers block cross-origin storage
- **Multiple tabs/windows** - Can cause race conditions
- **Supabase redirect URL mismatch** - Must match exactly

---

## Quick Fixes

### Fix 1: Clear Everything (DO THIS FIRST) ✅

**PowerShell commands:**
```powershell
# Stop dev server (Ctrl+C)

# Clear Next.js cache
cd "c:\Users\Danie\New folder (2)\Showcase"
Remove-Item -Recurse -Force .next

# Clear node_modules cache (optional, slower)
# npm cache clean --force

# Restart dev server
npm run dev
```

**In your browser:**
1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Clear storage** or:
   - Clear **Local Storage**
   - Clear **Session Storage**
   - Clear **Cookies**
4. Click **"Clear site data"**
5. Close and reopen the browser

**Or use keyboard shortcut:**
- Chrome/Edge: `Ctrl+Shift+Delete`
- Select "All time"
- Check: Cookies, Cached images/files
- Click "Clear data"

---

### Fix 2: Check Supabase Redirect URLs ✅

Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**

**Make sure these EXACT URLs are listed:**
```
http://localhost:3000/callback
http://localhost:3000/auth/callback
```

**NOT:**
- ❌ `http://localhost:3000/` (trailing slash matters!)
- ❌ `http://localhost:3000/platform/callback` (unless you add separate route)
- ❌ `http://127.0.0.1:3000/callback` (localhost vs 127.0.0.1 are different!)

**Case sensitivity:** URLs are case-sensitive. `/Callback` ≠ `/callback`

---

### Fix 3: Test in Incognito/Private Window ✅

Sometimes extensions or cookies interfere. Test in:
- **Chrome:** `Ctrl+Shift+N`
- **Edge:** `Ctrl+Shift+N`
- **Firefox:** `Ctrl+Shift+P`

If it works in incognito but not regular browser:
- A browser extension is interfering
- Cookies/storage are corrupted
- Clear data in regular browser

---

### Fix 4: Check Third-Party Cookies ✅

Some browsers block third-party cookies which can interfere with OAuth.

**Chrome/Edge:**
1. Go to `chrome://settings/cookies`
2. Make sure **NOT** set to "Block third-party cookies"
3. Or add exception for `*.supabase.co`

**Firefox:**
1. Go to `about:preferences#privacy`
2. Set to "Standard" (not "Strict")
3. Or add exception for Supabase

---

## Testing Steps

### Step 1: Clean Slate
```powershell
# In terminal
cd "c:\Users\Danie\New folder (2)\Showcase"
Remove-Item -Recurse -Force .next
npm run dev
```

### Step 2: Clear Browser
1. Open DevTools (F12)
2. Console tab → Type: `localStorage.clear(); sessionStorage.clear();`
3. Application tab → Clear storage
4. Close DevTools
5. Refresh page (`Ctrl+F5` for hard refresh)

### Step 3: Test OAuth
1. Go to `http://localhost:3000/platform/signin`
2. **Open DevTools Console** BEFORE clicking Google button
3. Click **"Continue with Google"**
4. Sign in with Google
5. **Watch console logs**

**Expected console output:**
```
[PLATFORM-SIGNIN-OAUTH] Initiating OAuth sign-in
[CALLBACK] Starting auth callback handler
[CALLBACK] Platform auth: true
[CALLBACK] Code present: true Type: null
[CALLBACK] Attempting code exchange for OAuth flow
[CALLBACK] Code exchanged successfully ✅
[CALLBACK] Session status: { hasSession: true, userId: '...' }
```

**If you still see the error:**
```
[CALLBACK] Error exchanging code: invalid request: both auth code and code verifier should be non-empty
[CALLBACK] Code verifier error - may need to sign in again
```

Then move to **Advanced Fixes** below.

---

## Advanced Fixes

### Fix A: Force PKCE Flow in Supabase Settings

In **Supabase Dashboard**:
1. Go to **Authentication** → **Settings**
2. Scroll to **Auth Providers**
3. Click **Google** provider
4. Make sure **"Enable Google provider"** is checked
5. Check **"Enable PKCE flow"** if available
6. Save

### Fix B: Use Implicit Flow Instead (Last Resort)

**Only if PKCE keeps failing**, we can switch to implicit flow:

**File:** `app/platform/signin/PlatformSigninForm.tsx`

Find:
```typescript
await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo: `${window.location.origin}/callback?source=platform`,
    flowType: 'pkce', // ❌ Change this
  },
});
```

Change to:
```typescript
await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo: `${window.location.origin}/callback?source=platform`,
    flowType: 'implicit', // ✅ Less secure but more compatible
  },
});
```

**Note:** Implicit flow is less secure but more compatible with browsers that block storage.

### Fix C: Check for Storage Restrictions

**Console test:**
```javascript
// In browser DevTools console
try {
  localStorage.setItem('test', 'value');
  console.log('localStorage works:', localStorage.getItem('test'));
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage BLOCKED:', e);
}
```

If it says "BLOCKED", your browser is preventing localStorage access.

**Solutions:**
- Enable localStorage in browser settings
- Disable strict privacy settings temporarily
- Use a different browser for testing

---

## Code Changes Made

### Updated `app/(auth)/callback/page.tsx`

**Improvements:**
1. ✅ Better error logging with full error details
2. ✅ Check for existing session even if exchange fails
3. ✅ Show user-friendly message instead of ignoring error
4. ✅ Redirect back to signin if code verifier is truly lost

**New behavior:**
- If code verifier error → Check if session already exists
- If session exists → Continue with that session
- If no session → Show "session expired" message and redirect to signin
- User gets clear feedback instead of silent failure

---

## Quick Checklist

Before testing, make sure:

- [ ] Cleared `.next` folder ✅
- [ ] Cleared browser cache/cookies ✅
- [ ] Cleared localStorage in DevTools ✅
- [ ] Restarted dev server ✅
- [ ] Closed and reopened browser ✅
- [ ] Supabase redirect URLs include `http://localhost:3000/callback` ✅
- [ ] Third-party cookies NOT blocked ✅
- [ ] Testing in fresh browser tab ✅

---

## Still Not Working?

### Collect This Info:

1. **Browser Console Logs** (full output from clicking Google to error)
2. **Network Tab:**
   - Open DevTools → Network tab
   - Filter: XHR
   - Look for failed requests to `supabase.co`
   - Click them and check Response
3. **localStorage contents:**
   ```javascript
   // Run in console:
   Object.keys(localStorage).forEach(key => {
     if (key.includes('supabase')) {
       console.log(key, localStorage.getItem(key).substring(0, 50));
     }
   });
   ```
4. **Supabase redirect URL screenshot**

Share these and I'll debug further!

---

## Summary

**Most common fix:** Clear `.next` folder + Clear browser cache + Clear localStorage

**Most common cause:** Supabase redirect URL not exactly matching

**Updated callback:** Now handles code verifier errors more gracefully

**Try it now!** 🚀
