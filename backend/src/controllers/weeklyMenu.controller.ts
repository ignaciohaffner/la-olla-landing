import { RequestHandler } from 'express';
import { getCurrentWeekMenu } from '../services/weeklyMenu.service';

export const getWeeklyMenu: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await getCurrentWeekMenu());
  } catch (err) {
    next(err);
  }
};
