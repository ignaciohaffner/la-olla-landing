import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { findWeeklyMenuByWeekStart, upsertWeeklyMenuDay } from '../../repositories/weeklyMenu.repository';

const WeeklyMenuPutSchema = z
  .array(
    z.object({
      dayOfWeek: z.number().int().min(1).max(5),
      dishes: z.array(z.string()),
    })
  )
  .min(1)
  .max(5);

function getWeekStart(): Date {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const daysBack = (today.getUTCDay() + 6) % 7;
  return new Date(today.getTime() - daysBack * 86400000);
}

export async function getWeeklyMenu(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const weekStart = getWeekStart();
    res.json(await findWeeklyMenuByWeekStart(weekStart));
  } catch (err) {
    next(err);
  }
}

export async function putWeeklyMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const days = WeeklyMenuPutSchema.parse(req.body);
    const weekStart = getWeekStart();
    const results = await Promise.all(
      days.map((d) => upsertWeeklyMenuDay(weekStart, d.dayOfWeek, d.dishes))
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
}
