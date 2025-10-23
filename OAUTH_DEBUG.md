# 🐛 Google OAuth Debug Guide

## Error Message
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

## ✅ Root Cause
**Google OAuth is not enabled in your Supabase project settings.**

---

## 🔧 Step-by-Step Fix

### Step 1: Enable Google Provider in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **ithrzpkgpvpxproczrie**
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the provider list
5. Click **Enable** (toggle should turn green/blue)

**⚠️ CRITICAL:** You must complete the Google OAuth setup:

#### Option A: Use Supabase's Google OAuth (Quick Setup)
- Just toggle **Enable** - Supabase provides default credentials for testing
- ⚠️ This only works for development/testing

#### Option B: Use Your Own Google OAuth (Recommended for Production)
You need to create Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen (if not done)
6. Application type: **Web application**
7. Add **Authorized redirect URIs**:
   ```
   https://ithrzpkgpvpxproczrie.supabase.co/auth/v1/callback
   ```
8. Click **Create** and copy:
   - Client ID
   - Client Secret

9. Back in **Supabase** → **Providers** → **Google**:
   - Enable the provider
   - Paste **Client ID**
   - Paste **Client Secret**
   - Click **Save**

---

### Step 2: Configure Redirect URLs in Supabase

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**:
   ```
   http://localhost:3000
   ```
   (Change to your production URL when deploying)

3. Add **Redirect URLs** (one per line):
   ```
   http://localhost:3000/callback
   http://localhost:3000/reset-password
   ```

4. Click **Save**

---

### Step 3: Verify Your Code (Already Done ✅)

Your code is already correct:

**SigninForm.tsx**:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',  // ✅ Correct
  options: {
    redirectTo: `${window.location.origin}/callback`,  // ✅ Correct
  },
});
```

**SignupForm.tsx**:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',  // ✅ Correct
  options: {
    redirectTo: `${window.location.origin}/callback`,  // ✅ Correct
  },
});
```

---

### Step 4: Test the Flow

1. **Restart your dev server** (important!):
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000/signup`
3. Click **"Continue with Google"**
4. You should see Google's OAuth consent screen
5. After authorizing, you'll be redirected to `/callback`
6. Profile is created automatically
7. You're redirected to `/dashboard` or `/`

---

## 🔍 Debugging Checklist

If you still get errors, check these:

### ✅ Supabase Configuration
- [ ] Google provider is **enabled** (toggle is ON)
- [ ] If using custom credentials: Client ID and Secret are entered
- [ ] Site URL is set to `http://localhost:3000`
- [ ] Redirect URL `http://localhost:3000/callback` is added
- [ ] Redirect URL `http://localhost:3000/reset-password` is added

### ✅ Google Cloud Console (if using custom OAuth)
- [ ] OAuth 2.0 Client ID is created
- [ ] Authorized redirect URI includes:
  ```
  https://ithrzpkgpvpxproczrie.supabase.co/auth/v1/callback
  ```
- [ ] OAuth consent screen is configured
- [ ] Google+ API is enabled (or Google Identity services)

### ✅ Local Environment
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console is open to see errors
- [ ] No ad blockers are interfering with OAuth popup
- [ ] Cookies are enabled in browser

### ✅ Environment Variables (Optional)
If you want to access Supabase keys in your code, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ithrzpkgpvpxproczrie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

But **this is not required** for OAuth to work - your current setup with `lib/supabase/client.ts` should work fine.

---

## 🎯 Quick Test

After enabling Google in Supabase, run this in your browser console on `/signup`:

```javascript
// Test if Supabase client can see Google as available
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://ithrzpkgpvpxproczrie.supabase.co',
  'your-anon-key'
);

// Try to initiate OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin + '/callback' }
});

console.log('OAuth result:', { data, error });
```

If you get the same error, **Google is not enabled in Supabase**.

---

## 📸 Visual Guide

### What You Should See in Supabase:

**Authentication → Providers → Google**
```
┌─────────────────────────────────────────┐
│ Google                          [ ON ]   │  ← This toggle must be ON
│                                          │
│ Client ID (for OAuth): [__________]     │  ← Fill if using custom
│ Client Secret: [__________]              │  ← Fill if using custom
│                                          │
│ [Save]                                   │
└─────────────────────────────────────────┘
```

---

## 🆘 Still Not Working?

Check browser console for detailed errors:

```javascript
// In SignupForm.tsx or SigninForm.tsx
const result = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/callback` }
});

console.log('Full OAuth result:', result);
```

Common errors:
- **"provider is not enabled"** → Enable Google in Supabase
- **"invalid redirect_uri"** → Add redirect URL in Supabase and Google Console
- **"access_denied"** → User canceled or OAuth consent screen not configured

---

## ✅ Summary

**The fix is simple:**
1. Go to Supabase Dashboard
2. Authentication → Providers → Google
3. Click the toggle to **Enable**
4. (Optional) Add your own Client ID/Secret
5. Save changes
6. Restart dev server
7. Test again

Your code is already correct - you just need to configure Supabase! 🎉
