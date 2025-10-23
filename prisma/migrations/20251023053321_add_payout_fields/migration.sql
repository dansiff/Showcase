-- CreateEnum
CREATE TYPE "PayoutCadence" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "PayoutMethod" AS ENUM ('STRIPE_CONNECT', 'BANK_WIRE', 'PAYPAL');

-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payoutCadence" "PayoutCadence" NOT NULL DEFAULT 'WEEKLY',
ADD COLUMN     "payoutMethod" "PayoutMethod" NOT NULL DEFAULT 'STRIPE_CONNECT',
ADD COLUMN     "promoEndsAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PayoutRequest" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "amountCents" INTEGER,
    "method" "PayoutMethod" NOT NULL,
    "cadence" "PayoutCadence",
    "status" TEXT NOT NULL DEFAULT 'requested',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
