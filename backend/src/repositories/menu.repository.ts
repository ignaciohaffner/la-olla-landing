import { prisma } from '../lib/prisma';

export const findAvailableMenuWithCategories = () =>
  prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { available: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, price: true, description: true },
      },
    },
  });
