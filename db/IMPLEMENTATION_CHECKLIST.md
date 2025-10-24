# Supabase Migration Implementation Checklist

## ✅ What Has Been Created

### Migration SQL Files (`db/migrations/`)
- ✅ `001_add_uuid_columns.sql` - Phase 1: Non-destructive UUID column addition
- ✅ `002_add_uuid_constraints.sql` - Phase 2: Constraints and FK relationships
- ✅ `003_enable_rls.sql` - Row-Level Security policies for all tables
- ✅ `verification.sql` - Comprehensive verification queries for each phase

### Helper Functions (`db/functions/`)
- ✅ `helpers.sql` - SQL utility functions:
  - User/Creator lookup by email
  - Revenue calculation
  - Affiliate tracking
  - Platform fee calculation
  - Auto-update triggers

### Application Code (`lib/`)
- ✅ `db-migration-helpers.ts` - TypeScript helpers for dual-format support:
  - `createUserDualFormat()` - Create users with both ID types
  - `getUserByEmailWithUuid()` - Fetch with UUID preference
  - `createIdFilter()` - Query helper for both formats
  - `checkMigrationProgress()` - Monitor migration status

### Testing (`tests/integration/`)
- ✅ `uuid-migration.test.ts` - Comprehensive integration tests:
  - UUID column creation validation
  - Foreign key relationship tests
  - Dual-format query support
  - Data integrity checks
  - Performance tests
  - Rollback tests

### CI/CD (`.github/workflows/`)
- ✅ `migrate-and-deploy.yml` - Automated pipeline:
  - Test migrations against Postgres container
  - Run integration tests
  - Deploy to staging/production
  - Health checks and notifications

### Documentation
- ✅ `db/README.md` - Complete migration guide with timeline
- ✅ `db/ROLLBACK_PLAYBOOK.md` - Emergency rollback procedures

---

## 🚀 Next Steps: Implementation Roadmap

### Phase 0: Preparation (1-2 hours)

- [ ] **Review all migration files:**
  ```powershell
  # Read through each file
  code db/migrations/001_add_uuid_columns.sql
  code db/migrations/002_add_uuid_constraints.sql
  code db/migrations/003_enable_rls.sql
  code db/ROLLBACK_PLAYBOOK.md
  ```

- [ ] **Install Supabase CLI:**
  ```powershell
  iwr -useb https://raw.githubusercontent.com/supabase/cli/main/install.ps1 | iex
  supabase --version
  ```

- [ ] **Link to your Supabase project:**
  ```powershell
  supabase login
  supabase link --project-ref YOUR_PROJECT_REF
  ```

- [ ] **Set up environment variables:**
  ```powershell
  # Add to .env.local
  DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
  DIRECT_DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"
  SHADOW_DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"
  ```

- [ ] **Create database backup:**
  - Go to Supabase Dashboard → Database → Backups
  - Click "Create backup"
  - Download backup locally

---

### Phase 1: Test on Staging (Day 0-2)

- [ ] **Create staging/test environment:**
  ```powershell
  # Option 1: Create new Supabase project for staging
  # Option 2: Use local Supabase instance
  supabase start
  ```

- [ ] **Run Phase 1 migration on staging:**
  ```powershell
  psql $env:DIRECT_DATABASE_URL -f db/migrations/001_add_uuid_columns.sql
  ```

- [ ] **Run verification queries:**
  ```powershell
  psql $env:DIRECT_DATABASE_URL -f db/migrations/verification.sql
  ```

- [ ] **Check for failures:**
  - NULL uuid values should be 0
  - Orphaned relationships should be 0
  - All indexes should exist

- [ ] **Test application on staging:**
  - Sign up new user
  - Create subscription
  - View content
  - All existing features work

- [ ] **Monitor for 24-48 hours**

---

### Phase 2: Production Phase 1 (Day 3)

- [ ] **Announce maintenance window (if needed):**
  - Email/notify users of migration
  - Schedule during low-traffic period

- [ ] **Create production backup:**
  - Supabase Dashboard → Backups → Create backup

- [ ] **Run Phase 1 on production:**
  ```powershell
  psql $env:PROD_DATABASE_URL -f db/migrations/001_add_uuid_columns.sql
  ```

- [ ] **Verify immediately:**
  ```powershell
  psql $env:PROD_DATABASE_URL -f db/migrations/verification.sql
  ```

- [ ] **Monitor application:**
  - Check Vercel logs
  - Check Supabase logs
  - Watch error rates
  - Verify no user-reported issues

- [ ] **Wait 24-48 hours before Phase 2**

---

### Phase 3: Update Application Code (Day 4-6)

- [ ] **Update Prisma schema:**
  ```prisma
  model User {
    id            String         @id @default(cuid())
    id_uuid       String?        @db.Uuid // ADD THIS
    email         String         @unique
    // ... rest
  }
  ```

- [ ] **Regenerate Prisma client:**
  ```powershell
  npx prisma generate
  ```

- [ ] **Update API routes to use dual-format helpers:**
  ```typescript
  import { createIdFilter } from '@/lib/db-migration-helpers';
  
  // Replace single-format queries
  const user = await prisma.user.findFirst({
    where: createIdFilter(userId)
  });
  ```

- [ ] **Deploy updated code:**
  ```powershell
  git add .
  git commit -m "feat: add UUID dual-format support"
  git push
  ```

- [ ] **Verify deployment:**
  - Test critical user flows
  - Check that both ID formats work
  - Monitor logs for errors

- [ ] **Monitor for 24-48 hours**

---

