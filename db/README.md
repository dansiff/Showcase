# Supabase UUID Migration Guide

## 📋 Overview

This directory contains a complete, production-ready migration strategy to transition your database from text-based IDs (CUIDs) to UUIDs while maintaining zero downtime and data integrity.

### Migration Approach
- **Phased rollout**: Non-destructive Phase 1, then constrained Phase 2
- **Dual-format support**: Application works with both text and UUID during transition
- **Zero downtime**: No table locks or blocking operations
- **Rollback-safe**: Complete rollback playbook included
- **Test-driven**: Integration tests validate each phase

---

## 📁 Directory Structure

```
db/
├── migrations/
│   ├── 001_add_uuid_columns.sql      # Phase 1: Add UUID columns, backfill, index
│   ├── 002_add_uuid_constraints.sql  # Phase 2: Add constraints, promote UUIDs
│   ├── 003_enable_rls.sql            # Row-Level Security policies
│   └── verification.sql              # Verification queries for each phase
├── functions/
│   └── helpers.sql                   # SQL helper functions (revenue calc, etc.)
└── ROLLBACK_PLAYBOOK.md              # Emergency rollback procedures

lib/
└── db-migration-helpers.ts           # TypeScript helpers for dual-format queries

tests/
└── integration/
    └── uuid-migration.test.ts        # Integration tests for migration

.github/workflows/
└── migrate-and-deploy.yml            # CI/CD pipeline for migrations
```

---

## 🚀 Quick Start

### Prerequisites

1. **Install Supabase CLI:**
   ```powershell
   # Windows (PowerShell)
   iwr -useb https://raw.githubusercontent.com/supabase/cli/main/install.ps1 | iex
   
   # Verify installation
   supabase --version
   ```

2. **Link to your Supabase project:**
   ```powershell
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Set environment variables:**
   ```powershell
   # Copy .env.example to .env.local
   cp .env.example .env.local
   
   # Add your DATABASE_URL (pooled for runtime)
   $env:DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
   
   # Add DIRECT_DATABASE_URL (for migrations)
   $env:DIRECT_DATABASE_URL="postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres"
   ```

---

## 📖 Migration Phases

### Phase 1: Add UUID Columns (Non-Destructive)

**Duration:** ~5-15 minutes  
**Downtime:** None  
**Risk:** Low

#### What it does:
- Adds `id_uuid` columns to all tables
- Backfills existing rows with UUIDs
- Adds `*_uuid` foreign key columns
- Backfills FK relationships
- Creates indexes CONCURRENTLY (non-blocking)

#### Run Phase 1:

```powershell
# Local/staging test
psql $env:DIRECT_DATABASE_URL -f db/migrations/001_add_uuid_columns.sql

# OR via Supabase CLI
supabase db push -f db/migrations/001_add_uuid_columns.sql

# Verify Phase 1
psql $env:DIRECT_DATABASE_URL -f db/migrations/verification.sql
```

#### Verification checklist:
- [ ] All `id_uuid` columns have values (no NULLs)
- [ ] All FK UUID columns match parent UUIDs
- [ ] All UUID indexes created successfully
- [ ] No orphaned relationships
- [ ] Application still works (using text IDs)

**⏳ Wait 24-48 hours, monitor for issues before Phase 2**

---

### Phase 2: Add Constraints & Promote UUIDs

**Duration:** ~2-5 minutes  
**Downtime:** Brief (seconds during PK swap)  
**Risk:** Medium

#### What it does:
- Adds NOT NULL constraints to UUID columns
- Adds UNIQUE constraints
- Creates FOREIGN KEY constraints with CASCADE rules
- *Optional:* Promotes UUIDs to primary keys

#### Prerequisites:
- Phase 1 complete and verified
- Application code updated to write both formats
- 24-48 hour monitoring period passed
- All verification queries from Phase 1 return PASS

#### Run Phase 2:

```powershell
# IMPORTANT: Take backup first!
# Supabase Dashboard → Database → Backups → Create backup

