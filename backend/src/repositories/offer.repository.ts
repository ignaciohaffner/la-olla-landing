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
