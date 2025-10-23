export const DEFAULT_REVENUE_SHARE_PERCENT = 15; // platform fee percent
export const MIN_REVENUE_SHARE_PERCENT = 5;
export const MAX_REVENUE_SHARE_PERCENT = 30;

export type RevenueBreakdown = {
  grossCents: number;
  paymentProcessorFeesCents: number; // Stripe, etc.
  taxesCents?: number; // VAT/GST collected on top (excluded from revenue share)
  platformFeePercent: number; // applied to net receipts
  platformFeeCents: number;
  creatorPayoutCents: number;
};

/**
 * Compute payout using a fair split: platform fee applies to net receipts
 * (gross - payment processing fees - taxes). Taxes default to 0.
 */
export function computePayout(
  grossCents: number,
  paymentProcessorFeesCents: number,
  platformFeePercent?: number,
  taxesCents: number = 0
): RevenueBreakdown {
  const pct = normalizePercent(platformFeePercent);
  const netReceipts = Math.max(0, grossCents - paymentProcessorFeesCents - (taxesCents || 0));
  const platformFeeCents = Math.floor((netReceipts * pct) / 100);
  const creatorPayoutCents = Math.max(0, netReceipts - platformFeeCents);
  return {
    grossCents,
    paymentProcessorFeesCents,
    taxesCents,
    platformFeePercent: pct,
    platformFeeCents,
    creatorPayoutCents,
  };
}

export function normalizePercent(p?: number): number {
  const pct = typeof p === 'number' && !Number.isNaN(p) ? Math.round(p) : DEFAULT_REVENUE_SHARE_PERCENT;
  return Math.min(MAX_REVENUE_SHARE_PERCENT, Math.max(MIN_REVENUE_SHARE_PERCENT, pct));
}

export type CreatorFeeContext = {
  revenueSharePercent?: number | null;
  promoEndsAt?: Date | string | null;
};

export function effectivePlatformFeePercent(ctx?: CreatorFeeContext): number {
  if (!ctx) return DEFAULT_REVENUE_SHARE_PERCENT;
  if (typeof ctx.revenueSharePercent === 'number') return normalizePercent(ctx.revenueSharePercent);
  const now = Date.now();
  const promoEnd = ctx.promoEndsAt ? new Date(ctx.promoEndsAt).getTime() : 0;
  if (promoEnd && now < promoEnd) return 13; // launch promo
  return DEFAULT_REVENUE_SHARE_PERCENT;
}
