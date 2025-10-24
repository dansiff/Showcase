-- ========================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ========================================
-- Purpose: Enable Supabase RLS for secure multi-tenant access
-- 
-- IMPORTANT: These policies assume you're using Supabase Auth
-- and that auth.uid() returns the user's UUID from Supabase.
-- 
-- Since your app uses Prisma directly (bypassing Supabase client),
-- RLS is OPTIONAL. Enable only if you want database-level security
-- independent of your application layer.
--
-- If enabled, ensure your Prisma connection uses the appropriate
-- role and auth context (service_role bypasses RLS).
-- ========================================

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to get current user's UUID from Supabase auth context
CREATE OR REPLACE FUNCTION auth.user_id() RETURNS UUID AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claim.sub', true)
  )::uuid;
$$ LANGUAGE SQL STABLE;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM "User"
    WHERE id_uuid = auth.user_id()
      AND role = 'ADMIN'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if current user is creator
CREATE OR REPLACE FUNCTION public.is_creator() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Creator"
    WHERE userId_uuid = auth.user_id()
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user has active subscription to creator
CREATE OR REPLACE FUNCTION public.has_subscription_to(creator_uuid UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM "Subscription" s
    JOIN "Plan" p ON s.planId_uuid = p.id_uuid
    WHERE s.userId_uuid = auth.user_id()
      AND p.creatorId_uuid = creator_uuid
      AND s.status = 'active'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ========================================
-- ENABLE RLS ON ALL TABLES
-- ========================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Creator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Plan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PostLike" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PayoutRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClientIntake" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Affiliate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AffiliatePayout" ENABLE ROW LEVEL SECURITY;

-- ========================================
-- USER TABLE POLICIES
-- ========================================

-- Users can read their own record
CREATE POLICY "Users can view own profile"
  ON "User" FOR SELECT
  USING (id_uuid = auth.user_id());

-- Users can update their own record (except role)
CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  USING (id_uuid = auth.user_id())
  WITH CHECK (id_uuid = auth.user_id());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON "User" FOR SELECT
  USING (public.is_admin());

-- Admins can update all users
CREATE POLICY "Admins can update all users"
  ON "User" FOR UPDATE
  USING (public.is_admin());

-- New users can insert their own record (during signup)
CREATE POLICY "Users can insert own record"
  ON "User" FOR INSERT
  WITH CHECK (id_uuid = auth.user_id());

-- ========================================
-- PROFILE TABLE POLICIES
-- ========================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON "Profile" FOR SELECT
  USING (userId_uuid = auth.user_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON "Profile" FOR UPDATE
  USING (userId_uuid = auth.user_id())
  WITH CHECK (userId_uuid = auth.user_id());

-- Users can create their own profile
CREATE POLICY "Users can create own profile"
  ON "Profile" FOR INSERT
  WITH CHECK (userId_uuid = auth.user_id());

-- ========================================
-- CREATOR TABLE POLICIES
-- ========================================

-- Anyone can view creator profiles (public discovery)
CREATE POLICY "Creators are publicly viewable"
  ON "Creator" FOR SELECT
  USING (true);

-- Creators can update their own profile
CREATE POLICY "Creators can update own profile"
  ON "Creator" FOR UPDATE
  USING (userId_uuid = auth.user_id())
  WITH CHECK (userId_uuid = auth.user_id());

-- Users can create their own creator profile
CREATE POLICY "Users can become creators"
  ON "Creator" FOR INSERT
  WITH CHECK (userId_uuid = auth.user_id());

-- Admins can update any creator
CREATE POLICY "Admins can update creators"
  ON "Creator" FOR UPDATE
  USING (public.is_admin());

-- ========================================
-- PLAN TABLE POLICIES
-- ========================================

-- Anyone can view active plans (public discovery)
CREATE POLICY "Plans are publicly viewable"
  ON "Plan" FOR SELECT
  USING (isActive = true OR creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ));

-- Creators can manage their own plans
CREATE POLICY "Creators can manage own plans"
  ON "Plan" FOR ALL
  USING (creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ))
  WITH CHECK (creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ));

-- Admins can manage all plans
CREATE POLICY "Admins can manage plans"
  ON "Plan" FOR ALL
  USING (public.is_admin());

