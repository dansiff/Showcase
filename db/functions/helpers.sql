-- ========================================
-- HELPER SQL FUNCTIONS
-- ========================================
-- Purpose: Utility functions for application and migration use
-- ========================================

-- Function to safely convert text ID to UUID
-- Returns NULL if conversion fails
CREATE OR REPLACE FUNCTION public.text_to_uuid_safe(text_id TEXT) 
RETURNS UUID AS $$
BEGIN
  RETURN text_id::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get user UUID by email
CREATE OR REPLACE FUNCTION public.get_user_uuid_by_email(user_email TEXT)
RETURNS UUID AS $$
  SELECT id_uuid FROM "User" WHERE email = user_email LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Function to get creator UUID by user email
CREATE OR REPLACE FUNCTION public.get_creator_uuid_by_email(user_email TEXT)
RETURNS UUID AS $$
  SELECT c.id_uuid 
  FROM "Creator" c
  JOIN "User" u ON c.userId_uuid = u.id_uuid
  WHERE u.email = user_email 
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.user_has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Subscription"
    WHERE userId_uuid = user_uuid
      AND status = 'active'
      AND (currentPeriodEnd IS NULL OR currentPeriodEnd > NOW())
  );
$$ LANGUAGE SQL STABLE;

-- Function to get creator revenue for period
CREATE OR REPLACE FUNCTION public.get_creator_revenue(
  creator_uuid UUID,
  start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
  total_revenue_cents BIGINT,
  subscription_count BIGINT,
  new_subscribers BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(p.priceCents), 0)::BIGINT as total_revenue_cents,
    COUNT(DISTINCT s.id_uuid)::BIGINT as subscription_count,
    COUNT(DISTINCT s.id_uuid) FILTER (
      WHERE s.createdAt BETWEEN start_date AND end_date
    )::BIGINT as new_subscribers
  FROM "Plan" pl
  LEFT JOIN "Subscription" s ON s.planId_uuid = pl.id_uuid AND s.status = 'active'
  WHERE pl.creatorId_uuid = creator_uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to validate affiliate code
CREATE OR REPLACE FUNCTION public.is_valid_affiliate_code(code TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Affiliate"
    WHERE code = $1 AND active = true
  );
$$ LANGUAGE SQL STABLE;

-- Function to track affiliate referral
CREATE OR REPLACE FUNCTION public.track_referral(
  affiliate_code TEXT,
  referred_email TEXT,
  attribution_type TEXT DEFAULT 'signup'
)
RETURNS UUID AS $$
DECLARE
  affiliate_uuid UUID;
  referral_uuid UUID;
BEGIN
  -- Get affiliate UUID
  SELECT id_uuid INTO affiliate_uuid
  FROM "Affiliate"
  WHERE code = affiliate_code AND active = true
  LIMIT 1;
  
  IF affiliate_uuid IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Create referral
  INSERT INTO "Referral" (
    id, id_uuid, affiliateId, affiliateId_uuid, 
    referredEmail, attribution, status
  )
  VALUES (
    gen_random_uuid()::text, gen_random_uuid(),
    (SELECT id FROM "Affiliate" WHERE id_uuid = affiliate_uuid),
    affiliate_uuid,
    referred_email, attribution_type, 'tracked'
  )
  RETURNING id_uuid INTO referral_uuid;
  
  RETURN referral_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate platform fees
CREATE OR REPLACE FUNCTION public.calculate_platform_fee(
  amount_cents INT,
  creator_uuid UUID DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
  fee_percent INT;
BEGIN
  -- Get creator-specific fee override or use default 10%
  SELECT COALESCE(
    (SELECT revenueSharePercent FROM "Creator" WHERE id_uuid = creator_uuid),
    10
  ) INTO fee_percent;
  
  RETURN (amount_cents * fee_percent / 100)::INT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function to update updatedAt automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updatedAt trigger to relevant tables
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_updated_at'
  ) THEN
    CREATE TRIGGER update_user_updated_at
      BEFORE UPDATE ON "User"
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_subscription_updated_at'
  ) THEN
    CREATE TRIGGER update_subscription_updated_at
      BEFORE UPDATE ON "Subscription"
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_post_updated_at'
  ) THEN
    CREATE TRIGGER update_post_updated_at
      BEFORE UPDATE ON "Post"
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_clientintake_updated_at'
  ) THEN
    CREATE TRIGGER update_clientintake_updated_at
      BEFORE UPDATE ON "ClientIntake"
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_affiliate_updated_at'
  ) THEN
    CREATE TRIGGER update_affiliate_updated_at
      BEFORE UPDATE ON "Affiliate"
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_referral_updated_at'
  ) THEN
    CREATE TRIGGER update_referral_updated_at
      BEFORE UPDATE ON "Referral"
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- ========================================
-- HELPER FUNCTIONS COMPLETE
-- ========================================
-- ✅ Safe UUID conversion
-- ✅ User/Creator lookup by email
-- ✅ Subscription validation
-- ✅ Revenue calculation
-- ✅ Affiliate tracking
-- ✅ Platform fee calculation
-- ✅ Auto-update triggers for updatedAt
-- ========================================
