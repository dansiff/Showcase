// @ts-nocheck
// Archived: original app/api/Track-comission/routetbd.ts
// Moved here to keep the code for future reference while preventing it from
// being served as an active API route.

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// --- Prisma Client Initialization ---
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- Request Body Schema Validation ---
const referralSchema = z.object({
    referrerEmail: z.string().email(),
    referredEmail: z.string().email(),
    serviceId: z.string().min(1, "Service ID is required"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request data
        const { referrerEmail, referredEmail, serviceId } = referralSchema.parse(body);

        // Ensure referrer exists
        const referrer = await prisma.user.findUnique({ where: { email: referrerEmail } });
        if (!referrer) {
            return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
        }

        // Create referred user if not found
        const referredUser = await (prisma as any).user.upsert({
            where: { email: referredEmail },
            update: {}, // no-op if user exists
            create: { email: referredEmail, role: 'CLIENT' },
        });

        // Create referral record
        const referral = await (prisma as any).referral.create({
            data: {
                referrerEmail,
                referredId: referredUser.id,
            },
        });

        // Attach referral to the service
        const updatedService = await (prisma as any).service.update({
            where: { id: serviceId },
            data: { commissionId: referral.id },
        });

        return NextResponse.json(
            {
                message: 'Referral recorded successfully!',
                referral,
                updatedService,
            },
            { status: 200 }
        );
    } catch (error) {
        // Handle validation errors from zod
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten() }, { status: 400 });
        }

        // Generic fallback
        console.error("Referral POST error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
