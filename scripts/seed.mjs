// scripts/seed.mjs
// Seed a demo creator, plans, and posts for quick testing
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // 1) Upsert demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { name: 'demo', image: null },
    create: {
      email: 'demo@example.com',
      name: 'demo',
      image: null,
      profile: {
        create: {
          bio: 'This is a demo creator used for previews.',
        },
      },
    },
    include: { profile: true },
  })
  console.log('User ready:', user.email)

  // 2) Ensure a Creator record exists for this user
  let creator = await prisma.creator.findUnique({ where: { userId: user.id } })
  if (!creator) {
    creator = await prisma.creator.create({
      data: {
        userId: user.id,
        displayName: user.name || 'Demo Creator',
      },
    })
    console.log('Created creator:', creator.id)
  } else {
    console.log('Creator ready:', creator.id)
  }

  // 3) Plans: replace any existing for this creator with a couple of demo tiers
  await prisma.plan.deleteMany({ where: { creatorId: creator.id } })
  await prisma.plan.createMany({
    data: [
      {
        creatorId: creator.id,
        name: 'Bronze',
        stripePriceId: 'price_demo_bronze', // placeholder
        priceCents: 499,
        currency: 'usd',
        billingPeriod: 'MONTH',
        isActive: true,
      },
      {
        creatorId: creator.id,
        name: 'Gold',
        stripePriceId: 'price_demo_gold', // placeholder
        priceCents: 1499,
        currency: 'usd',
        billingPeriod: 'MONTH',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })
  console.log('Plans seeded for creator:', creator.id)

  // 4) Posts: add a few demo posts
  await prisma.post.createMany({
    data: [
      {
        authorId: user.id,
        title: 'Welcome to my page',
        content: 'First post! Thanks for checking out the demo.',
        isPremium: false,
        isPublished: true,
      },
      {
        authorId: user.id,
        title: 'Behind the scenes',
        content: 'A short look behind the scenes (demo content).',
        isPremium: true,
        isPublished: true,
      },
      {
        authorId: user.id,
        title: 'Photo set',
        content: 'Image set coming soon — demo placeholder.',
        imageUrl: null,
        isPremium: false,
        isPublished: true,
      },
    ],
    skipDuplicates: true,
  })
  console.log('Demo posts inserted for user:', user.id)

  console.log('\nDone! You can now visit /creator/demo')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
