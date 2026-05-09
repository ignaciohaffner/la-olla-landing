import { prisma } from '../lib/prisma';

export const findWeeklyMenuByWeekStart = (weekStart: Date) =>
  prisma.weeklyMenuDay.findMany({ where: { weekStart } });
