"use client";

type SubscriptionPlan = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  billingPeriod: string;
};

type SubscriptionTierCardProps = {
  plan: SubscriptionPlan;
  onSubscribeAction: () => void;
  isPopular?: boolean;
};

const TIER_FEATURES: Record<string, string[]> = {
  Basic: [
    'Access to premium posts',
    'Exclusive content',
    'Direct messaging',
    'Early access to announcements'
  ],
  Premium: [
    'Everything in Basic',
    'Priority support',
    'Behind-the-scenes content',
    'Monthly video call',
    'Exclusive merchandise discounts'
  ],
  VIP: [
    'Everything in Premium',
    'Weekly 1-on-1 sessions',
    'Custom content requests',
    'VIP-only events',
    'Lifetime access guarantee'
  ]
};

export default function SubscriptionTierCard({
  plan,
  onSubscribeAction,
  isPopular = false,
}: SubscriptionTierCardProps) {
  const formatPrice = (priceCents: number) => {
    const dollars = priceCents / 100;
    return dollars.toFixed(2);
  };

  const features = TIER_FEATURES[plan.name] || [
    'Access to premium content',
    'Exclusive posts',
    'Direct creator messaging'
  ];

  const isPremiumTier = plan.name.toLowerCase() === 'premium' || plan.priceCents >= 1500;

  return (
    <div
      className={`border rounded-lg p-5 transition-all cursor-pointer hover:shadow-lg ${
        isPopular || isPremiumTier
          ? 'border-purple-500 bg-purple-950/20 shadow-purple-500/20'
          : 'border-gray-800 hover:border-purple-500/50'
      }`}
    >
      {/* Tier Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-lg">{plan.name}</h4>
          {(isPopular || isPremiumTier) && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-600 text-xs font-semibold rounded">
              Most Popular
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-purple-400">
            ${formatPrice(plan.priceCents)}
          </span>
          <span className="text-sm text-gray-400 block">
            /{plan.billingPeriod.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
            <span className="text-purple-400 flex-shrink-0">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Subscribe Button */}
      <button
        onClick={onSubscribeAction}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isPopular || isPremiumTier
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Subscribe Now
      </button>

      {/* Billing Info */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Cancel anytime • Secure payment via Stripe
      </p>
    </div>
  );
}
