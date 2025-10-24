// lib/db-migration-helpers.ts
// Helper utilities for dual-format ID support during UUID migration

import { prisma } from '@/lib/prisma';

/**
 * User resolution with UUID support
 * Prefers UUID, falls back to text ID
 */
export async function getUserByEmailWithUuid(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      id_uuid: true, // Add this field to Prisma schema during transition
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return null;

  // Return with both formats during transition
  return {
    ...user,
    // Prefer UUID if available
    primaryId: user.id_uuid || user.id,
  };
}

/**
 * Creator resolution with UUID support
 */
export async function getCreatorWithUuid(userId: string) {
  // Try UUID first, fallback to text ID
  const creator = await prisma.creator.findFirst({
    where: {
      OR: [
        { userId_uuid: userId }, // Prefer UUID
        { userId: userId },      // Fallback to text
      ],
    },
    select: {
      id: true,
      id_uuid: true,
      userId: true,
      userId_uuid: true,
      displayName: true,
      stripeAccount: true,
      ageRestricted: true,
    },
  });

  return creator;
}

/**
 * Create user with both ID formats
 * Use during transition period to write both text and UUID
 */
export async function createUserDualFormat(data: {
  email: string;
  name?: string;
  role?: string;
}) {
  const id = crypto.randomUUID(); // Generate UUID
  
  return await prisma.user.create({
    data: {
      id: id,           // Text ID (for compatibility)
      id_uuid: id,      // UUID (new format)
      email: data.email,
      name: data.name,
      role: data.role || 'USER',
    },
  });
}

/**
 * Create creator with both ID formats
 */
export async function createCreatorDualFormat(data: {
  userId: string;
  displayName: string;
  stripeAccount?: string;
}) {
  const id = crypto.randomUUID();
  
  // Get user UUID if userId is text
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id_uuid: true },
  });

  return await prisma.creator.create({
    data: {
      id: id,
      id_uuid: id,
      userId: data.userId,
      userId_uuid: user?.id_uuid || data.userId, // Use UUID if available
      displayName: data.displayName,
      stripeAccount: data.stripeAccount,
    },
  });
}

/**
 * Query helper that works with both ID formats
 * Use for finding records by ID during transition
 */
export function createIdFilter(id: string) {
  return {
    OR: [
      { id_uuid: id },
      { id: id },
    ],
  };
}

/**
 * Example: Get user with subscriptions using UUID-aware query
 */
export async function getUserWithSubscriptions(userId: string) {
  return await prisma.user.findFirst({
    where: createIdFilter(userId),
    include: {
      subscriptions: {
        include: {
          plan: {
            include: {
              creator: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Example: Get creator content with UUID-aware filtering
 */
export async function getCreatorContent(creatorId: string, visibility?: string) {
  return await prisma.content.findMany({
    where: {
      OR: [
        { creatorId_uuid: creatorId },
        { creatorId: creatorId },
      ],
      ...(visibility && { visibility }),
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Validation helper: Check if string is valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Migration progress checker
 * Returns stats on UUID migration completion
 */
export async function checkMigrationProgress() {
  const stats = await prisma.$queryRaw<Array<{
    table_name: string;
    total_rows: bigint;
    uuid_filled: bigint;
    percent_complete: number;
  }>>`
    SELECT 
      'User' as table_name,
      COUNT(*) as total_rows,
      COUNT(id_uuid) as uuid_filled,
      (COUNT(id_uuid)::float / NULLIF(COUNT(*), 0) * 100) as percent_complete
    FROM "User"
    UNION ALL
    SELECT 
      'Creator' as table_name,
      COUNT(*) as total_rows,
      COUNT(id_uuid) as uuid_filled,
      (COUNT(id_uuid)::float / NULLIF(COUNT(*), 0) * 100) as percent_complete
    FROM "Creator"
    UNION ALL
    SELECT 
      'Subscription' as table_name,
      COUNT(*) as total_rows,
      COUNT(id_uuid) as uuid_filled,
      (COUNT(id_uuid)::float / NULLIF(COUNT(*), 0) * 100) as percent_complete
    FROM "Subscription"
  `;

  return stats.map((row: any) => ({
    ...row,
    total_rows: Number(row.total_rows),
    uuid_filled: Number(row.uuid_filled),
  }));
}

/**
 * USAGE EXAMPLES:
 * 
 * // Before migration (text IDs only):
 * const user = await prisma.user.findUnique({ where: { id: textId } });
 * 
 * // During migration (dual format):
 * const user = await prisma.user.findFirst({ 
 *   where: createIdFilter(id) // Works with both UUID and text
 * });
 * 
 * // After migration (UUID only):
 * const user = await prisma.user.findUnique({ where: { id_uuid: uuid } });
 */
