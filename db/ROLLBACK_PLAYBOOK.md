# UUID Migration Rollback Playbook

## Overview
This document provides step-by-step rollback procedures for common failure scenarios during the UUID migration process.

## Pre-Rollback Checklist
- [ ] Identify the specific failure point (Phase 1, Phase 2, or application code)
- [ ] Take a database backup (Supabase Dashboard → Database → Backups)
- [ ] Document the error messages and affected tables
- [ ] Notify team and users if rollback will cause downtime

## Failure Scenarios & Rollbacks

### Scenario 1: NULL UUID Values After Backfill

**Symptoms:**
- Verification queries show non-zero NULL counts
- Application errors: "id_uuid cannot be null"

**Diagnosis:**
```sql
SELECT 'User' as table_name, COUNT(*) as null_count 
FROM "User" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Creator', COUNT(*) FROM "Creator" WHERE id_uuid IS NULL;
```

**Rollback:**
```sql
BEGIN;

-- Re-run backfill for affected tables
UPDATE "User" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Creator" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;

-- Verify
SELECT COUNT(*) FROM "User" WHERE id_uuid IS NULL;
-- Should return 0

COMMIT;
```

**Prevention:**
- Run Phase 1 in smaller batches
- Check for concurrent writes during migration

---

### Scenario 2: Orphaned Foreign Key Relationships

**Symptoms:**
- Verification queries show orphaned records
- FK constraint creation fails in Phase 2

**Diagnosis:**
```sql
-- Find orphaned Profile records
SELECT p.id, p."userId", p.userId_uuid
FROM "Profile" p
LEFT JOIN "User" u ON p.userId_uuid = u.id_uuid
WHERE u.id_uuid IS NULL;

-- Find orphaned Subscription records
SELECT s.id, s."userId", s.userId_uuid
FROM "Subscription" s
LEFT JOIN "User" u ON s.userId_uuid = u.id_uuid
WHERE u.id_uuid IS NULL;
```

**Rollback:**
```sql
BEGIN;

-- Option 1: Re-backfill orphaned records
UPDATE "Profile" p
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE p."userId" = u.id AND p.userId_uuid IS NULL;

-- Option 2: Delete orphaned records (use with caution!)
-- DELETE FROM "Profile" 
-- WHERE userId_uuid NOT IN (SELECT id_uuid FROM "User");

COMMIT;
```

**Prevention:**
- Run orphan checks before Phase 2
- Fix data integrity issues first
- Use transactions for backfill operations

---

### Scenario 3: Index Creation Fails (CONCURRENTLY)

**Symptoms:**
- `CREATE INDEX CONCURRENTLY` hangs or fails
- Error: "deadlock detected" or "index already exists"

**Diagnosis:**
```sql
-- Check for existing indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE indexname LIKE '%uuid%';

-- Check for locks
SELECT * FROM pg_stat_activity 
WHERE state = 'active' AND query LIKE '%CREATE INDEX%';
```

**Rollback:**
```sql
-- Drop partially created indexes
DROP INDEX CONCURRENTLY IF EXISTS idx_user_id_uuid;
DROP INDEX CONCURRENTLY IF EXISTS idx_creator_id_uuid;

-- Retry with smaller batch or during low-traffic period
-- Re-run index creation from migration file
```

**Prevention:**
- Run index creation during low-traffic hours
- Monitor `pg_stat_activity` for locks
- Use `CONCURRENTLY` to avoid blocking reads

---

### Scenario 4: Application Breaking After Phase 2

**Symptoms:**
- 500 errors on user-facing pages
- Prisma errors: "Unknown field id_uuid"
- FK violations on new inserts

**Diagnosis:**
```bash
# Check application logs
npm run dev
# Look for Prisma or database connection errors

# Verify schema sync
npx prisma validate
npx prisma db pull
```

**Rollback:**
```sql
BEGIN;

-- Temporarily remove NOT NULL constraints
ALTER TABLE "User" ALTER COLUMN id_uuid DROP NOT NULL;
ALTER TABLE "Creator" ALTER COLUMN id_uuid DROP NOT NULL;

-- Remove FK constraints
ALTER TABLE "Profile" DROP CONSTRAINT IF EXISTS profile_user_fk_uuid;
ALTER TABLE "Creator" DROP CONSTRAINT IF EXISTS creator_user_fk_uuid;

-- Remove unique constraints
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS user_id_uuid_unique;

COMMIT;
```

**Application-Side Rollback:**
```bash
# Revert application code changes
git revert <commit-hash>

# Regenerate Prisma client with old schema
npx prisma generate

# Restart application
npm run build
npm start
```

**Prevention:**
- Test on staging environment first
- Use feature flags for dual-format code
- Deploy application changes before Phase 2

---

### Scenario 5: Performance Degradation

**Symptoms:**
- Queries slower after migration
- High CPU/memory usage
- Timeout errors

**Diagnosis:**
```sql
-- Check query performance
EXPLAIN ANALYZE 
SELECT * FROM "User" WHERE id_uuid = 'some-uuid';

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE indexname LIKE '%uuid%'
ORDER BY idx_scan DESC;

-- Check table bloat
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Rollback:**
```sql
-- Rebuild indexes
REINDEX INDEX CONCURRENTLY idx_user_id_uuid;
REINDEX INDEX CONCURRENTLY idx_creator_id_uuid;

-- Analyze tables for query planner
ANALYZE "User";
ANALYZE "Creator";
ANALYZE "Subscription";

