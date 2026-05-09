import { prisma } from '../lib/prisma';

export const findAllSchedule = () =>
  prisma.schedule.findMany({ orderBy: { dayOfWeek: 'asc' } });