# Run Phase 2 migration
psql $env:DIRECT_DATABASE_URL -f db/migrations/002_add_uuid_constraints.sql

# Verify Phase 2
psql $env:DIRECT_DATABASE_URL -f db/migrations/verification.sql
```

#### Verification checklist:
- [ ] All UUID columns have NOT NULL constraint
- [ ] UNIQUE constraints in place
- [ ] Foreign key constraints created
- [ ] Application works with UUIDs
- [ ] No performance degradation
- [ ] Cascading deletes work as expected

**⏳ Wait another 24-48 hours before dropping old TEXT columns**

---

### Phase 3: Enable RLS (Optional)

**Duration:** ~1 minute  
**Downtime:** None  
**Risk:** Low

#### What it does:
- Enables Row-Level Security on all tables
- Creates policies for user/role-based access
- Adds helper functions (is_admin, has_subscription_to, etc.)

#### Run Phase 3:

```powershell
psql $env:DIRECT_DATABASE_URL -f db/migrations/003_enable_rls.sql
```

**Note:** Your app uses Prisma with service_role (bypasses RLS). RLS provides defense-in-depth if you later use Supabase client libraries.

---

## 💻 Application Code Changes

### Update Prisma Schema

Add UUID columns to your schema (during Phase 1):

```prisma
model User {
  id            String         @id @default(cuid())
  id_uuid       String?        @db.Uuid // Add this
  email         String         @unique
  // ... rest of fields
}

model Creator {
  id            String   @id @default(cuid())
  id_uuid       String?  @db.Uuid // Add this
  userId        String   @unique
  userId_uuid   String?  @db.Uuid // Add this
  // ... rest of fields
}
```

Then regenerate Prisma client:

```powershell
npx prisma generate
```

### Use Dual-Format Helpers

```typescript
import { 
  createUserDualFormat, 
  getUserByEmailWithUuid,
  createIdFilter 
} from '@/lib/db-migration-helpers';

// Create user with both ID formats
const user = await createUserDualFormat({
  email: 'user@example.com',
  name: 'Test User',
});

// Query with either format
const found = await prisma.user.findFirst({
  where: createIdFilter(userId), // Works with UUID or text
});

// Get user with UUID support
const userWithUuid = await getUserByEmailWithUuid(email);
```

### Update API Routes

```typescript
// Before (text ID only):
const user = await prisma.user.findUnique({ 
  where: { id: textId } 
});

// During migration (dual format):
const user = await prisma.user.findFirst({ 
  where: createIdFilter(id) // Handles both
});

// After migration (UUID only):
const user = await prisma.user.findUnique({ 
  where: { id_uuid: uuid } 
});
```

---

## 🧪 Testing

### Run Integration Tests

```powershell
# Install test dependencies
npm install --save-dev @types/jest jest ts-jest

# Run tests
npm run test:integration
```

### Manual Testing Checklist

- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Create creator profile
- [ ] Create subscription
- [ ] Upload content
- [ ] View creator dashboard
- [ ] Process payment (Stripe webhook)
- [ ] Request payout
- [ ] Admin views all users

---

## 🚨 Rollback Procedures

See [`ROLLBACK_PLAYBOOK.md`](./ROLLBACK_PLAYBOOK.md) for detailed rollback procedures for each failure scenario:

- NULL UUID values after backfill
- Orphaned foreign key relationships
- Index creation failures
- Application breaking after Phase 2
- Performance degradation
- Data corruption
- Cannot drop old TEXT columns

**Emergency full rollback:**

```powershell
# See ROLLBACK_PLAYBOOK.md for complete steps
# Drops all UUID constraints, indexes, and columns

# Restore from backup (last resort)
supabase db restore <backup-id>
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

The included workflow (`.github/workflows/migrate-and-deploy.yml`) automatically:

1. Runs migrations against test database
2. Executes integration tests
3. Verifies data integrity
4. Deploys to staging/production
5. Sends notifications (Slack/Discord)

### Required Secrets