-- Vacuum if needed
VACUUM ANALYZE "User";
```

**Prevention:**
- Monitor query performance before/after
- Use `EXPLAIN ANALYZE` on critical queries
- Schedule VACUUM/ANALYZE after large migrations

---

### Scenario 6: Data Corruption (UUIDs Don't Match)

**Symptoms:**
- Users can't access their data
- Subscription lookups fail
- FK joins return unexpected results

**Diagnosis:**
```sql
-- Verify UUID consistency between parent/child tables
SELECT 
  u.id, u.id_uuid, u.email,
  c.id, c.id_uuid, c."userId", c.userId_uuid
FROM "User" u
JOIN "Creator" c ON u.id = c."userId"
WHERE u.id_uuid != c.userId_uuid
LIMIT 10;
```

**Rollback:**
```sql
BEGIN;

-- Re-backfill all FK UUID columns from scratch
UPDATE "Creator" c
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE c."userId" = u.id;

UPDATE "Profile" p
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE p."userId" = u.id;

UPDATE "Subscription" s
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE s."userId" = u.id;

UPDATE "Subscription" s
SET planId_uuid = pl.id_uuid
FROM "Plan" pl
WHERE s."planId" = pl.id;

-- Verify fix
SELECT COUNT(*) FROM "Creator" c
JOIN "User" u ON c."userId" = u.id
WHERE c.userId_uuid != u.id_uuid;
-- Should return 0

COMMIT;
```

**Prevention:**
- Never manually edit UUID columns
- Always backfill via JOIN on text IDs
- Verify data integrity before Phase 2

---

### Scenario 7: Cannot Drop Old Text ID Columns

**Symptoms:**
- Error: "column is referenced by foreign key constraint"
- Application still using text IDs

**Diagnosis:**
```sql
-- Find remaining FK constraints on text columns
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name NOT LIKE '%uuid%';
```

**Rollback:**
```sql
-- Don't drop text columns yet!
-- Keep them until 100% confident in UUID migration

-- Optional: Add comment to indicate deprecation
COMMENT ON COLUMN "User".id IS 'DEPRECATED: Use id_uuid instead';
COMMENT ON COLUMN "Creator"."userId" IS 'DEPRECATED: Use userId_uuid instead';
```

**Prevention:**
- Keep text columns for 30-90 days after cutover
- Only drop after monitoring confirms no usage
- Update all external integrations first

---

## Emergency Full Rollback

If all else fails and you need to completely revert the migration:

```sql
BEGIN;

-- Drop all UUID FK constraints
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT constraint_name, table_name
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
      AND constraint_name LIKE '%uuid%'
  ) LOOP
    EXECUTE 'ALTER TABLE "' || r.table_name || '" DROP CONSTRAINT IF EXISTS ' || r.constraint_name;
  END LOOP;
END $$;

-- Drop all UUID unique constraints
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT constraint_name, table_name
    FROM information_schema.table_constraints
    WHERE constraint_type = 'UNIQUE'
      AND constraint_name LIKE '%uuid%'
  ) LOOP
    EXECUTE 'ALTER TABLE "' || r.table_name || '" DROP CONSTRAINT IF EXISTS ' || r.constraint_name;
  END LOOP;
END $$;

-- Drop all UUID indexes
DROP INDEX CONCURRENTLY IF EXISTS idx_user_id_uuid;
DROP INDEX CONCURRENTLY IF EXISTS idx_creator_id_uuid;
DROP INDEX CONCURRENTLY IF EXISTS idx_profile_userId_uuid;
-- ... (repeat for all UUID indexes)

-- Drop all UUID columns (destructive!)
ALTER TABLE "User" DROP COLUMN IF EXISTS id_uuid;
ALTER TABLE "Creator" DROP COLUMN IF EXISTS id_uuid;
ALTER TABLE "Creator" DROP COLUMN IF EXISTS userId_uuid;
-- ... (repeat for all UUID columns)

COMMIT;

-- Revert Prisma schema to original
-- git checkout <previous-commit> prisma/schema.prisma
-- npx prisma db push --skip-generate
-- npx prisma generate
```

---

## Post-Rollback Verification

After any rollback:

1. **Test critical user flows:**
   - Sign up / Sign in
   - Create subscription
   - Upload content
   - View creator profiles

2. **Run integration tests:**
   ```bash
   npm run test:integration
   ```

3. **Check database health:**
   ```sql
   -- Check for broken FKs
   SELECT * FROM pg_constraint WHERE contype = 'f' AND convalidated = false;
   
   -- Verify row counts
   SELECT 'User', COUNT(*) FROM "User"
   UNION ALL SELECT 'Creator', COUNT(*) FROM "Creator"
   UNION ALL SELECT 'Subscription', COUNT(*) FROM "Subscription";
   ```

4. **Monitor error logs for 24 hours**

---

## Contact & Escalation

If rollback fails or data is at risk:

1. **Immediate:**
   - Stop all migrations
   - Take database snapshot (Supabase Dashboard)
   - Contact Supabase support (support@supabase.io)

2. **Document:**
   - Error messages
   - Steps attempted
   - Current database state

3. **Restore from backup if needed:**
   ```bash
   # Via Supabase Dashboard or CLI
   supabase db restore <backup-id>
   ```

---

## Lessons Learned Checklist

After resolving any failure:

- [ ] Document root cause in team wiki
- [ ] Update migration scripts to prevent recurrence
- [ ] Add verification step to CI/CD
- [ ] Review with team in post-mortem
- [ ] Update this playbook with new scenarios
