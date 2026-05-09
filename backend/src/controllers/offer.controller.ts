import { RequestHandler } from 'express';
import { getActiveOffers } from '../services/offer.service';

export const listOffers: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await getActiveOffers());
  } catch (err) {
    next(err);
  }
};
