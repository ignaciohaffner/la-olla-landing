import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@laolla.com' },
    update: {},
    create: { email: 'admin@laolla.com', passwordHash },
  });

  // Categories
  const categories = [
    { name: 'Comidas',    slug: 'comidas',    sortOrder: 1 },
    { name: 'Pizzas',     slug: 'pizzas',     sortOrder: 2 },
    { name: 'Tartas',     slug: 'tartas',     sortOrder: 3 },
    { name: 'Empanadas',  slug: 'empanadas',  sortOrder: 4 },
    { name: 'Pastas',     slug: 'pastas',     sortOrder: 5 },
    { name: 'Guarnición', slug: 'guarnicion', sortOrder: 6 },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  const comidasCat    = await prisma.category.findUniqueOrThrow({ where: { slug: 'comidas' } });
  const pizzasCat     = await prisma.category.findUniqueOrThrow({ where: { slug: 'pizzas' } });
  const tartasCat     = await prisma.category.findUniqueOrThrow({ where: { slug: 'tartas' } });
  const empanadasCat  = await prisma.category.findUniqueOrThrow({ where: { slug: 'empanadas' } });
  const pastasCat     = await prisma.category.findUniqueOrThrow({ where: { slug: 'pastas' } });
  const guarnicionCat = await prisma.category.findUniqueOrThrow({ where: { slug: 'guarnicion' } });

  // Pizzas (13 variedades, el admin fija los precios desde el panel)
  const pizzasNames = [
    'Muzzarella',
    'Muzza con jamón',
    'Muzza con jamón y morrón',
    'Napolitana',
    'Napolitana con jamón',
    'Muzza con huevo',
    'Muzza con roquefort',
    'Muzza con anchoas',
    'Muzza con jamón y ananá',
    'Muzza con panceta',
    'Muzza jamón palmito y huevo',
    'Calabresa',
    'Fugazzeta',
  ];
  for (let i = 0; i < pizzasNames.length; i++) {
    const name = pizzasNames[i];
    await prisma.menuItem.upsert({
      where: { name_categoryId: { name, categoryId: pizzasCat.id } },
      update: {},
      create: { name, price: 0, categoryId: pizzasCat.id, available: true, sortOrder: i + 1 },
    });
  }

  // Tartas (el admin fija los precios desde el panel)
  const tartasNames = [
    'Jamón y queso',
    'Jamón queso y tomate',
    'Verdura',
    'Choclo',
  ];
  for (let i = 0; i < tartasNames.length; i++) {
    const name = tartasNames[i];
    await prisma.menuItem.upsert({
      where: { name_categoryId: { name, categoryId: tartasCat.id } },
      update: {},
      create: { name, price: 0, categoryId: tartasCat.id, available: true, sortOrder: i + 1 },
    });
  }

  // Empanadas (8 variedades, precio por unidad/docena se fija desde el panel)
  const empanadasNames = [
    'Carne salada',
    'Carne dulce',
    'Jamón y queso',
    'Cebolla y queso',
    'Verdura',
    'Choclo',
    'Pollo',
    'Queso dulce',
  ];
  for (let i = 0; i < empanadasNames.length; i++) {
    const name = empanadasNames[i];
    await prisma.menuItem.upsert({
      where: { name_categoryId: { name, categoryId: empanadasCat.id } },
      update: {},
      create: { name, price: 0, categoryId: empanadasCat.id, available: true, sortOrder: i + 1 },
    });
  }

  // Comidas principales
  const comidasItems = [
    'Carne al horno c/ guarnición',
    'Pollo al horno c/ guarnición',
    'Milanesa de carne x Kg',
    'Milanesa de pollo x Kg',
    'Milanesa de pescado x Kg',
    'Napolitana de carne x Kg',
    'Napolitana de pollo x Kg',
    'Tortilla de papa x Kg',
    'Tortilla de verdura x Kg',
  ];
  for (let i = 0; i < comidasItems.length; i++) {
    const name = comidasItems[i];
    await prisma.menuItem.upsert({
      where: { name_categoryId: { name, categoryId: comidasCat.id } },
      update: {},
      create: { name, price: 0, categoryId: comidasCat.id, available: true, sortOrder: i + 1 },
    });
  }

  // Guarnición
  const guarnicionItems = [
    'Papas fritas (porción)',
    'Papas fritas (2 porciones)',
    'Papas fritas (3 porciones)',
    'Puré',
    'Papa al horno',
    'Ensalada (surtida)',
  ];
  for (let i = 0; i < guarnicionItems.length; i++) {
    const name = guarnicionItems[i];
    await prisma.menuItem.upsert({
      where: { name_categoryId: { name, categoryId: guarnicionCat.id } },
      update: {},
      create: { name, price: 0, categoryId: guarnicionCat.id, available: true, sortOrder: i + 1 },
    });
  }

  // Pastas (4 tipos × 3 salsas)
  const tiposPasta  = ['Ñoquis', 'Ravioles', 'Tallarines', 'Sorrentinos'];
  const salsasPasta = ['con Salsa', 'con Bolognesa', 'con Estofado'];
  let pastaSortOrder = 1;
  for (const tipo of tiposPasta) {
    for (const salsa of salsasPasta) {
      const name = `${tipo} ${salsa}`;
      await prisma.menuItem.upsert({
        where: { name_categoryId: { name, categoryId: pastasCat.id } },
        update: {},
        create: { name, price: 0, categoryId: pastasCat.id, available: true, sortOrder: pastaSortOrder++ },
      });
    }
  }

  // PizzaPartyConfig
  await prisma.pizzaPartyConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      pricePerPerson: 1200,
      minimumGuests: 20,
      baseHours: 3,
      extraHourPrice: 800,
      mozzoPrice: 600,
      serviceDetails:
        'Incluye: empanadas de copetín de entrada, 13 variedades de pizza, horno móvil, ' +
        'platos/servilletas/cubiertos, 3 horas de duración. ' +
        'No incluye: bebidas, mesas, sillas, vasos.',
    },
  });

  // Horarios (Domingo cerrado, Lun–Vie 09:00–13:00 / 18:00–22:00, Sáb 10:00–20:00)
  const scheduleRows = [
    { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '13:00', openTime2: null, closeTime2: null },
    { dayOfWeek: 1, isOpen: true,  openTime: '09:00', closeTime: '13:00', openTime2: '18:00', closeTime2: '22:00' },
    { dayOfWeek: 2, isOpen: true,  openTime: '09:00', closeTime: '13:00', openTime2: '18:00', closeTime2: '22:00' },
    { dayOfWeek: 3, isOpen: true,  openTime: '09:00', closeTime: '13:00', openTime2: '18:00', closeTime2: '22:00' },
    { dayOfWeek: 4, isOpen: true,  openTime: '09:00', closeTime: '13:00', openTime2: '18:00', closeTime2: '22:00' },
    { dayOfWeek: 5, isOpen: true,  openTime: '09:00', closeTime: '13:00', openTime2: '18:00', closeTime2: '22:00' },
    { dayOfWeek: 6, isOpen: true,  openTime: '10:00', closeTime: '20:00', openTime2: null,    closeTime2: null    },
  ];
  for (const row of scheduleRows) {
    await prisma.schedule.upsert({
      where: { dayOfWeek: row.dayOfWeek },
      update: {
        isOpen: row.isOpen,
        openTime: row.openTime,
        closeTime: row.closeTime,
        openTime2: row.openTime2,
        closeTime2: row.closeTime2,
      },
      create: row,
    });
  }

  console.log('Seed completado ✓');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
