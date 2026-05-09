import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { findAllSchedule, upsertScheduleDays } from '../../repositories/schedule.repository';

const SchedulePatchSchema = z
  .array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      openTime: z.string().regex(/^\d{2}:\d{2}$/),
      closeTime: z.string().regex(/^\d{2}:\d{2}$/),
      isOpen: z.boolean(),
      specialNote: z.string().nullable().optional(),
    })
  )
  .length(7);

export async function getSchedule(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await findAllSchedule());
  } catch (err) {
    next(err);
  }
}

export async function patchSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const days = SchedulePatchSchema.parse(req.body);
    const updated = await upsertScheduleDays(days);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
