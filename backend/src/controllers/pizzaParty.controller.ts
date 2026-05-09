import { RequestHandler } from 'express';
import { z } from 'zod';
import { getConfig, submitRequest } from '../services/pizzaParty.service';

const PizzaPartyRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  eventDate: z.coerce.date(),
  guests: z.number().int().positive(),
  extraHours: z.number().int().min(0),
  extraMozzos: z.number().int().min(0),
  message: z.string().optional(),
});

export const getPizzaPartyConfig: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await getConfig());
  } catch (err) {
    next(err);
  }
};

export const createPizzaPartyRequest: RequestHandler = async (req, res, next) => {
  try {
    const data = PizzaPartyRequestSchema.parse(req.body);
    res.json(await submitRequest(data));
  } catch (err) {
    next(err);
  }
};
