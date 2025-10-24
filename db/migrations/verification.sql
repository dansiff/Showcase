-- ========================================
-- MIGRATION VERIFICATION QUERIES
-- ========================================
-- Run these queries to verify migration success at each phase
-- ========================================

\echo '========================================';
\echo 'PHASE 1 VERIFICATION';
\echo '========================================';

-- Check for NULL uuid values (should return 0 for all)
\echo '\n1. Checking for NULL uuid values...';
SELECT 
  table_name, 
  null_count,
  CASE 
    WHEN null_count = 0 THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status
FROM (
  SELECT 'User' as table_name, COUNT(*) as null_count FROM "User" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Creator', COUNT(*) FROM "Creator" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Plan', COUNT(*) FROM "Plan" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Subscription', COUNT(*) FROM "Subscription" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Content', COUNT(*) FROM "Content" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Payment', COUNT(*) FROM "Payment" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Post', COUNT(*) FROM "Post" WHERE id_uuid IS NULL
  UNION ALL SELECT 'PostLike', COUNT(*) FROM "PostLike" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Profile', COUNT(*) FROM "Profile" WHERE id_uuid IS NULL OR userId_uuid IS NULL
  UNION ALL SELECT 'PayoutRequest', COUNT(*) FROM "PayoutRequest" WHERE id_uuid IS NULL
  UNION ALL SELECT 'ClientIntake', COUNT(*) FROM "ClientIntake" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Affiliate', COUNT(*) FROM "Affiliate" WHERE id_uuid IS NULL
  UNION ALL SELECT 'Referral', COUNT(*) FROM "Referral" WHERE id_uuid IS NULL
  UNION ALL SELECT 'AffiliatePayout', COUNT(*) FROM "AffiliatePayout" WHERE id_uuid IS NULL
) checks
ORDER BY table_name;

-- Check for orphaned FK relationships
\echo '\n2. Checking for orphaned foreign key relationships...';

SELECT 'Profile orphans' as check_name, COUNT(*) as orphan_count,
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM "Profile" p
LEFT JOIN "User" u ON p.userId_uuid = u.id_uuid
WHERE p.userId_uuid IS NOT NULL AND u.id_uuid IS NULL

UNION ALL

SELECT 'Creator orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "Creator" c
LEFT JOIN "User" u ON c.userId_uuid = u.id_uuid
WHERE c.userId_uuid IS NOT NULL AND u.id_uuid IS NULL

UNION ALL

SELECT 'Plan orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "Plan" pl
LEFT JOIN "Creator" c ON pl.creatorId_uuid = c.id_uuid
WHERE pl.creatorId_uuid IS NOT NULL AND c.id_uuid IS NULL

UNION ALL

SELECT 'Subscription user orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "Subscription" s
LEFT JOIN "User" u ON s.userId_uuid = u.id_uuid
WHERE s.userId_uuid IS NOT NULL AND u.id_uuid IS NULL

UNION ALL

SELECT 'Subscription plan orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "Subscription" s
LEFT JOIN "Plan" p ON s.planId_uuid = p.id_uuid
WHERE s.planId_uuid IS NOT NULL AND p.id_uuid IS NULL

UNION ALL

SELECT 'Content orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "Content" co
LEFT JOIN "Creator" c ON co.creatorId_uuid = c.id_uuid
WHERE co.creatorId_uuid IS NOT NULL AND c.id_uuid IS NULL

UNION ALL

SELECT 'Post orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "Post" po
LEFT JOIN "User" u ON po.authorId_uuid = u.id_uuid
WHERE po.authorId_uuid IS NOT NULL AND u.id_uuid IS NULL

UNION ALL

SELECT 'PostLike post orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "PostLike" pl
LEFT JOIN "Post" p ON pl.postId_uuid = p.id_uuid
WHERE pl.postId_uuid IS NOT NULL AND p.id_uuid IS NULL

UNION ALL

SELECT 'PostLike user orphans', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END
FROM "PostLike" pl
LEFT JOIN "User" u ON pl.userId_uuid = u.id_uuid
WHERE pl.userId_uuid IS NOT NULL AND u.id_uuid IS NULL;

-- Check UUID index existence
\echo '\n3. Checking for UUID indexes...';
SELECT 
  indexname,
  tablename,
  CASE 
    WHEN indexname IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM pg_indexes
WHERE indexname LIKE '%uuid%'
  AND schemaname = 'public'
ORDER BY tablename, indexname;

-- Check table row counts
\echo '\n4. Verifying row counts consistency...';
SELECT 
  'User' as table_name,
  COUNT(*) as total_rows,
  COUNT(id_uuid) as uuid_filled,
  ROUND((COUNT(id_uuid)::numeric / NULLIF(COUNT(*), 0) * 100), 2) as percent_complete
FROM "User"
UNION ALL
SELECT 'Creator', COUNT(*), COUNT(id_uuid),
  ROUND((COUNT(id_uuid)::numeric / NULLIF(COUNT(*), 0) * 100), 2)
FROM "Creator"
UNION ALL
SELECT 'Plan', COUNT(*), COUNT(id_uuid),
  ROUND((COUNT(id_uuid)::numeric / NULLIF(COUNT(*), 0) * 100), 2)
FROM "Plan"
UNION ALL
SELECT 'Subscription', COUNT(*), COUNT(id_uuid),
  ROUND((COUNT(id_uuid)::numeric / NULLIF(COUNT(*), 0) * 100), 2)
FROM "Subscription"
ORDER BY table_name;

\echo '\n========================================';
\echo 'PHASE 2 VERIFICATION';
\echo '========================================';

-- Check for NOT NULL constraints
\echo '\n5. Checking NOT NULL constraints on UUID columns...';
SELECT 
  c.table_name,
  c.column_name,
  c.is_nullable,
  CASE 
    WHEN c.is_nullable = 'NO' THEN '✅ NOT NULL'
    ELSE '⚠️  NULLABLE'
  END as status
FROM information_schema.columns c
WHERE c.table_schema = 'public'
  AND c.column_name LIKE '%uuid%'
  AND c.table_name IN (
    'User', 'Creator', 'Plan', 'Subscription', 'Content',
    'Payment', 'Post', 'PostLike', 'Profile', 'PayoutRequest'
  )
ORDER BY c.table_name, c.column_name;

-- Check for UNIQUE constraints
\echo '\n6. Checking UNIQUE constraints on UUID columns...';
SELECT 
  tc.table_name,
  tc.constraint_name,
  '✅ EXISTS' as status
FROM information_schema.table_constraints tc
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.constraint_name LIKE '%uuid%'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Check for FOREIGN KEY constraints
\echo '\n7. Checking FOREIGN KEY constraints on UUID columns...';
SELECT 
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  '✅ EXISTS' as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.constraint_name LIKE '%uuid%'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Performance check: Sample UUID queries
\echo '\n8. Sample UUID query performance...';
EXPLAIN ANALYZE
SELECT u.*, c.*, p.*
FROM "User" u
LEFT JOIN "Creator" c ON u.id_uuid = c.userId_uuid
LEFT JOIN "Profile" p ON u.id_uuid = p.userId_uuid
WHERE u.id_uuid = (SELECT id_uuid FROM "User" LIMIT 1);

\echo '\n========================================';
\echo 'MIGRATION VERIFICATION COMPLETE';
\echo '========================================';
\echo '\nNext steps:';
\echo '- If all checks PASS, proceed to next phase';
\echo '- If any checks FAIL, investigate and fix before continuing';
\echo '- Monitor application logs for errors';
\echo '- Check Vercel/Supabase dashboards for anomalies';
\echo '========================================';
