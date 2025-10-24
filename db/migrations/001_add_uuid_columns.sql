-- ========================================
-- PHASE 1: ADD UUID COLUMNS + BACKFILL + INDEX
-- ========================================
-- Purpose: Add id_uuid columns to all tables, backfill existing rows,
--          and create indexes without blocking reads/writes.
-- 
-- SAFE TO RUN: This migration is NON-DESTRUCTIVE and idempotent.
-- Run this first, verify data integrity, then run phase 2.
--
-- Estimated duration: ~5-15 minutes depending on row counts
-- Locking: Minimal (CONCURRENT indexes only briefly lock)
-- ========================================

BEGIN;

-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- 1. ADD UUID COLUMNS TO PARENT TABLES
-- ========================================

-- User table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "User" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Creator table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Creator' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Creator" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Plan table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Plan' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Plan" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Subscription table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Subscription' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Subscription" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Content table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Content' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Content" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Payment table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Payment' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Payment" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Post table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Post' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Post" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- PostLike table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'PostLike' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "PostLike" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Profile table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Profile' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Profile" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- PayoutRequest table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'PayoutRequest' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "PayoutRequest" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- ClientIntake table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ClientIntake' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "ClientIntake" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Affiliate table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Affiliate' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Affiliate" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Referral table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Referral' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "Referral" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- AffiliatePayout table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AffiliatePayout' AND column_name = 'id_uuid'
  ) THEN
    ALTER TABLE "AffiliatePayout" ADD COLUMN id_uuid UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

COMMIT;

-- ========================================
-- 2. BACKFILL UUID VALUES (if null)
-- ========================================
-- Run after commit to avoid long transactions

BEGIN;

UPDATE "User" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Creator" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Plan" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Subscription" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Content" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Payment" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Post" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "PostLike" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Profile" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "PayoutRequest" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "ClientIntake" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Affiliate" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "Referral" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE "AffiliatePayout" SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;

COMMIT;

-- ========================================
-- 3. ADD FOREIGN KEY UUID COLUMNS
-- ========================================

BEGIN;

-- Profile.userId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Profile' AND column_name = 'userId_uuid'
  ) THEN
    ALTER TABLE "Profile" ADD COLUMN userId_uuid UUID;
  END IF;
END $$;

-- Creator.userId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Creator' AND column_name = 'userId_uuid'
  ) THEN
    ALTER TABLE "Creator" ADD COLUMN userId_uuid UUID;
  END IF;
END $$;

-- Plan.creatorId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Plan' AND column_name = 'creatorId_uuid'
  ) THEN
    ALTER TABLE "Plan" ADD COLUMN creatorId_uuid UUID;
  END IF;
END $$;

-- Subscription.userId_uuid and planId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Subscription' AND column_name = 'userId_uuid'
  ) THEN
    ALTER TABLE "Subscription" ADD COLUMN userId_uuid UUID;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Subscription' AND column_name = 'planId_uuid'
  ) THEN
    ALTER TABLE "Subscription" ADD COLUMN planId_uuid UUID;
  END IF;
END $$;

-- Content.creatorId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Content' AND column_name = 'creatorId_uuid'
  ) THEN
    ALTER TABLE "Content" ADD COLUMN creatorId_uuid UUID;
  END IF;
END $$;

-- Payment.userId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Payment' AND column_name = 'userId_uuid'
  ) THEN
    ALTER TABLE "Payment" ADD COLUMN userId_uuid UUID;
  END IF;
END $$;

-- Post.authorId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Post' AND column_name = 'authorId_uuid'
  ) THEN
    ALTER TABLE "Post" ADD COLUMN authorId_uuid UUID;
  END IF;
END $$;

-- PostLike.postId_uuid and userId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'PostLike' AND column_name = 'postId_uuid'
  ) THEN
    ALTER TABLE "PostLike" ADD COLUMN postId_uuid UUID;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'PostLike' AND column_name = 'userId_uuid'
  ) THEN
    ALTER TABLE "PostLike" ADD COLUMN userId_uuid UUID;
  END IF;
END $$;

-- PayoutRequest.creatorId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'PayoutRequest' AND column_name = 'creatorId_uuid'
  ) THEN
    ALTER TABLE "PayoutRequest" ADD COLUMN creatorId_uuid UUID;
  END IF;
END $$;

