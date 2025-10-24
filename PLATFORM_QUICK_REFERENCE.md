# 🎯 Quick Reference: Platform vs Business URLs

## Platform Ecosystem (FusionSpace)
**Homepage**: http://localhost:3000/platform

### Auth Pages
- Sign Up: http://localhost:3000/platform/signup
- Sign In: http://localhost:3000/platform/signin
- Sign Up (Creator): http://localhost:3000/platform/signup?role=creator
- Sign Up (Fan): http://localhost:3000/platform/signup?role=fan

### After Auth → Redirects to:
- `/portal` → Smart routing to creator dashboard or fan discover

### Key Platform Pages
- Discover Creators: http://localhost:3000/fan/discover
- Creator Dashboard: http://localhost:3000/creator/dashboard
- Portal Hub: http://localhost:3000/portal

---

## Business Ecosystem (The Fusion Space Inc)
**Homepage**: http://localhost:3000/

### Auth Pages
- Sign Up: http://localhost:3000/signup
- Sign In: http://localhost:3000/signin

### After Auth → Redirects to:
- `/portal` → Smart routing based on role

---

## Shared Pages (Both Can Access)
- Portal Hub: http://localhost:3000/portal
- Creator Dashboard: http://localhost:3000/creator/dashboard
- Fan Discover: http://localhost:3000/fan/discover
- Admin Panel: http://localhost:3000/admin (if admin)
- About: http://localhost:3000/About
- Contact: http://localhost:3000/contact
- Privacy: http://localhost:3000/privacy
- Terms: http://localhost:3000/terms

---

## Navigation Flow

### Platform User Journey:
1. `/platform` → "Get Started" → `/platform/signup`
2. Sign up as Creator → `/portal` → `/creator/dashboard`
3. All navigation stays in platform ecosystem
4. Can intentionally visit business site via "Main Site" link

### Business User Journey:
1. `/` → "Sign In" → `/signin`
2. Sign in → `/portal` → appropriate dashboard
3. All navigation stays in business ecosystem
4. Can discover platform if they explore

---

## File Locations

### Platform Files:
```
app/platform/
├── page.tsx (homepage)
├── layout.tsx (nav + footer)
├── signin/
│   ├── page.tsx
│   └── PlatformSigninForm.tsx
└── signup/
    ├── page.tsx
    └── PlatformSignupForm.tsx

components/platform/
├── PlatformHero.tsx
├── PlatformFeatures.tsx
├── CreatorShowcase.tsx
├── PlatformCTA.tsx
└── index.tsx
```

### Business Files:
```
app/(default)/page.tsx (homepage)
app/(auth)/signin/ (business sign in)
app/(auth)/signup/ (business sign up)
```

---

## Testing Checklist

- [ ] Visit `/platform` - See FusionSpace branding
- [ ] Click "Get Started" - Lands on `/platform/signup`
- [ ] Platform signup form has Creator/Fan toggle
- [ ] Platform sign-in link goes to `/platform/signin`
- [ ] Platform header links to platform pages
- [ ] Platform footer has "Main Website" link to `/`
- [ ] Visit `/` - See business branding
- [ ] Business pages use existing auth routes
- [ ] After platform auth → `/portal` → correct dashboard
- [ ] Can access both ecosystems when signed in

---

## Quick Fixes

### If platform pages show errors:
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Check browser console for specific errors

### If redirects don't work:
1. Check `/portal/page.tsx` logic
2. Verify user has correct role in database
3. Check callback page logs in console

### If styling looks wrong:
1. Verify Tailwind classes are compiling
2. Check platform layout is being used
3. Inspect element to see applied styles

---

## Production URLs (After Deploy)

Replace `localhost:3000` with your domain:

**Platform**:
- https://yourdomain.com/platform
- https://yourdomain.com/platform/signup
- https://yourdomain.com/platform/signin

**Business**:
- https://yourdomain.com/
- https://yourdomain.com/signup
- https://yourdomain.com/signin

---

**Everything is ready!** Visit http://localhost:3000/platform to see your new FusionSpace homepage! 🚀
