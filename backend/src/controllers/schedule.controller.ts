import { RequestHandler } from 'express';
import { getScheduleWithOpenNow } from '../services/schedule.service';

export const getSchedule: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await getScheduleWithOpenNow());
  } catch (err) {
    next(err);
  }
};