-- Affiliate.userId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Affiliate' AND column_name = 'userId_uuid'
  ) THEN
    ALTER TABLE "Affiliate" ADD COLUMN userId_uuid UUID;
  END IF;
END $$;

-- Referral.affiliateId_uuid and referredUserId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Referral' AND column_name = 'affiliateId_uuid'
  ) THEN
    ALTER TABLE "Referral" ADD COLUMN affiliateId_uuid UUID;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Referral' AND column_name = 'referredUserId_uuid'
  ) THEN
    ALTER TABLE "Referral" ADD COLUMN referredUserId_uuid UUID;
  END IF;
END $$;

-- AffiliatePayout.affiliateId_uuid
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AffiliatePayout' AND column_name = 'affiliateId_uuid'
  ) THEN
    ALTER TABLE "AffiliatePayout" ADD COLUMN affiliateId_uuid UUID;
  END IF;
END $$;

COMMIT;

-- ========================================
-- 4. BACKFILL FOREIGN KEY UUID COLUMNS
-- ========================================

BEGIN;

-- Profile.userId_uuid from User.id → User.id_uuid
UPDATE "Profile" p
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE p."userId" = u.id AND p.userId_uuid IS NULL;

-- Creator.userId_uuid
UPDATE "Creator" c
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE c."userId" = u.id AND c.userId_uuid IS NULL;

-- Plan.creatorId_uuid
UPDATE "Plan" pl
SET creatorId_uuid = c.id_uuid
FROM "Creator" c
WHERE pl."creatorId" = c.id AND pl.creatorId_uuid IS NULL;

-- Subscription.userId_uuid and planId_uuid
UPDATE "Subscription" s
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE s."userId" = u.id AND s.userId_uuid IS NULL;

UPDATE "Subscription" s
SET planId_uuid = pl.id_uuid
FROM "Plan" pl
WHERE s."planId" = pl.id AND s.planId_uuid IS NULL;

-- Content.creatorId_uuid
UPDATE "Content" co
SET creatorId_uuid = c.id_uuid
FROM "Creator" c
WHERE co."creatorId" = c.id AND co.creatorId_uuid IS NULL;

-- Payment.userId_uuid
UPDATE "Payment" pay
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE pay."userId" = u.id AND pay.userId_uuid IS NULL;

-- Post.authorId_uuid
UPDATE "Post" po
SET authorId_uuid = u.id_uuid
FROM "User" u
WHERE po."authorId" = u.id AND po.authorId_uuid IS NULL;

-- PostLike.postId_uuid and userId_uuid
UPDATE "PostLike" pl
SET postId_uuid = p.id_uuid
FROM "Post" p
WHERE pl."postId" = p.id AND pl.postId_uuid IS NULL;

UPDATE "PostLike" pl
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE pl."userId" = u.id AND pl.userId_uuid IS NULL;

-- PayoutRequest.creatorId_uuid
UPDATE "PayoutRequest" pr
SET creatorId_uuid = c.id_uuid
FROM "Creator" c
WHERE pr."creatorId" = c.id AND pr.creatorId_uuid IS NULL;

-- Affiliate.userId_uuid
UPDATE "Affiliate" a
SET userId_uuid = u.id_uuid
FROM "User" u
WHERE a."userId" = u.id AND a.userId_uuid IS NULL;

-- Referral.affiliateId_uuid and referredUserId_uuid
UPDATE "Referral" r
SET affiliateId_uuid = a.id_uuid
FROM "Affiliate" a
WHERE r."affiliateId" = a.id AND r.affiliateId_uuid IS NULL;

UPDATE "Referral" r
SET referredUserId_uuid = u.id_uuid
FROM "User" u
WHERE r."referredUserId" = u.id AND r.referredUserId_uuid IS NULL;

-- AffiliatePayout.affiliateId_uuid
UPDATE "AffiliatePayout" ap
SET affiliateId_uuid = a.id_uuid
FROM "Affiliate" a
WHERE ap."affiliateId" = a.id AND ap.affiliateId_uuid IS NULL;

COMMIT;

-- ========================================
-- 5. CREATE INDEXES CONCURRENTLY
-- ========================================
-- IMPORTANT: These must run OUTSIDE of a transaction
-- Run each separately or use a script to execute sequentially

