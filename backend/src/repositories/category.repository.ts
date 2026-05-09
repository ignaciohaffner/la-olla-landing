import { prisma } from '../lib/prisma';

export const findAllCategories = () =>
  prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });
