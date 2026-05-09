import { prisma } from '../lib/prisma';

export const findActiveOffers = (now: Date) =>
  prisma.offer.findMany({
    where: {
      active: true,
      validFrom: { lte: now },
      validTo: { gte: now },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      badge: true,
      validFrom: true,
      validTo: true,
      createdAt: true,
    },
  });

export const findAllOffers = () =>
  prisma.offer.findMany({ orderBy: { createdAt: 'desc' } });

export const createOffer = (data: {
  title: string;
  description: string;
  badge?: string;
  validFrom: Date;
  validTo: Date;
  active?: boolean;
}) => prisma.offer.create({ data: { active: true, ...data } });

export const updateOffer = (id: number, data: Partial<{
  title: string;
  description: string;
  badge: string | null;
  validFrom: Date;
  validTo: Date;
  active: boolean;
}>) => prisma.offer.update({ where: { id }, data });

export const deleteOffer = (id: number) =>
  prisma.offer.delete({ where: { id } });
