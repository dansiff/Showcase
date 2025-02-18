import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { referrerEmail, referredEmail, serviceId } = body;

        // Find referrer
        const referrer = await prisma.user.findUnique({
            where: { email: referrerEmail },
        });

        if (!referrer) {
            return Response.json({ error: "Referrer not found" }, { status: 404 });
        }

        // Find referred user (optional)
        let referredUser = await prisma.user.findUnique({
            where: { email: referredEmail },
        });

        // If the referred user does not exist, create one
        if (!referredUser) {
            referredUser = await prisma.user.create({
                data: {
                    email: referredEmail,
                    role: "CLIENT",
                },
            });
        }

        // Create a referral record
        const referral = await prisma.referral.create({
            data: {
                referrerEmail,
                referredId: referredUser.id,
            },
        });

        // Update the service with the referral commission
        await prisma.service.update({
            where: { id: serviceId },
            data: { commissionId: referral.id },
        });

        return Response.json(
            { message: "Referral recorded successfully!", referral },
            { status: 200 }
        );
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
