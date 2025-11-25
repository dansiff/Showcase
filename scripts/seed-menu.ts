// Seed script for restaurant menu data
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMenu() {
  console.log('🌮 Seeding restaurant menu...')

  // Create categories
  const tacosCategory = await prisma.menuCategory.create({
    data: {
      name: 'Tacos',
      description: 'Authentic street-style tacos on fresh corn tortillas',
      displayOrder: 1,
      active: true
    }
  })

  const bowlsCategory = await prisma.menuCategory.create({
    data: {
      name: 'Bowls',
      description: 'Build your own bowl with rice, beans, and toppings',
      displayOrder: 2,
      active: true
    }
  })

  const sidesCategory = await prisma.menuCategory.create({
    data: {
      name: 'Sides & Drinks',
      description: 'Complete your meal',
      displayOrder: 3,
      active: true
    }
  })

  console.log('✅ Categories created')

  // Create taco menu items with customizations
  const carneAsada = await prisma.menuItem.create({
    data: {
      categoryId: tacosCategory.id,
      sku: 'taco-carne-asada',
      name: 'Carne Asada Taco',
      description: 'Grilled marinated steak with cilantro, onions, and lime',
      priceCents: 450,
      available: true,
      prepTimeMins: 8,
      allergens: null,
      displayOrder: 1,
      customizations: {
        create: [
          { name: 'Extra meat', priceCents: 200, available: true },
          { name: 'Add guacamole', priceCents: 150, available: true },
          { name: 'Extra cheese', priceCents: 100, available: true },
          { name: 'No cilantro', priceCents: 0, available: true },
          { name: 'No onions', priceCents: 0, available: true }
        ]
      }
    }
  })

  const pollo = await prisma.menuItem.create({
    data: {
      categoryId: tacosCategory.id,
      sku: 'taco-pollo',
      name: 'Pollo Asado Taco',
      description: 'Grilled chicken with pico de gallo and crema',
      priceCents: 400,
      available: true,
      prepTimeMins: 8,
      allergens: 'dairy',
      displayOrder: 2,
      customizations: {
        create: [
          { name: 'Extra chicken', priceCents: 175, available: true },
          { name: 'Add guacamole', priceCents: 150, available: true },
          { name: 'Extra cheese', priceCents: 100, available: true },
          { name: 'No crema', priceCents: 0, available: true }
        ]
      }
    }
  })

  const carnitas = await prisma.menuItem.create({
    data: {
      categoryId: tacosCategory.id,
      sku: 'taco-carnitas',
      name: 'Carnitas Taco',
      description: 'Slow-cooked pork with pickled onions and salsa verde',
      priceCents: 425,
      available: true,
      prepTimeMins: 8,
      allergens: null,
      displayOrder: 3,
      customizations: {
        create: [
          { name: 'Extra carnitas', priceCents: 190, available: true },
          { name: 'Add guacamole', priceCents: 150, available: true },
          { name: 'Extra spicy', priceCents: 0, available: true }
        ]
      }
    }
  })

  const alPastor = await prisma.menuItem.create({
    data: {
      categoryId: tacosCategory.id,
      sku: 'taco-al-pastor',
      name: 'Al Pastor Taco',
      description: 'Marinated pork with pineapple, cilantro, and onions',
      priceCents: 450,
      available: true,
      prepTimeMins: 8,
      allergens: null,
      displayOrder: 4,
      customizations: {
        create: [
          { name: 'Extra pork', priceCents: 200, available: true },
          { name: 'Add guacamole', priceCents: 150, available: true },
          { name: 'Extra pineapple', priceCents: 50, available: true },
          { name: 'No pineapple', priceCents: 0, available: true }
        ]
      }
    }
  })

  const veggie = await prisma.menuItem.create({
    data: {
      categoryId: tacosCategory.id,
      sku: 'taco-veggie',
      name: 'Grilled Veggie Taco',
      description: 'Seasonal grilled vegetables with black beans and salsa verde',
      priceCents: 375,
      available: true,
      prepTimeMins: 7,
      allergens: null,
      displayOrder: 5,
      customizations: {
        create: [
          { name: 'Add guacamole', priceCents: 150, available: true },
          { name: 'Extra cheese', priceCents: 100, available: true },
          { name: 'Add beans', priceCents: 75, available: true }
        ]
      }
    }
  })

  const fish = await prisma.menuItem.create({
    data: {
      categoryId: tacosCategory.id,
      sku: 'taco-fish',
      name: 'Baja Fish Taco',
      description: 'Crispy beer-battered fish with cabbage slaw and chipotle mayo',
      priceCents: 500,
      available: true,
      prepTimeMins: 10,
      allergens: 'gluten,dairy',
      displayOrder: 6,
      customizations: {
        create: [
          { name: 'Extra fish', priceCents: 225, available: true },
          { name: 'Add guacamole', priceCents: 150, available: true },
          { name: 'No mayo', priceCents: 0, available: true }
        ]
      }
    }
  })

  console.log('✅ Taco items created')

  // Create bowl items
  const carneAsadaBowl = await prisma.menuItem.create({
    data: {
      categoryId: bowlsCategory.id,
      sku: 'bowl-carne-asada',
      name: 'Carne Asada Bowl',
      description: 'Rice, black beans, grilled steak, pico de gallo, cheese, and sour cream',
      priceCents: 1050,
      available: true,
      prepTimeMins: 12,
      allergens: 'dairy',
      displayOrder: 1,
      customizations: {
        create: [
          { name: 'Extra meat', priceCents: 300, available: true },
          { name: 'Add guacamole', priceCents: 200, available: true },
          { name: 'Extra cheese', priceCents: 100, available: true },
          { name: 'No beans', priceCents: 0, available: true },
          { name: 'Brown rice', priceCents: 0, available: true }
        ]
      }
    }
  })

  const polloBowl = await prisma.menuItem.create({
    data: {
      categoryId: bowlsCategory.id,
      sku: 'bowl-pollo',
      name: 'Pollo Asado Bowl',
      description: 'Rice, pinto beans, grilled chicken, corn salsa, and crema',
      priceCents: 950,
      available: true,
      prepTimeMins: 12,
      allergens: 'dairy',
      displayOrder: 2,
      customizations: {
        create: [
          { name: 'Extra chicken', priceCents: 275, available: true },
          { name: 'Add guacamole', priceCents: 200, available: true },
          { name: 'Extra cheese', priceCents: 100, available: true }
        ]
      }
    }
  })

  const veggieBowl = await prisma.menuItem.create({
    data: {
      categoryId: bowlsCategory.id,
      sku: 'bowl-veggie',
      name: 'Veggie Bowl',
      description: 'Rice, black beans, grilled veggies, guacamole, and salsa verde',
      priceCents: 850,
      available: true,
      prepTimeMins: 10,
      allergens: null,
      displayOrder: 3,
      customizations: {
        create: [
          { name: 'Extra veggies', priceCents: 150, available: true },
          { name: 'Add cheese', priceCents: 100, available: true },
          { name: 'Add sour cream', priceCents: 75, available: true }
        ]
      }
    }
  })

  console.log('✅ Bowl items created')

  // Create sides and drinks
  await prisma.menuItem.create({
    data: {
      categoryId: sidesCategory.id,
      sku: 'side-chips-salsa',
      name: 'Chips & Salsa',
      description: 'Fresh tortilla chips with house-made salsa',
      priceCents: 450,
      available: true,
      prepTimeMins: 2,
      displayOrder: 1,
      customizations: {
        create: [
          { name: 'Add guacamole', priceCents: 250, available: true },
          { name: 'Add queso', priceCents: 200, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: sidesCategory.id,
      sku: 'side-rice-beans',
      name: 'Rice & Beans',
      description: 'Mexican rice and choice of black or pinto beans',
      priceCents: 400,
      available: true,
      prepTimeMins: 3,
      displayOrder: 2,
      customizations: {
        create: [
          { name: 'Add cheese', priceCents: 100, available: true },
          { name: 'Add sour cream', priceCents: 75, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: sidesCategory.id,
      sku: 'drink-horchata',
      name: 'Horchata',
      description: 'Traditional rice and cinnamon drink',
      priceCents: 350,
      available: true,
      prepTimeMins: 1,
      displayOrder: 3
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: sidesCategory.id,
      sku: 'drink-jamaica',
      name: 'Jamaica (Hibiscus)',
      description: 'Refreshing hibiscus flower tea',
      priceCents: 350,
      available: true,
      prepTimeMins: 1,
      displayOrder: 4
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: sidesCategory.id,
      sku: 'drink-tamarindo',
      name: 'Tamarindo',
      description: 'Sweet and tangy tamarind agua fresca',
      priceCents: 350,
      available: true,
      prepTimeMins: 1,
      displayOrder: 5
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: sidesCategory.id,
      sku: 'drink-soda',
      name: 'Mexican Soda',
      description: 'Bottled Jarritos or Mexican Coca-Cola',
      priceCents: 300,
      available: true,
      prepTimeMins: 1,
      displayOrder: 6
    }
  })

  console.log('✅ Sides and drinks created')
  console.log('🎉 Menu seeding complete!')
}

async function main() {
  try {
    await seedMenu()
  } catch (error) {
    console.error('❌ Error seeding menu:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
