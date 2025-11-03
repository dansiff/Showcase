# Multi-Admin System for Emily

## Overview
You now have **two ways to authenticate as an admin**, both supported simultaneously:

1. **Legacy Admin Key** (quick launch, single shared key)
2. **Multi-Admin System** (individual accounts with email/password)

This design lets you launch immediately with the simple key and migrate to individual accounts later without downtime.

---

## Quick Start (Launch Now)

### 1. Set up your local admin key
The `.env.local` file has been created with a default key. **Change this before production!**

```bash
EMILY_ADMIN_KEY=emily_temp_admin_2024_change_me_in_production
```

### 2. Run database migration
Since we added the `Admin` table, run:

```powershell
npx prisma migrate dev --name add_admin_table
npx prisma generate
```

### 3. Start your dev server
```powershell
npm run dev
```

### 4. Log in as admin
Visit: `http://localhost:3000/emily/admin`

- Click "Admin Key" tab
- Enter the key from your `.env.local`
- You're now logged in for 7 days

### 5. Deploy to production
In Vercel → Environment Variables, add:
```
EMILY_ADMIN_KEY=your_strong_random_key_here
```

**Generate a secure key (PowerShell):**
```powershell
# Generate random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## Migration to Multi-Admin (Do This Later)

### When you're ready for individual accounts:

1. **Log in with your admin key** (as above)

2. **Visit the Admin Manager**
   - Go to: `http://localhost:3000/emily/admin/manage`
   - Or click "Go to Admin Manager" on the login page

3. **Create admin accounts**
   - Click "+ Add New Admin"
   - Enter email, password, and optional name
   - Create accounts for yourself and team members

4. **Test email/password login**
   - Log out (clear cookies)
   - Go to `/emily/admin`
   - Click "Email & Password" tab
   - Log in with one of the accounts you created

5. **Optional: Remove the legacy key**
   - Once all admins are using email/password
   - Remove `EMILY_ADMIN_KEY` from `.env.local` and Vercel
   - All future logins will be email/password only

---

## How It Works

### Authentication Flow

The login route (`/api/emily/admin/login`) now checks:

1. **If `key` is provided:** Validates against `EMILY_ADMIN_KEY`
2. **If `email` + `password` are provided:** Looks up admin in database and verifies bcrypt hash

Both methods set the same `emily_admin` cookie (7-day expiry).

### Admin Management

#### Create Admin
```bash
POST /api/emily/admin/create
Body: { "email": "admin@example.com", "password": "...", "name": "..." }
Requires: Logged in as admin (via cookie)
```

#### List Admins
```bash
GET /api/emily/admin/list
Requires: Logged in as admin
Returns: Array of admins (excluding passwords)
```

#### Delete Admin
```bash
DELETE /api/emily/admin/delete?id=<admin_id>
Requires: Logged in as admin
```

### Security Notes

- Passwords are hashed with **bcrypt** (10 rounds)
- Admin cookie is **HTTP-only**, **secure**, **SameSite=lax**
- All admin management routes require authentication
- Legacy key can coexist with email/password (both work)

---

## File Structure

```
app/
├── emily/
│   ├── admin/
│   │   ├── page.tsx              # Login UI (supports both methods)
│   │   └── manage/
│   │       └── page.tsx          # Admin management UI
│   └── access/
│       └── page.tsx              # Shows ContentEditor if admin logged in
├── api/
    └── emily/
        └── admin/
            ├── login/
            │   └── route.ts      # Dual auth (key OR email/password)
            ├── create/
            │   └── route.ts      # Create new admin
            ├── list/
            │   └── route.ts      # List all admins
            └── delete/
                └── route.ts      # Delete admin

prisma/
└── schema.prisma                 # Contains Admin model
```

---

## FAQ

### Can I use both methods at the same time?
**Yes!** You can log in with the key OR with email/password. Both work simultaneously.

### When should I remove the legacy key?
After you've:
1. Created admin accounts for everyone who needs access
2. Tested that email/password login works
3. Confirmed all admins can log in

Then remove `EMILY_ADMIN_KEY` from your environment variables.

### What happens if I forget an admin password?
Currently, you'd need to:
1. Log in with the legacy key (if still set)
2. Delete the admin and recreate with a new password

OR use Prisma Studio to manually reset the password hash:
```powershell
npx prisma studio
# Navigate to Admin table, edit the password field with a new bcrypt hash
```

Future enhancement: Add a password reset flow.

### Can I create the first admin without the legacy key?
No. The create route requires authentication. You need either:
- The legacy key set to log in and create admins, OR
- Manually insert an admin via Prisma Studio with a bcrypt hash

The legacy key is the easiest bootstrap method.

### How do I change my admin password?
Use Prisma Studio or add a "change password" UI (future enhancement).

---

## Production Checklist

- [ ] Set strong `EMILY_ADMIN_KEY` in Vercel (32+ random characters)
- [ ] Run `npx prisma migrate deploy` in production
- [ ] Log in and create your admin account via `/emily/admin/manage`
- [ ] Test email/password login
- [ ] (Optional) Remove `EMILY_ADMIN_KEY` once all admins migrated
- [ ] Keep admin credentials secure (use password manager)

---

## Next Steps

1. **Launch now** with the legacy key
2. **Create admins** when ready via `/emily/admin/manage`
3. **Migrate** to email/password over time
4. **Optionally remove** legacy key for cleaner auth

You have full flexibility to choose when and how to migrate!
