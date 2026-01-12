import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMoreliaMenu() {
  console.log('🌮 Seeding Taqueria Y Birriera Morelia #2 menu...')

  // Create categories
  const birriaCategory = await prisma.menuCategory.create({
    data: {
      name: '🔥 Birria Specialties',
      description: 'Our famous slow-cooked birria - the heart of our menu',
      displayOrder: 1,
      active: true
    }
  })

  const tacosCategory = await prisma.menuCategory.create({
    data: {
      name: '🌮 Street Tacos',
      description: 'Authentic Mexican street-style tacos',
      displayOrder: 2,
      active: true
    }
  })

  const platesCategory = await prisma.menuCategory.create({
    data: {
      name: '🍴 Plates & Combos',
      description: 'Complete meals with rice and beans',
      displayOrder: 3,
      active: true
    }
  })

  const drinksCategory = await prisma.menuCategory.create({
    data: {
      name: '🥤 Drinks & Sides',
      description: 'Refresh your meal',
      displayOrder: 4,
      active: true
    }
  })

  console.log('✅ Categories created')

  // Birria Specialties
  await prisma.menuItem.create({
    data: {
      categoryId: birriaCategory.id,
      sku: 'birria-taco',
      name: 'Birria Taco',
      description: 'Traditional birria on corn tortilla with cilantro & onions',
      priceCents: 350,
      available: true,
      prepTimeMins: 5,
      allergens: null,
      displayOrder: 1,
      customizations: {
        create: [
          { name: 'Extra cheese', priceCents: 75, available: true },
          { name: 'Extra cilantro', priceCents: 0, available: true },
          { name: 'No onions', priceCents: 0, available: true },
          { name: 'Extra consomé', priceCents: 150, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: birriaCategory.id,
      sku: 'quesabirria',
      name: 'Quesabirria',
      description: 'Crispy cheese-crusted tacos with birria & melted cheese',
      priceCents: 400,
      available: true,
      prepTimeMins: 7,
      allergens: 'dairy',
      displayOrder: 2,
      customizations: {
        create: [
          { name: 'Extra cheese', priceCents: 100, available: true },
          { name: 'Make it spicy', priceCents: 0, available: true },
          { name: 'Extra consomé', priceCents: 150, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: birriaCategory.id,
      sku: 'birria-plate',
      name: 'Birria Plate',
      description: 'Full plate with rice, beans, tortillas & consomé',
      priceCents: 1399,
      available: true,
      prepTimeMins: 10,
      allergens: null,
      displayOrder: 3,
      customizations: {
        create: [
          { name: 'Extra tortillas', priceCents: 150, available: true },
          { name: 'Extra consomé', priceCents: 200, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: birriaCategory.id,
      sku: 'consome-cup',
      name: 'Consomé (Cup)',
      description: 'Rich birria broth for dipping',
      priceCents: 300,
      available: true,
      prepTimeMins: 2,
      allergens: null,
      displayOrder: 4,
      customizations: {
        create: []
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: birriaCategory.id,
      sku: 'mulitas-birria',
      name: 'Mulitas de Birria',
      description: 'Two tortillas with birria, cheese & toppings',
      priceCents: 899,
      available: true,
      prepTimeMins: 8,
      allergens: 'dairy',
      displayOrder: 5,
      customizations: {
        create: [
          { name: 'Extra cheese', priceCents: 100, available: true },
          { name: 'Extra guacamole', priceCents: 150, available: true }
        ]
      }
    }
  })

  // Street Tacos
  const streetTacos = [
    { sku: 'taco-carne-asada', name: 'Carne Asada', desc: 'Grilled steak with cilantro & onions', price: 300 },
    { sku: 'taco-al-pastor', name: 'Al Pastor', desc: 'Marinated pork with pineapple', price: 300 },
    { sku: 'taco-pollo', name: 'Pollo Asado', desc: 'Grilled chicken with fresh toppings', price: 275 },
    { sku: 'taco-carnitas', name: 'Carnitas', desc: 'Slow-cooked pulled pork', price: 300 },
    { sku: 'taco-lengua', name: 'Lengua', desc: 'Beef tongue, tender and flavorful', price: 350 },
    { sku: 'taco-cabeza', name: 'Cabeza', desc: 'Beef head meat, traditional style', price: 350 }
  ]

  for (let i = 0; i < streetTacos.length; i++) {
    const taco = streetTacos[i]
    await prisma.menuItem.create({
      data: {
        categoryId: tacosCategory.id,
        sku: taco.sku,
        name: taco.name,
        description: taco.desc,
        priceCents: taco.price,
        available: true,
        prepTimeMins: 5,
        allergens: null,
        displayOrder: i + 1,
        customizations: {
          create: [
            { name: 'Extra meat', priceCents: 150, available: true },
            { name: 'Add guacamole', priceCents: 100, available: true },
            { name: 'Add cheese', priceCents: 75, available: true },
            { name: 'No cilantro', priceCents: 0, available: true },
            { name: 'No onions', priceCents: 0, available: true }
          ]
        }
      }
    })
  }

  // Plates & Combos
  await prisma.menuItem.create({
    data: {
      categoryId: platesCategory.id,
      sku: 'combo-3-tacos',
      name: '3 Taco Combo',
      description: 'Choice of 3 tacos with rice & beans',
      priceCents: 1099,
      available: true,
      prepTimeMins: 10,
      allergens: null,
      displayOrder: 1,
      customizations: {
        create: [
          { name: 'Extra taco', priceCents: 300, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: platesCategory.id,
      sku: 'quesadilla-plate',
      name: 'Quesadilla Plate',
      description: 'Large quesadilla with choice of meat, rice & beans',
      priceCents: 1199,
      available: true,
      prepTimeMins: 10,
      allergens: 'dairy',
      displayOrder: 2,
      customizations: {
        create: [
          { name: 'Extra meat', priceCents: 200, available: true },
          { name: 'Add guacamole', priceCents: 150, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: platesCategory.id,
      sku: 'burrito-supreme',
      name: 'Burrito Supreme',
      description: 'Loaded burrito with choice of meat, rice, beans, cheese & more',
      priceCents: 1099,
      available: true,
      prepTimeMins: 8,
      allergens: 'dairy',
      displayOrder: 3,
      customizations: {
        create: [
          { name: 'Add guacamole', priceCents: 150, available: true },
          { name: 'Add sour cream', priceCents: 75, available: true },
          { name: 'Make it spicy', priceCents: 0, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: platesCategory.id,
      sku: 'torta',
      name: 'Torta',
      description: 'Mexican sandwich with choice of meat, beans, lettuce, tomato & more',
      priceCents: 999,
      available: true,
      prepTimeMins: 7,
      allergens: 'gluten',
      displayOrder: 4,
      customizations: {
        create: [
          { name: 'Add avocado', priceCents: 100, available: true },
          { name: 'Add jalapeños', priceCents: 50, available: true }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: platesCategory.id,
      sku: 'sopes',
      name: 'Sopes (3)',
      description: 'Thick tortillas with meat, beans, lettuce, cheese & cream',
      priceCents: 1099,
      available: true,
      prepTimeMins: 10,
      allergens: 'dairy',
      displayOrder: 5,
      customizations: {
        create: [
          { name: 'Extra sope', priceCents: 350, available: true }
        ]
      }
    }
  })

  // Drinks & Sides
  const drinks = [
    { sku: 'horchata', name: 'Horchata', desc: 'Fresh rice cinnamon drink', price: 300 },
    { sku: 'jamaica', name: 'Jamaica', desc: 'Hibiscus flower water', price: 300 },
    { sku: 'tamarindo', name: 'Tamarindo', desc: 'Sweet tamarind drink', price: 300 },
    { sku: 'mexican-coke', name: 'Mexican Coke', desc: 'Glass bottle', price: 250 },
    { sku: 'jarritos', name: 'Jarritos', desc: 'Mexican soda - various flavors', price: 250 }
  ]

  for (let i = 0; i < drinks.length; i++) {
    const drink = drinks[i]
    await prisma.menuItem.create({
      data: {
        categoryId: drinksCategory.id,
        sku: drink.sku,
        name: drink.name,
        description: drink.desc,
        priceCents: drink.price,
        available: true,
        prepTimeMins: 1,
        allergens: null,
        displayOrder: i + 1,
        customizations: { create: [] }
      }
    })
  }

  await prisma.menuItem.create({
    data: {
      categoryId: drinksCategory.id,
      sku: 'rice-beans',
      name: 'Rice & Beans',
      description: 'Side of Mexican rice and refried beans',
      priceCents: 350,
      available: true,
      prepTimeMins: 3,
      allergens: null,
      displayOrder: 10,
      customizations: { create: [] }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: drinksCategory.id,
      sku: 'chips-guac',
      name: 'Chips & Guacamole',
      description: 'Fresh made daily',
      priceCents: 599,
      available: true,
      prepTimeMins: 2,
      allergens: null,
      displayOrder: 11,
      customizations: { create: [] }
    }
  })

  await prisma.menuItem.create({
    data: {
      categoryId: drinksCategory.id,
      sku: 'chips-salsa',
      name: 'Chips & Salsa',
      description: 'House-made salsa (red or green)',
      priceCents: 399,
      available: true,
      prepTimeMins: 2,
      allergens: null,
      displayOrder: 12,
      customizations: {
        create: [
          { name: 'Extra hot', priceCents: 0, available: true }
        ]
      }
    }
  })

  console.log('✅ Menu items created')
  console.log('🎉 Morelia menu seed complete!')
}

seedMoreliaMenu()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
