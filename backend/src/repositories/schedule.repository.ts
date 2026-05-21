import { prisma } from '../lib/prisma';

export const findAllSchedule = () =>
  prisma.schedule.findMany({ orderBy: { dayOfWeek: 'asc' } });

export const upsertScheduleDays = (days: {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  openTime2?: string | null;
  closeTime2?: string | null;
  specialNote?: string | null;
}[]) =>
  Promise.all(
    days.map((d) =>
      prisma.schedule.upsert({
        where: { dayOfWeek: d.dayOfWeek },
        update: {
          isOpen: d.isOpen,
          openTime: d.openTime,
          closeTime: d.closeTime,
          openTime2: d.openTime2 ?? null,
          closeTime2: d.closeTime2 ?? null,
          specialNote: d.specialNote ?? null,
        },
        create: {
          dayOfWeek: d.dayOfWeek,
          isOpen: d.isOpen,
          openTime: d.openTime,
          closeTime: d.closeTime,
          openTime2: d.openTime2 ?? null,
          closeTime2: d.closeTime2 ?? null,
          specialNote: d.specialNote ?? null,
        },
      })
    )
  );
