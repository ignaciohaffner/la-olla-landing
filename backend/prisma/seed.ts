import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // T013 — Admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@laolla.com' },
    update: {},
    create: { email: 'admin@laolla.com', passwordHash },
  });

  // T014 — Categories
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

  const empanadasCat = await prisma.category.findUniqueOrThrow({ where: { slug: 'empanadas' } });
  const pastasCat    = await prisma.category.findUniqueOrThrow({ where: { slug: 'pastas' } });

  // T015 — Empanada flavours (price = 0, informative variants)
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
      create: {
        name,
        price: 0,
        categoryId: empanadasCat.id,
        available: true,
        sortOrder: i + 1,
      },
    });
  }

  // T016 — Pasta combinations (4 tipos × 3 salsas = 12 items)
  const tiposPasta  = ['Tallarines', 'Ñoquis', 'Ravioles', 'Sorrentinos'];
  const salsasPasta = ['con Salsa', 'con Bolognesa', 'con Estofado'];
  let pastaSortOrder = 1;
  for (const tipo of tiposPasta) {
    for (const salsa of salsasPasta) {
      const name = `${tipo} ${salsa}`;
      await prisma.menuItem.upsert({
        where: { name_categoryId: { name, categoryId: pastasCat.id } },
        update: {},
        create: {
          name,
          price: 1500,
          categoryId: pastasCat.id,
          available: true,
          sortOrder: pastaSortOrder++,
        },
      });
    }
  }

  // T017 — PizzaPartyConfig (single row, id = 1)
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

  // T018 — Schedule (7 rows, Sunday closed, Mon–Sat open 11:00–22:00)
  const scheduleRows = [
    { dayOfWeek: 0, isOpen: false, openTime: '11:00', closeTime: '22:00' },
    { dayOfWeek: 1, isOpen: true,  openTime: '11:00', closeTime: '22:00' },
    { dayOfWeek: 2, isOpen: true,  openTime: '11:00', closeTime: '22:00' },
    { dayOfWeek: 3, isOpen: true,  openTime: '11:00', closeTime: '22:00' },
    { dayOfWeek: 4, isOpen: true,  openTime: '11:00', closeTime: '22:00' },
    { dayOfWeek: 5, isOpen: true,  openTime: '11:00', closeTime: '22:00' },
    { dayOfWeek: 6, isOpen: true,  openTime: '11:00', closeTime: '22:00' },
  ];
  for (const row of scheduleRows) {
    await prisma.schedule.upsert({
      where: { dayOfWeek: row.dayOfWeek },
      update: { isOpen: row.isOpen, openTime: row.openTime, closeTime: row.closeTime },
      create: row,
    });
  }

  console.log('Seed completado ✓');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