### Phase 4: Production Phase 2 (Day 9-11)

- [ ] **Run Phase 2 on staging first:**
  ```powershell
  psql $env:STAGING_DATABASE_URL -f db/migrations/002_add_uuid_constraints.sql
  ```

- [ ] **Verify staging Phase 2:**
  ```powershell
  psql $env:STAGING_DATABASE_URL -f db/migrations/verification.sql
  ```

- [ ] **Test application on staging with constraints**

- [ ] **Create fresh production backup**

- [ ] **Run Phase 2 on production:**
  ```powershell
  psql $env:PROD_DATABASE_URL -f db/migrations/002_add_uuid_constraints.sql
  ```

- [ ] **Verify production Phase 2:**
  ```powershell
  psql $env:PROD_DATABASE_URL -f db/migrations/verification.sql
  ```

- [ ] **Monitor closely for 24-48 hours:**
  - Foreign key violations?
  - Performance degradation?
  - User-reported issues?

---

### Phase 5: Enable RLS (Optional, Day 12)

- [ ] **Run RLS migration:**
  ```powershell
  psql $env:PROD_DATABASE_URL -f db/migrations/003_enable_rls.sql
  ```

- [ ] **Test RLS policies:**
  - Users can only see their own data
  - Creators can manage their content
  - Admins have full access

**Note:** Your app uses Prisma with service_role (bypasses RLS), so this is optional defense-in-depth.

---

### Phase 6: Cleanup (Day 30+)

- [ ] **Verify UUID migration is stable:**
  - No UUID-related errors for 30+ days
  - All queries use UUID columns
  - Performance is stable

- [ ] **Update Prisma schema to use UUID as primary:**
  ```prisma
  model User {
    id            String   @id @default(uuid()) @db.Uuid // Changed
    email         String   @unique
    // Remove id_legacy if you renamed old column
  }
  ```

- [ ] **Drop old TEXT id columns:**
  ```sql
  ALTER TABLE "User" DROP COLUMN id_legacy;
  ALTER TABLE "Creator" DROP COLUMN userId_legacy;
  -- etc.
  ```

- [ ] **Remove dual-format helper functions**

- [ ] **Update documentation**

---

## 🧪 Testing Checklist

### Before Each Phase

- [ ] Run verification queries
- [ ] Check database backup exists
- [ ] Test on staging first
- [ ] Review rollback plan

### After Each Phase

- [ ] Run verification queries again
- [ ] Test critical user flows manually
- [ ] Run integration test suite
- [ ] Check logs for errors
- [ ] Monitor performance metrics

### Critical User Flows to Test

- [ ] User sign up
- [ ] User sign in
- [ ] Create creator profile
- [ ] Create subscription plan
- [ ] Subscribe to creator
- [ ] Upload content
- [ ] View creator dashboard
- [ ] Process payment (test Stripe webhook)
- [ ] Request payout
- [ ] Admin views users
- [ ] Affiliate tracking

---

## 🚨 Rollback Triggers

Immediately rollback if:

- ❌ More than 5% of users report errors
- ❌ NULL uuid values found after backfill
- ❌ Orphaned relationships > 0
- ❌ Performance degrades > 50%
- ❌ Critical features broken (signup, payment, etc.)
- ❌ Data corruption detected

**See `db/ROLLBACK_PLAYBOOK.md` for detailed procedures.**

---

## 📊 Monitoring Dashboard

### Key Metrics to Watch

- **Error Rate:** Should stay < 0.1%
- **Response Time:** Should stay within 20% of baseline
- **Database Connections:** Should not exceed pool limit
- **Null UUIDs:** Should be 0 after Phase 1
- **Orphaned Records:** Should be 0 always

### Where to Monitor

- Vercel Dashboard: https://vercel.com/YOUR_ORG/YOUR_PROJECT
- Supabase Logs: https://app.supabase.com/project/YOUR_REF/logs
- Health Endpoint: https://yourdomain.com/api/health

---

## 🎯 Success Criteria

### Phase 1 Success
- ✅ All tables have uuid columns
- ✅ All existing rows have uuid values
- ✅ All FK uuid columns backfilled
- ✅ All indexes created
- ✅ Zero NULL uuids
- ✅ Zero orphaned relationships
- ✅ Application works normally

### Phase 2 Success
- ✅ All uuid columns have NOT NULL constraint
- ✅ UNIQUE constraints in place
- ✅ FK constraints created with CASCADE
- ✅ Application works with uuid queries
- ✅ Performance maintained
- ✅ Zero data integrity issues

### Final Success
- ✅ 30+ days of stable operation
- ✅ All queries use uuid
- ✅ Old TEXT columns dropped
- ✅ Integration tests passing
- ✅ Zero UUID-related errors
- ✅ Documentation updated

---

## 📞 Escalation Path

1. **Minor Issue:** Check verification queries, review logs
2. **Major Issue:** Execute appropriate rollback from playbook
3. **Critical Failure:** Restore from backup
4. **Need Help:** Contact Supabase support (support@supabase.io)

---

## 🎓 Additional Resources

- [Supabase Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL UUID Type](https://www.postgresql.org/docs/current/datatype-uuid.html)
- [Prisma UUID Migration Guide](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/customizing-migrations)
- [Zero-Downtime Migrations](https://www.braintreepayments.com/blog/safe-operations-for-high-volume-postgresql/)

---

## ✨ You're Ready!

All files are created and ready to use. Follow the phased approach above for a safe, zero-downtime migration to UUIDs.

**Recommended timeline: 30 days from start to completion**

Good luck! 🚀
