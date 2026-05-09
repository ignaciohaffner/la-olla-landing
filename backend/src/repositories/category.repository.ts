import { prisma } from '../lib/prisma';

export const findAllCategories = () =>
  prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });

export const createCategory = (data: { name: string; slug: string; sortOrder?: number }) =>
  prisma.category.create({ data: { sortOrder: 0, ...data } });

export const updateCategory = (id: number, data: Partial<{ name: string; slug: string; sortOrder: number }>) =>
  prisma.category.update({ where: { id }, data });

export const deleteCategoryIfEmpty = async (id: number): Promise<'deleted' | 'has_items' | 'not_found'> => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { items: true } } },
  });
  if (!category) return 'not_found';
  if (category._count.items > 0) return 'has_items';
  await prisma.category.delete({ where: { id } });
  return 'deleted';
};
