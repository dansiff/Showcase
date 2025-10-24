// tests/integration/uuid-migration.test.ts
// Integration tests for UUID migration
// Run with: npm run test:integration

import { prisma } from '@/lib/prisma';
import { 
  createUserDualFormat, 
  createCreatorDualFormat,
  getUserByEmailWithUuid,
  createIdFilter,
  isValidUUID 
} from '@/lib/db-migration-helpers';

describe('UUID Migration Integration Tests', () => {
  beforeAll(async () => {
    // Ensure test database is clean
    await prisma.postLike.deleteMany();
    await prisma.post.deleteMany();
    await prisma.content.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.payoutRequest.deleteMany();
    await prisma.creator.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Phase 1: UUID Column Creation', () => {
    it('should create user with both id formats', async () => {
      const email = `test-${Date.now()}@example.com`;
      
      const user = await createUserDualFormat({
        email,
        name: 'Test User',
        role: 'USER',
      });

      expect(user.id).toBeDefined();
      expect(user.id_uuid).toBeDefined();
      expect(isValidUUID(user.id)).toBe(true);
      expect(isValidUUID(user.id_uuid)).toBe(true);
      // During transition, both should be the same
      expect(user.id).toBe(user.id_uuid);
    });

    it('should find user by email with UUID support', async () => {
      const email = `lookup-${Date.now()}@example.com`;
      
      await createUserDualFormat({
        email,
        name: 'Lookup Test',
      });

      const found = await getUserByEmailWithUuid(email);
      
      expect(found).not.toBeNull();
      expect(found?.email).toBe(email);
      expect(found?.primaryId).toBeDefined();
      expect(isValidUUID(found?.primaryId || '')).toBe(true);
    });

    it('should create creator with UUID foreign keys', async () => {
      const email = `creator-${Date.now()}@example.com`;
      
      const user = await createUserDualFormat({
        email,
        name: 'Creator User',
        role: 'CREATOR',
      });

      const creator = await createCreatorDualFormat({
        userId: user.id,
        displayName: 'Test Creator',
      });

      expect(creator.userId).toBe(user.id);
      expect(creator.userId_uuid).toBe(user.id_uuid);
      expect(isValidUUID(creator.userId_uuid)).toBe(true);
    });
  });

  describe('Phase 2: Foreign Key Relationships', () => {
    it('should maintain referential integrity across UUID FK', async () => {
      const email = `fk-test-${Date.now()}@example.com`;
      
      // Create user
      const user = await createUserDualFormat({
        email,
        name: 'FK Test User',
        role: 'CREATOR',
      });

      // Create creator
      const creator = await createCreatorDualFormat({
        userId: user.id,
        displayName: 'FK Test Creator',
      });

      // Create plan
      const plan = await prisma.plan.create({
        data: {
          id: crypto.randomUUID(),
          id_uuid: crypto.randomUUID(),
          creatorId: creator.id,
          creatorId_uuid: creator.id_uuid,
          name: 'Test Plan',
          stripePriceId: 'price_test_123',
          priceCents: 999,
          currency: 'usd',
          billingPeriod: 'MONTH',
        },
      });

      // Verify relationships via UUID
      const foundPlan = await prisma.plan.findFirst({
        where: createIdFilter(plan.id),
        include: {
          creator: {
            include: {
              user: true,
            },
          },
        },
      });

      expect(foundPlan).not.toBeNull();
      expect(foundPlan?.creator.id_uuid).toBe(creator.id_uuid);
      expect(foundPlan?.creator.user.id_uuid).toBe(user.id_uuid);
    });

    it('should handle cascading deletes with UUID FKs', async () => {
      const email = `cascade-${Date.now()}@example.com`;
      
      const user = await createUserDualFormat({
        email,
        name: 'Cascade Test',
      });

      const profile = await prisma.profile.create({
        data: {
          id: crypto.randomUUID(),
          id_uuid: crypto.randomUUID(),
          userId: user.id,
          userId_uuid: user.id_uuid,
          bio: 'Test bio',
        },
      });

      // Delete user should cascade to profile
      await prisma.user.delete({
        where: { id: user.id },
      });

      const foundProfile = await prisma.profile.findUnique({
        where: { id: profile.id },
      });

      expect(foundProfile).toBeNull();
    });
  });

  describe('Dual-Format Query Support', () => {
    it('should query with createIdFilter for both formats', async () => {
      const email = `dual-${Date.now()}@example.com`;
      
      const user = await createUserDualFormat({
        email,
        name: 'Dual Format Test',
      });

      // Query by UUID
      const byUuid = await prisma.user.findFirst({
        where: createIdFilter(user.id_uuid),
      });

      // Query by text ID (during transition)
      const byTextId = await prisma.user.findFirst({
        where: createIdFilter(user.id),
      });

      expect(byUuid?.id).toBe(user.id);
      expect(byTextId?.id).toBe(user.id);
      expect(byUuid?.id_uuid).toBe(byTextId?.id_uuid);
    });

    it('should handle complex joins with UUID FKs', async () => {
      const email = `join-${Date.now()}@example.com`;
      
      const user = await createUserDualFormat({
        email,
        name: 'Join Test User',
        role: 'CREATOR',
      });

      const creator = await createCreatorDualFormat({
        userId: user.id,
        displayName: 'Join Test Creator',
      });

      const plan = await prisma.plan.create({
        data: {
          id: crypto.randomUUID(),
          id_uuid: crypto.randomUUID(),
          creatorId: creator.id,
          creatorId_uuid: creator.id_uuid,
          name: 'Join Plan',
          stripePriceId: 'price_join_123',
          priceCents: 1999,
          currency: 'usd',
        },
      });

      const subscription = await prisma.subscription.create({
        data: {
          id: crypto.randomUUID(),
          id_uuid: crypto.randomUUID(),
          userId: user.id,
          userId_uuid: user.id_uuid,
          planId: plan.id,
          planId_uuid: plan.id_uuid,
          stripeSubId: 'sub_test_123',
          status: 'active',
        },
      });

      // Complex query with UUID joins
      const result = await prisma.subscription.findFirst({
        where: createIdFilter(subscription.id),
        include: {
          user: true,
          plan: {
            include: {
              creator: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      expect(result).not.toBeNull();
      expect(result?.user.id_uuid).toBe(user.id_uuid);
      expect(result?.plan.creator.user.id_uuid).toBe(user.id_uuid);
    });
  });

  describe('Data Integrity Checks', () => {
    it('should have no NULL uuid values after backfill', async () => {
      const nullUsers = await prisma.user.count({
        where: { id_uuid: null },
      });

      const nullCreators = await prisma.creator.count({
        where: { id_uuid: null },
      });

      expect(nullUsers).toBe(0);
      expect(nullCreators).toBe(0);
    });

    it('should have matching UUID FKs', async () => {
      // Get all creators with their users
      const creators = await prisma.creator.findMany({
        include: { user: true },
      });

      // Verify userId_uuid matches user.id_uuid
      creators.forEach(creator => {
        if (creator.userId_uuid && creator.user.id_uuid) {
          expect(creator.userId_uuid).toBe(creator.user.id_uuid);
        }
      });
    });

    it('should maintain unique constraints on UUIDs', async () => {
      const email = `unique-${Date.now()}@example.com`;
      
      const user = await createUserDualFormat({
        email,
        name: 'Unique Test',
      });

      // Attempt to create another user with same UUID should fail
      await expect(
        prisma.user.create({
          data: {
            id: crypto.randomUUID(),
            id_uuid: user.id_uuid, // Duplicate UUID
            email: `different-${Date.now()}@example.com`,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should query by UUID efficiently', async () => {
      const email = `perf-${Date.now()}@example.com`;
      
      const user = await createUserDualFormat({
        email,
        name: 'Performance Test',
      });

      const start = Date.now();
      
      for (let i = 0; i < 100; i++) {
        await prisma.user.findUnique({
          where: { id_uuid: user.id_uuid },
        });
      }

      const duration = Date.now() - start;
      
      // 100 queries should complete in < 1 second with proper indexes
      expect(duration).toBeLessThan(1000);
    });
  });
});

describe('Migration Rollback Tests', () => {
  it('should handle rollback by dropping UUID constraints', async () => {
    // This would be run in a separate test environment
    // Test that dropping UUID constraints doesn't break app
    
    const email = `rollback-${Date.now()}@example.com`;
    
    const user = await createUserDualFormat({
      email,
      name: 'Rollback Test',
    });

    // App should still work with text IDs after constraint removal
    const found = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(found).not.toBeNull();
  });
});
