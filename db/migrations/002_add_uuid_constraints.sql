-- ========================================
-- PHASE 2: ADD CONSTRAINTS + PROMOTE UUID PKs
-- ========================================
-- Purpose: Add NOT NULL and FK constraints to UUID columns,
--          then promote UUID columns to primary keys.
-- 
-- PREREQUISITES:
-- - Phase 1 complete and verified
-- - Application code updated to write both id formats
-- - 24-48 hour monitoring period passed
-- - All verification queries from Phase 1 return 0
--
-- ⚠️ WARNING: This migration includes DDL changes that may
--    briefly lock tables. Schedule during low-traffic window.
--
-- Estimated duration: ~2-5 minutes
-- Locking: Brief exclusive locks during constraint/PK changes
-- ========================================

-- ========================================
-- 1. ADD NOT NULL CONSTRAINTS TO UUID COLUMNS
-- ========================================

BEGIN;

-- Parent table id_uuid columns
ALTER TABLE "User" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Creator" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Plan" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Subscription" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Content" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Post" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "PostLike" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Profile" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "PayoutRequest" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "ClientIntake" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Affiliate" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "Referral" ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE "AffiliatePayout" ALTER COLUMN id_uuid SET NOT NULL;

-- Foreign key UUID columns
ALTER TABLE "Profile" ALTER COLUMN userId_uuid SET NOT NULL;
ALTER TABLE "Creator" ALTER COLUMN userId_uuid SET NOT NULL;
ALTER TABLE "Plan" ALTER COLUMN creatorId_uuid SET NOT NULL;
ALTER TABLE "Subscription" ALTER COLUMN userId_uuid SET NOT NULL;
ALTER TABLE "Subscription" ALTER COLUMN planId_uuid SET NOT NULL;
ALTER TABLE "Content" ALTER COLUMN creatorId_uuid SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN userId_uuid SET NOT NULL;
ALTER TABLE "Post" ALTER COLUMN authorId_uuid SET NOT NULL;
ALTER TABLE "PostLike" ALTER COLUMN postId_uuid SET NOT NULL;
ALTER TABLE "PostLike" ALTER COLUMN userId_uuid SET NOT NULL;
ALTER TABLE "PayoutRequest" ALTER COLUMN creatorId_uuid SET NOT NULL;
-- Affiliate.userId_uuid is nullable (optional)
ALTER TABLE "Referral" ALTER COLUMN affiliateId_uuid SET NOT NULL;
-- Referral.referredUserId_uuid is nullable (optional)
ALTER TABLE "AffiliatePayout" ALTER COLUMN affiliateId_uuid SET NOT NULL;

COMMIT;

-- ========================================
-- 2. ADD UNIQUE CONSTRAINTS TO UUID COLUMNS
-- ========================================

BEGIN;

-- Add unique constraints where needed (mirrors current TEXT id uniqueness)
ALTER TABLE "User" ADD CONSTRAINT user_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Creator" ADD CONSTRAINT creator_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Plan" ADD CONSTRAINT plan_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Subscription" ADD CONSTRAINT subscription_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Content" ADD CONSTRAINT content_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Payment" ADD CONSTRAINT payment_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Post" ADD CONSTRAINT post_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "PostLike" ADD CONSTRAINT postlike_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Profile" ADD CONSTRAINT profile_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Profile" ADD CONSTRAINT profile_userId_uuid_unique UNIQUE (userId_uuid);
ALTER TABLE "PayoutRequest" ADD CONSTRAINT payoutrequest_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "ClientIntake" ADD CONSTRAINT clientintake_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Affiliate" ADD CONSTRAINT affiliate_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "Referral" ADD CONSTRAINT referral_id_uuid_unique UNIQUE (id_uuid);
ALTER TABLE "AffiliatePayout" ADD CONSTRAINT affiliatepayout_id_uuid_unique UNIQUE (id_uuid);

-- Composite unique constraint for PostLike (postId_uuid, userId_uuid)
ALTER TABLE "PostLike" ADD CONSTRAINT postlike_post_user_uuid_unique UNIQUE (postId_uuid, userId_uuid);

COMMIT;

-- ========================================
-- 3. ADD FOREIGN KEY CONSTRAINTS
-- ========================================

BEGIN;

