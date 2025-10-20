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
    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    return client;
  })();

