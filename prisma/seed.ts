import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with generator plans...')

  // Check if plans already exist
  const existingPlans = await prisma.generatorPlan.findMany()
  if (existingPlans.length > 0) {
    console.log('Plans already exist, skipping seed')
    return
  }

  // Create Standard (Free) Plan
  const standardPlan = await prisma.generatorPlan.create({
    data: {
      planType: 'STANDARD',
      name: 'Standard',
      description: 'Perfect for getting started with your online presence',
      priceCents: null, // Free
      stripePriceId: null,
      currency: 'usd',
      billingPeriod: 'month',
      maxSites: 3,
      maxPages: 10,
      customDomain: false,
      advancedSEO: false,
      analyticsIntegration: false,
      ecommerceFeatures: false,
      bookingFeatures: false,
      apiAccess: false,
      prioritySupport: false,
      customCodes: false,
      advancedTemplates: false,
      formSubmissions: 100,
      storageGb: 5,
      bandwidthGb: 10,
      isActive: true,
    },
  })

  console.log('✅ Standard plan created:', standardPlan.id)

  // Create Pro Plan
  const proPlan = await prisma.generatorPlan.create({
    data: {
      planType: 'PRO',
      name: 'Pro',
      description: 'For growing businesses that need advanced features',
      priceCents: 2999, // $29.99/month
      stripePriceId: process.env.STRIPE_GENERATOR_PRO_PRICE_ID || '',
      currency: 'usd',
      billingPeriod: 'month',
      maxSites: 999999, // Effectively unlimited
      maxPages: 999999, // Effectively unlimited
      customDomain: true,
      advancedSEO: true,
      analyticsIntegration: true,
      ecommerceFeatures: true,
      bookingFeatures: true,
      apiAccess: true,
      prioritySupport: true,
      customCodes: true,
      advancedTemplates: true,
      formSubmissions: 999999, // Effectively unlimited
      storageGb: 100,
      bandwidthGb: 500,
      isActive: true,
    },
  })

  console.log('✅ Pro plan created:', proPlan.id)

  // Log setup instructions if Stripe ID not set
  if (!process.env.STRIPE_GENERATOR_PRO_PRICE_ID) {
    console.warn('\n⚠️  NOTE: STRIPE_GENERATOR_PRO_PRICE_ID not set!')
    console.warn('   1. Create a product in Stripe Dashboard: "Website Generator Pro"')
    console.warn('   2. Create a monthly recurring price: $29.99')
    console.warn('   3. Copy the Price ID (starts with "price_")')
    console.warn('   4. Add to .env.local: STRIPE_GENERATOR_PRO_PRICE_ID=price_xxxxx')
    console.warn('   5. Update the Pro plan with: npx prisma db push\n')
  }

  console.log('\n✨ Seeding complete!')
  console.log('Standard Plan:', {
    id: standardPlan.id,
    sites: standardPlan.maxSites,
    pages: standardPlan.maxPages,
    storage: `${standardPlan.storageGb}GB`,
  })
  console.log('Pro Plan:', {
    id: proPlan.id,
    price: `$${(proPlan.priceCents! / 100).toFixed(2)}/month`,
    sites: 'Unlimited',
    pages: 'Unlimited',
    storage: `${proPlan.storageGb}GB`,
  })
}

main()
  .catch(e => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
