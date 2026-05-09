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

export const findAllMenuWithCategories = () =>
  prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

export const createMenuItem = (data: {
  name: string;
  price: number;
  categoryId: number;
  description?: string;
  available?: boolean;
  sortOrder?: number;
}) =>
  prisma.menuItem.create({
    data: { sortOrder: 0, available: true, ...data },
  });

export const updateMenuItem = (id: number, data: Partial<{
  name: string;
  price: number;
  categoryId: number;
  description: string | null;
  available: boolean;
  sortOrder: number;
}>) => prisma.menuItem.update({ where: { id }, data });

export const deleteMenuItem = (id: number) =>
  prisma.menuItem.delete({ where: { id } });

export const bulkUpdatePrices = (items: { id: number; price: number }[]) =>
  Promise.all(items.map(({ id, price }) => prisma.menuItem.update({ where: { id }, data: { price } })));
