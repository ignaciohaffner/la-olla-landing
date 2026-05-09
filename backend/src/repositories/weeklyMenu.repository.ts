import { prisma } from '../lib/prisma';

export const findWeeklyMenuByWeekStart = (weekStart: Date) =>
  prisma.weeklyMenuDay.findMany({ where: { weekStart } });

export const upsertWeeklyMenuDay = (weekStart: Date, dayOfWeek: number, dishes: string[]) =>
  prisma.weeklyMenuDay.upsert({
    where: { weekStart_dayOfWeek: { weekStart, dayOfWeek } },
    update: { dishes },
    create: { weekStart, dayOfWeek, dishes },
  });
