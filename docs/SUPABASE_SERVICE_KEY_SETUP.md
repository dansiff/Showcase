# 🔑 How to Get Your Supabase Service Role Key

## Quick Answer

You need to add `SUPABASE_SERVICE_ROLE_KEY` to your environment variables. This is a **secret key** that allows server-side uploads.

---

## Step-by-Step Guide

### 1. Go to Supabase Dashboard

Visit: https://supabase.com/dashboard

### 2. Select Your Project

Click on your project: **ithrzpkgpvpxproczrie**

### 3. Get the Service Role Key

1. Click **Settings** (gear icon in sidebar)
2. Click **API**
3. Scroll down to **Project API keys** section
4. Find **service_role** key (labeled "secret")
5. Click the **eye icon** to reveal it
6. Click **Copy** button

The key looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aHJ6cGtncHZweHByb2N6cmllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODg2NzAwMiwi...
```

⚠️ **Important:** This is a **secret key** - never expose it in client-side code or commit it to git!

---

## Add to Your Local Environment

### Option 1: Add to `.env` file

Open `c:\Users\Danie\New folder (2)\Showcase\.env` and add:

```bash
# ============================================
# SUPABASE (Auth & Client)
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://ithrzpkgpvpxproczrie.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aHJ6cGtncHZweHByb2N6cmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NjcwMDIsImV4cCI6MjA1NDQ0MzAwMn0.THsrKVT8YCjGVJE21gG2n_5QeqFdVY_kYLCH33wyGTE"

# Service role key for server-side operations (uploads, admin tasks)
# ⚠️ NEVER expose this in client-side code!
SUPABASE_SERVICE_ROLE_KEY="eyJ... PASTE YOUR SERVICE_ROLE KEY HERE ..."
```

### Option 2: Add to `.env.local` (Recommended)

If you want to keep secrets separate, add it to `.env.local`:

```bash
# Add this line to .env.local
SUPABASE_SERVICE_ROLE_KEY="eyJ... YOUR KEY HERE ..."
```

---

## Add to Vercel (Production)

### 1. Go to Vercel Dashboard

Visit: https://vercel.com

### 2. Select Your Project

Click on your project (sandovalbros-six-pink)

### 3. Add Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. **Name:** `SUPABASE_SERVICE_ROLE_KEY`
4. **Value:** Paste the service_role key from Supabase
5. **Environment:** Select **Production**, **Preview**, and **Development**
6. Click **Save**

### 4. Redeploy

Vercel will automatically redeploy with the new key.

---

## Create Supabase Storage Bucket

You also need to create a storage bucket for Emily's uploads:

### 1. In Supabase Dashboard

1. Click **Storage** in the sidebar
2. Click **New bucket**
3. **Name:** `emily`
4. **Public bucket:** ✅ **Yes** (so buyers can view uploaded images)
5. Click **Create bucket**

### 2. Set Bucket Policies (Important!)

1. Click on the **emily** bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Add this policy:

```sql
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'emily' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'emily' );
```

Or use the **Quick Policy Templates**:
- Enable **"Public access (read only)"**
- Enable **"Authenticated users can upload"**

---

## Verify It Works

### 1. Restart Your Dev Server

```powershell
# Stop the server (Ctrl+C) then:
npm run dev
```

### 2. Test Upload

1. Visit: http://localhost:3000/emily/admin
2. Log in
3. Go to dashboard
4. Use the content editor
5. Upload an image

You should see:
- ✅ Upload succeeds
- ✅ Returns a public URL
- ✅ Image appears in gallery preview

---

## What Each Key Does

| Key | Purpose | Where Used |
|-----|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client & server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key for client auth | Client-side only |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key for admin operations | **Server-side only** (uploads, admin tasks) |

---

## Security Notes

✅ **DO:**
- Keep `SUPABASE_SERVICE_ROLE_KEY` in `.env` (ignored by git)
- Use it only in server-side API routes
- Add it to Vercel environment variables

❌ **DON'T:**
- Expose it in client-side code
- Commit it to git
- Share it publicly

---

## Quick Copy-Paste Commands

### PowerShell - Add to .env

```powershell
# Open .env in notepad
notepad .env

# Or use VSCode
code .env
```

Then add after line 17:
```
SUPABASE_SERVICE_ROLE_KEY="YOUR_KEY_HERE"
```

### Restart Dev Server

```powershell
# Stop server (Ctrl+C), then:
npm run dev
```

---

## Troubleshooting

**Error: "Missing SUPABASE config"**
- ✅ Make sure you added `SUPABASE_SERVICE_ROLE_KEY` to `.env`
- ✅ Restart the dev server after adding it

**Error: "Bucket not found"**
- ✅ Create the `emily` bucket in Supabase Storage
- ✅ Make it public
- ✅ Set the correct policies

**Upload succeeds but can't view image**
- ✅ Make sure bucket is **public**
- ✅ Check bucket policies allow read access

---

## Summary

1. **Get service_role key** from Supabase Dashboard → Settings → API
2. **Add to `.env`:** `SUPABASE_SERVICE_ROLE_KEY="eyJ..."`
3. **Add to Vercel:** Settings → Environment Variables
4. **Create `emily` bucket** in Supabase Storage (public)
5. **Restart dev server** and test upload

🎯 **You're ready to upload images!**