Add these to GitHub repo settings:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_STAGING_PROJECT_REF`
- `SUPABASE_PROD_PROJECT_REF`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SLACK_WEBHOOK_URL` (optional)

### Manual Trigger

```yaml
# Trigger via GitHub Actions UI:
# Actions → Database Migration & Deployment → Run workflow
# Select migration phase: phase1 | phase2 | rollback
```

---

## 📊 Monitoring

### Database Health Checks

```sql
-- Run verification queries
psql $env:DIRECT_DATABASE_URL -f db/migrations/verification.sql

-- Check migration progress
SELECT 
  table_name,
  total_rows,
  uuid_filled,
  percent_complete
FROM public.check_migration_progress();
```

### Application Health

```powershell
# Check Vercel logs
vercel logs --prod

# Check Supabase logs
# Dashboard → Logs → Database

# Health endpoint
curl https://yourdomain.com/api/health
```

---

## 📅 Recommended Timeline

| Day | Action | Duration |
|-----|--------|----------|
| Day 0 | Run Phase 1 on staging | 15 min |
| Day 1-2 | Monitor staging, verify data | 48 hrs |
| Day 3 | Run Phase 1 on production | 15 min |
| Day 4-5 | Monitor production, update app code | 48 hrs |
| Day 6 | Deploy dual-format app code | 30 min |
| Day 7-8 | Monitor app with dual format | 48 hrs |
| Day 9 | Run Phase 2 on staging | 5 min |
| Day 10 | Verify staging Phase 2 | 24 hrs |
| Day 11 | Run Phase 2 on production | 5 min |
| Day 12-14 | Monitor production with constraints | 72 hrs |
| Day 15 | Optional: Promote UUIDs to PKs | 10 min |
| Day 30+ | Drop old TEXT columns | 5 min |

**Total: ~30 days for safe, zero-downtime migration**

---

## 🛡️ Security Best Practices

1. **RLS Enabled:** All tables have row-level security policies
2. **Service Role:** Your Prisma connection bypasses RLS (controlled in code)
3. **Email-based auth:** User resolution by email (not Supabase user.id)
4. **Encrypted connections:** All DB URLs use `sslmode=require`
5. **Pooled connections:** Runtime uses port 6543 for serverless safety

---

## 🎯 Success Criteria

Migration is complete when:

- [ ] All tables have UUID columns with NOT NULL constraints
- [ ] All foreign key relationships use UUID columns
- [ ] All queries use UUID for joins and lookups
- [ ] Zero NULL UUIDs in database
- [ ] Zero orphaned relationships
- [ ] Application performance maintained
- [ ] All integration tests passing
- [ ] 30+ days of monitoring with no UUID-related errors
- [ ] Old TEXT columns can be safely dropped

---

## 📞 Support

If you encounter issues:

1. Check [`ROLLBACK_PLAYBOOK.md`](./ROLLBACK_PLAYBOOK.md)
2. Run verification queries: `psql -f db/migrations/verification.sql`
3. Review GitHub Actions logs
4. Check Supabase Dashboard → Logs
5. Contact Supabase support: support@supabase.io

---

## ✅ Verification Commands

```powershell
# Full verification suite
psql $env:DIRECT_DATABASE_URL -f db/migrations/verification.sql

# Quick checks
psql $env:DIRECT_DATABASE_URL -c "SELECT COUNT(*) FROM \"User\" WHERE id_uuid IS NULL;"

# Index check
psql $env:DIRECT_DATABASE_URL -c "SELECT indexname FROM pg_indexes WHERE indexname LIKE '%uuid%';"

# FK constraint check
psql $env:DIRECT_DATABASE_URL -c "SELECT constraint_name FROM information_schema.table_constraints WHERE constraint_name LIKE '%uuid%';"
```

---

## 🎉 Migration Complete!

Once all phases are complete and verified:

1. Update Prisma schema to use UUID as `@id`
2. Remove dual-format helper functions
3. Drop old TEXT id columns
4. Celebrate zero-downtime migration success! 🚀

For questions or improvements to this migration guide, please open an issue or PR.
