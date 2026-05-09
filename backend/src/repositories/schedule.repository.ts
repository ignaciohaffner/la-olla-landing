import { prisma } from '../lib/prisma';

export const findAllSchedule = () =>
  prisma.schedule.findMany({ orderBy: { dayOfWeek: 'asc' } });

export const upsertScheduleDays = (days: {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  specialNote?: string | null;
}[]) =>
  Promise.all(
    days.map((d) =>
      prisma.schedule.upsert({
        where: { dayOfWeek: d.dayOfWeek },
        update: { openTime: d.openTime, closeTime: d.closeTime, isOpen: d.isOpen, specialNote: d.specialNote ?? null },
        create: { dayOfWeek: d.dayOfWeek, openTime: d.openTime, closeTime: d.closeTime, isOpen: d.isOpen, specialNote: d.specialNote ?? null },
      })
    )
  );
