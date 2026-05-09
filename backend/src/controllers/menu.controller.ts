import { RequestHandler } from 'express';
import { getGroupedMenu, getCategories } from '../services/menu.service';

export const getMenu: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await getGroupedMenu());
  } catch (err) {
    next(err);
  }
};

export const listCategories: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await getCategories());
  } catch (err) {
    next(err);
  }
};
