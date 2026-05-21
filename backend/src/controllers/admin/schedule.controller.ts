import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { findAllSchedule, upsertScheduleDays } from '../../repositories/schedule.repository';

const timeRegex = /^\d{2}:\d{2}$/;

const SchedulePatchSchema = z
  .array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      isOpen: z.boolean(),
      openTime: z.string().regex(timeRegex),
      closeTime: z.string().regex(timeRegex),
      openTime2: z.string().regex(timeRegex).nullable().optional(),
      closeTime2: z.string().regex(timeRegex).nullable().optional(),
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