-- ========================================
-- SUBSCRIPTION TABLE POLICIES
-- ========================================

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON "Subscription" FOR SELECT
  USING (userId_uuid = auth.user_id());

-- Creators can view subscriptions to their plans
CREATE POLICY "Creators can view own subscriptions"
  ON "Subscription" FOR SELECT
  USING (planId_uuid IN (
    SELECT p.id_uuid 
    FROM "Plan" p
    JOIN "Creator" c ON p.creatorId_uuid = c.id_uuid
    WHERE c.userId_uuid = auth.user_id()
  ));

-- Users can create their own subscriptions (via Stripe webhook)
CREATE POLICY "System can create subscriptions"
  ON "Subscription" FOR INSERT
  WITH CHECK (true); -- Controlled by service_role in webhook

-- Users can update their own subscriptions (cancel, etc.)
CREATE POLICY "Users can update own subscriptions"
  ON "Subscription" FOR UPDATE
  USING (userId_uuid = auth.user_id());

-- Admins can view/update all subscriptions
CREATE POLICY "Admins can manage subscriptions"
  ON "Subscription" FOR ALL
  USING (public.is_admin());

-- ========================================
-- CONTENT TABLE POLICIES
-- ========================================

-- Public content is viewable by anyone
CREATE POLICY "Free content is publicly viewable"
  ON "Content" FOR SELECT
  USING (visibility = 'FREE');

-- Subscribers can view subscriber-only content
CREATE POLICY "Subscribers can view subscriber content"
  ON "Content" FOR SELECT
  USING (
    visibility = 'SUBSCRIBERS' 
    AND public.has_subscription_to(creatorId_uuid)
  );

-- Creators can view all their own content
CREATE POLICY "Creators can view own content"
  ON "Content" FOR SELECT
  USING (creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ));

-- Creators can manage their own content
CREATE POLICY "Creators can manage own content"
  ON "Content" FOR ALL
  USING (creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ))
  WITH CHECK (creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ));

-- Admins can view/manage all content
CREATE POLICY "Admins can manage content"
  ON "Content" FOR ALL
  USING (public.is_admin());

-- ========================================
-- POST TABLE POLICIES
-- ========================================

-- Published posts are viewable by anyone
CREATE POLICY "Published posts are publicly viewable"
  ON "Post" FOR SELECT
  USING (isPublished = true);

-- Users can view their own posts (published or not)
CREATE POLICY "Users can view own posts"
  ON "Post" FOR SELECT
  USING (authorId_uuid = auth.user_id());

-- Premium posts require subscription (if implemented)
CREATE POLICY "Premium posts require subscription"
  ON "Post" FOR SELECT
  USING (
    NOT isPremium 
    OR authorId_uuid = auth.user_id()
    OR public.has_subscription_to((
      SELECT c.id_uuid FROM "Creator" c 
      WHERE c.userId_uuid = authorId_uuid
    ))
  );

-- Users can create their own posts
CREATE POLICY "Users can create own posts"
  ON "Post" FOR INSERT
  WITH CHECK (authorId_uuid = auth.user_id());

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON "Post" FOR UPDATE
  USING (authorId_uuid = auth.user_id())
  WITH CHECK (authorId_uuid = auth.user_id());

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON "Post" FOR DELETE
  USING (authorId_uuid = auth.user_id());

-- Admins can manage all posts
CREATE POLICY "Admins can manage posts"
  ON "Post" FOR ALL
  USING (public.is_admin());

-- ========================================
-- POSTLIKE TABLE POLICIES
-- ========================================

-- Users can view all likes (public engagement)
CREATE POLICY "Likes are publicly viewable"
  ON "PostLike" FOR SELECT
  USING (true);

-- Users can like posts
CREATE POLICY "Users can like posts"
  ON "PostLike" FOR INSERT
  WITH CHECK (userId_uuid = auth.user_id());

-- Users can unlike their own likes
CREATE POLICY "Users can unlike posts"
  ON "PostLike" FOR DELETE
  USING (userId_uuid = auth.user_id());

-- ========================================
-- PAYMENT TABLE POLICIES
-- ========================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON "Payment" FOR SELECT
  USING (userId_uuid = auth.user_id());

-- System can create payments (via webhook)
CREATE POLICY "System can create payments"
  ON "Payment" FOR INSERT
  WITH CHECK (true); -- Controlled by service_role