-- Profile → User
ALTER TABLE "Profile" 
  ADD CONSTRAINT profile_user_fk_uuid 
  FOREIGN KEY (userId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE CASCADE;

-- Creator → User
ALTER TABLE "Creator" 
  ADD CONSTRAINT creator_user_fk_uuid 
  FOREIGN KEY (userId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE CASCADE;

-- Plan → Creator
ALTER TABLE "Plan" 
  ADD CONSTRAINT plan_creator_fk_uuid 
  FOREIGN KEY (creatorId_uuid) 
  REFERENCES "Creator"(id_uuid) 
  ON DELETE CASCADE;

-- Subscription → User and Plan
ALTER TABLE "Subscription" 
  ADD CONSTRAINT subscription_user_fk_uuid 
  FOREIGN KEY (userId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE CASCADE;

ALTER TABLE "Subscription" 
  ADD CONSTRAINT subscription_plan_fk_uuid 
  FOREIGN KEY (planId_uuid) 
  REFERENCES "Plan"(id_uuid) 
  ON DELETE CASCADE;

-- Content → Creator
ALTER TABLE "Content" 
  ADD CONSTRAINT content_creator_fk_uuid 
  FOREIGN KEY (creatorId_uuid) 
  REFERENCES "Creator"(id_uuid) 
  ON DELETE CASCADE;

-- Payment → User
ALTER TABLE "Payment" 
  ADD CONSTRAINT payment_user_fk_uuid 
  FOREIGN KEY (userId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE CASCADE;

-- Post → User
ALTER TABLE "Post" 
  ADD CONSTRAINT post_author_fk_uuid 
  FOREIGN KEY (authorId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE CASCADE;

-- PostLike → Post and User
ALTER TABLE "PostLike" 
  ADD CONSTRAINT postlike_post_fk_uuid 
  FOREIGN KEY (postId_uuid) 
  REFERENCES "Post"(id_uuid) 
  ON DELETE CASCADE;

ALTER TABLE "PostLike" 
  ADD CONSTRAINT postlike_user_fk_uuid 
  FOREIGN KEY (userId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE CASCADE;

-- PayoutRequest → Creator
ALTER TABLE "PayoutRequest" 
  ADD CONSTRAINT payoutrequest_creator_fk_uuid 
  FOREIGN KEY (creatorId_uuid) 
  REFERENCES "Creator"(id_uuid) 
  ON DELETE CASCADE;

-- Affiliate → User (nullable, so SET NULL on delete)
ALTER TABLE "Affiliate" 
  ADD CONSTRAINT affiliate_user_fk_uuid 
  FOREIGN KEY (userId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE SET NULL;

-- Referral → Affiliate and User
ALTER TABLE "Referral" 
  ADD CONSTRAINT referral_affiliate_fk_uuid 
  FOREIGN KEY (affiliateId_uuid) 
  REFERENCES "Affiliate"(id_uuid) 
  ON DELETE CASCADE;

ALTER TABLE "Referral" 
  ADD CONSTRAINT referral_referred_user_fk_uuid 
  FOREIGN KEY (referredUserId_uuid) 
  REFERENCES "User"(id_uuid) 
  ON DELETE SET NULL;

-- AffiliatePayout → Affiliate
ALTER TABLE "AffiliatePayout" 
  ADD CONSTRAINT affiliatepayout_affiliate_fk_uuid 
  FOREIGN KEY (affiliateId_uuid) 
  REFERENCES "Affiliate"(id_uuid) 
  ON DELETE CASCADE;

COMMIT;

-- ========================================
-- 4. VERIFICATION BEFORE CUTOVER
-- ========================================

-- Verify all constraints are in place
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.constraint_type IN ('FOREIGN KEY', 'UNIQUE')
  AND tc.table_name IN (
    'User', 'Creator', 'Plan', 'Subscription', 'Content', 
    'Payment', 'Post', 'PostLike', 'Profile', 'PayoutRequest',
    'ClientIntake', 'Affiliate', 'Referral', 'AffiliatePayout'
  )
  AND tc.constraint_name LIKE '%uuid%'
ORDER BY tc.table_name, tc.constraint_type;

-- ========================================
-- 5. OPTIONAL: PROMOTE UUID TO PRIMARY KEY
-- ========================================
-- ⚠️ THIS IS THE BREAKING CHANGE
-- Only run after:
-- 1. All application code is using UUID columns
-- 2. Old TEXT id columns are no longer referenced
-- 3. You have a verified rollback plan
--
-- To promote UUIDs to PKs, run these steps for each table:
-- (Example for User table - repeat for all tables)

-- DROP old PK and create new UUID PK
-- ALTER TABLE "User" DROP CONSTRAINT "User_pkey";
-- ALTER TABLE "User" ADD PRIMARY KEY (id_uuid);

-- Optionally rename id_uuid → id and old id → id_legacy
-- ALTER TABLE "User" RENAME COLUMN id TO id_legacy;
-- ALTER TABLE "User" RENAME COLUMN id_uuid TO id;

-- ========================================
-- PHASE 2 COMPLETE
-- ========================================
-- ✅ NOT NULL constraints added to all UUID columns
-- ✅ UNIQUE constraints added where needed
-- ✅ Foreign key constraints added with proper CASCADE rules
-- ✅ Data integrity verified
--
-- NEXT STEPS (OPTIONAL):
-- 1. Monitor for 24-48 hours with constraints active
-- 2. Update Prisma schema to use UUID as @id
-- 3. Run Prisma migration to sync schema
-- 4. Promote UUID columns to primary keys (breaking change)
-- 5. Drop old TEXT id columns after cutover period
-- ========================================