-- Primary UUID indexes (will become PKs in phase 2)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_id_uuid ON "User"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_creator_id_uuid ON "Creator"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plan_id_uuid ON "Plan"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_id_uuid ON "Subscription"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_id_uuid ON "Content"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_id_uuid ON "Payment"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_id_uuid ON "Post"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_postlike_id_uuid ON "PostLike"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profile_id_uuid ON "Profile"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payoutrequest_id_uuid ON "PayoutRequest"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clientintake_id_uuid ON "ClientIntake"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_id_uuid ON "Affiliate"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referral_id_uuid ON "Referral"(id_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliatepayout_id_uuid ON "AffiliatePayout"(id_uuid);

-- Foreign key UUID indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profile_userId_uuid ON "Profile"(userId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_creator_userId_uuid ON "Creator"(userId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plan_creatorId_uuid ON "Plan"(creatorId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_userId_uuid ON "Subscription"(userId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_planId_uuid ON "Subscription"(planId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_creatorId_uuid ON "Content"(creatorId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_userId_uuid ON "Payment"(userId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_post_authorId_uuid ON "Post"(authorId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_postlike_postId_uuid ON "PostLike"(postId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_postlike_userId_uuid ON "PostLike"(userId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payoutrequest_creatorId_uuid ON "PayoutRequest"(creatorId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_userId_uuid ON "Affiliate"(userId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referral_affiliateId_uuid ON "Referral"(affiliateId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referral_referredUserId_uuid ON "Referral"(referredUserId_uuid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliatepayout_affiliateId_uuid ON "AffiliatePayout"(affiliateId_uuid);

-- ========================================
-- 6. VERIFICATION QUERIES
-- ========================================
-- Run these to ensure data integrity before phase 2

-- Check for any NULL uuid values (should return 0 for all)
SELECT 'User' as table_name, COUNT(*) as null_count FROM "User" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Creator', COUNT(*) FROM "Creator" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Plan', COUNT(*) FROM "Plan" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Subscription', COUNT(*) FROM "Subscription" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Content', COUNT(*) FROM "Content" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Payment', COUNT(*) FROM "Payment" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Post', COUNT(*) FROM "Post" WHERE id_uuid IS NULL
UNION ALL
SELECT 'PostLike', COUNT(*) FROM "PostLike" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Profile', COUNT(*) FROM "Profile" WHERE id_uuid IS NULL OR userId_uuid IS NULL
UNION ALL
SELECT 'PayoutRequest', COUNT(*) FROM "PayoutRequest" WHERE id_uuid IS NULL OR creatorId_uuid IS NULL
UNION ALL
SELECT 'Affiliate', COUNT(*) FROM "Affiliate" WHERE id_uuid IS NULL
UNION ALL
SELECT 'Referral', COUNT(*) FROM "Referral" WHERE id_uuid IS NULL OR affiliateId_uuid IS NULL
UNION ALL
SELECT 'AffiliatePayout', COUNT(*) FROM "AffiliatePayout" WHERE id_uuid IS NULL OR affiliateId_uuid IS NULL;

-- Check for orphaned FK relationships (should return 0 for all)
SELECT 'Profile orphans' as check_name, COUNT(*) as count
FROM "Profile" p
LEFT JOIN "User" u ON p.userId_uuid = u.id_uuid
WHERE u.id_uuid IS NULL

UNION ALL

SELECT 'Creator orphans', COUNT(*)
FROM "Creator" c
LEFT JOIN "User" u ON c.userId_uuid = u.id_uuid
WHERE u.id_uuid IS NULL

UNION ALL

SELECT 'Subscription user orphans', COUNT(*)
FROM "Subscription" s
LEFT JOIN "User" u ON s.userId_uuid = u.id_uuid
WHERE u.id_uuid IS NULL;

-- ========================================
-- PHASE 1 COMPLETE
-- ========================================
-- ✅ UUID columns added to all tables
-- ✅ Existing rows backfilled with UUIDs
-- ✅ Foreign key UUID columns added and backfilled
-- ✅ Indexes created (CONCURRENTLY to avoid locks)
--
-- NEXT STEPS:
-- 1. Run verification queries above
-- 2. Monitor application for 24-48 hours
-- 3. Update application code to write both formats
-- 4. Run Phase 2 migration (add constraints, promote UUIDs to PKs)
-- ========================================
