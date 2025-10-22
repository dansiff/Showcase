# Quick Setup Checklist ✅

## Immediate Actions (Do This Now)

### 1. Fix Redirect URL in Supabase Dashboard
- [ ] Go to **Authentication** → **URL Configuration**
- [ ] Set **Site URL**: `http://localhost:3000`
- [ ] Add to **Redirect URLs**: `http://localhost:3000/auth/callback`
- [ ] Save changes

### 2. Customize Email Template
- [ ] Go to **Authentication** → **Email Templates** → **Confirm Signup**
- [ ] Copy the template from `docs/EMAIL_CUSTOMIZATION.md`
- [ ] Paste and save

### 3. Update Sender Info
- [ ] Go to **Authentication** → **Settings**
- [ ] Change **Sender Name** to: `Showcase Team`
- [ ] Save changes

### 4. Test the Flow
- [ ] Sign up with a new email
- [ ] Check inbox for confirmation email
- [ ] Click the confirmation link
- [ ] Verify you see the confirmation success page
- [ ] Verify you're redirected to sign in

---

## What Was Fixed

✅ **Email confirmation callback** - Now properly handles email verification  
✅ **Profile creation** - Creates user profile after email confirmation  
✅ **Success page** - Beautiful confirmation page at `/auth/confirm`  
✅ **Role detection** - Reads role from user metadata and creates appropriate profile  
✅ **Better logging** - Console logs show exactly what's happening  

---

## Email Flow

1. User signs up → Supabase sends confirmation email
2. User clicks link in email → Redirected to `http://localhost:3000/auth/callback?code=xxx&type=email`
3. Callback page exchanges code for session → Creates profile → Redirects to `/auth/confirm`
4. Confirm page shows success → Auto-redirects to `/signin` after 5 seconds

---

## Files Changed

- ✅ `app/(auth)/callback/page.tsx` - Enhanced callback handler
- ✅ `app/(auth)/confirm/page.tsx` - NEW: Success confirmation page
- ✅ `app/(auth)/signup/SignupForm.tsx` - Better session handling
- ✅ `docs/EMAIL_CUSTOMIZATION.md` - Complete email customization guide

---

## Next Steps (Optional)

### For Production
1. Set up custom domain email (e.g., `noreply@showcase.com`)
2. Configure SendGrid or AWS SES for email delivery
3. Add your production URLs to Supabase redirect URLs
4. Customize email template with your brand colors

### Email Confirmation Options
- **Keep it enabled** (Recommended): More secure, verifies real emails
- **Disable it** (Testing only): In Supabase → Authentication → Settings → Disable "Enable email confirmations"

---

## Testing Checklist

- [ ] Sign up works and sends email
- [ ] Email arrives with custom styling
- [ ] Confirmation link redirects to callback
- [ ] Callback creates user profile
- [ ] Success page displays
- [ ] Auto-redirect to sign in works
- [ ] Sign in works with confirmed account
- [ ] Dashboard/home page loads based on role

---

## Common Issues

**"Unauthorized" error**: Session not ready yet - fixed with delay in signup  
**Email goes to spam**: Set up custom SMTP in production  
**Redirect loops**: Check Site URL matches your actual domain  
**Profile not created**: Check console logs for errors  

Need help? Check the browser console for detailed `[CALLBACK]` and `[SIGNUP]` logs.