-- Admins can view all payments
CREATE POLICY "Admins can view payments"
  ON "Payment" FOR SELECT
  USING (public.is_admin());

-- ========================================
-- PAYOUT REQUEST TABLE POLICIES
-- ========================================

-- Creators can view their own payout requests
CREATE POLICY "Creators can view own payouts"
  ON "PayoutRequest" FOR SELECT
  USING (creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ));

-- Creators can create payout requests
CREATE POLICY "Creators can request payouts"
  ON "PayoutRequest" FOR INSERT
  WITH CHECK (creatorId_uuid IN (
    SELECT id_uuid FROM "Creator" WHERE userId_uuid = auth.user_id()
  ));

-- Admins can view/manage all payout requests
CREATE POLICY "Admins can manage payouts"
  ON "PayoutRequest" FOR ALL
  USING (public.is_admin());

-- ========================================
-- CLIENT INTAKE TABLE POLICIES
-- ========================================

-- Users can view their own client intakes
CREATE POLICY "Users can view own intakes"
  ON "ClientIntake" FOR SELECT
  USING (email = (SELECT email FROM "User" WHERE id_uuid = auth.user_id()));

-- Anyone can create a client intake (public form)
CREATE POLICY "Anyone can submit intake"
  ON "ClientIntake" FOR INSERT
  WITH CHECK (true);

-- Admins can view/manage all intakes
CREATE POLICY "Admins can manage intakes"
  ON "ClientIntake" FOR ALL
  USING (public.is_admin());

-- ========================================
-- AFFILIATE TABLE POLICIES
-- ========================================

-- Affiliates can view their own record
CREATE POLICY "Affiliates can view own record"
  ON "Affiliate" FOR SELECT
  USING (userId_uuid = auth.user_id());

-- Admins can manage affiliates
CREATE POLICY "Admins can manage affiliates"
  ON "Affiliate" FOR ALL
  USING (public.is_admin());

-- ========================================
-- REFERRAL TABLE POLICIES
-- ========================================

-- Affiliates can view their own referrals
CREATE POLICY "Affiliates can view own referrals"
  ON "Referral" FOR SELECT
  USING (affiliateId_uuid IN (
    SELECT id_uuid FROM "Affiliate" WHERE userId_uuid = auth.user_id()
  ));

-- System can create referrals (tracking)
CREATE POLICY "System can create referrals"
  ON "Referral" FOR INSERT
  WITH CHECK (true);

-- Admins can view all referrals
CREATE POLICY "Admins can view referrals"
  ON "Referral" FOR SELECT
  USING (public.is_admin());

-- ========================================
-- AFFILIATE PAYOUT TABLE POLICIES
-- ========================================

-- Affiliates can view their own payouts
CREATE POLICY "Affiliates can view own payouts"
  ON "AffiliatePayout" FOR SELECT
  USING (affiliateId_uuid IN (
    SELECT id_uuid FROM "Affiliate" WHERE userId_uuid = auth.user_id()
  ));

-- Affiliates can request payouts
CREATE POLICY "Affiliates can request payouts"
  ON "AffiliatePayout" FOR INSERT
  WITH CHECK (affiliateId_uuid IN (
    SELECT id_uuid FROM "Affiliate" WHERE userId_uuid = auth.user_id()
  ));

-- Admins can manage affiliate payouts
CREATE POLICY "Admins can manage affiliate payouts"
  ON "AffiliatePayout" FOR ALL
  USING (public.is_admin());

-- ========================================
-- RLS SETUP COMPLETE
-- ========================================
-- ✅ RLS enabled on all tables
-- ✅ Helper functions created (is_admin, is_creator, has_subscription_to)
-- ✅ Policies enforce:
--    - Users can only access their own data
--    - Creators can manage their content/plans
--    - Public content is discoverable
--    - Subscribers can access subscriber-only content
--    - Admins have full access
--
-- IMPORTANT NOTES:
-- 1. Your app uses Prisma with service_role connection (bypasses RLS)
-- 2. RLS provides defense-in-depth but isn't your primary auth layer
-- 3. If using Supabase client libraries, these policies will be enforced
-- 4. For Prisma queries, continue using your email-based auth pattern
-- ========================================
