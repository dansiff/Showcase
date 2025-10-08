// lib/prisma.ts
// Proper PrismaClient singleton for Next.js to avoid connection exhaustion in dev
import { PrismaClient } from "@prisma/client";

declare global {
	// allow global var in dev to prevent multiple instances
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
	global.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
