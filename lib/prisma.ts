// lib/prisma.ts
// Proper PrismaClient singleton for Next.js to avoid connection exhaustion in dev
import { PrismaClient } from "@prisma/client";
import { validateEnvVars } from "./env";

declare global {
	// allow global var in dev to prevent multiple instances
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  (() => {
    validateEnvVars();
    // Dev-only: Log target DB host:port for easier troubleshooting (redacted)
    if (process.env.NODE_ENV !== 'production') {
      try {
        const url = process.env.DATABASE_URL || '';
        const u = new URL(url);
        const host = u.hostname;
        const port = u.port || '5432';
        const ssl = u.searchParams.get('sslmode') || 'none';
        console.log(`[PRISMA] Using DATABASE_URL -> ${host}:${port} (ssl=${ssl})`);
      } catch (e) {
        console.warn('[PRISMA] Could not parse DATABASE_URL for logging');
      }
    }
    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    return client;
  })();

