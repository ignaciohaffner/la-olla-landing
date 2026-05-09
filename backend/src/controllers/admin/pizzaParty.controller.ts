import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PizzaPartyStatus } from '@prisma/client';
import {
  getPizzaPartyConfig,
  updatePizzaPartyConfig,
  listPizzaPartyRequests,
  updatePizzaPartyRequest,
} from '../../repositories/pizzaParty.repository';

const ConfigPatchSchema = z
  .object({
    pricePerPerson: z.number().positive().optional(),
    minimumGuests: z.number().int().positive().optional(),
    baseHours: z.number().int().positive().optional(),
    extraHourPrice: z.number().positive().optional(),
    mozzoPrice: z.number().positive().optional(),
    serviceDetails: z.string().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' });

const RequestPatchSchema = z
  .object({
    status: z.enum(['pending', 'confirmed', 'rejected']).optional(),
    adminNotes: z.string().nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' });

const statusValues: PizzaPartyStatus[] = ['pending', 'confirmed', 'rejected'];

export async function getConfig(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await getPizzaPartyConfig());
  } catch (err) {
    next(err);
  }
}

export async function patchConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = ConfigPatchSchema.parse(req.body);
    res.json(await updatePizzaPartyConfig(data));
  } catch (err) {
    next(err);
  }
}

export async function listRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.query;
    const statusFilter = typeof status === 'string' && statusValues.includes(status as PizzaPartyStatus)
      ? (status as PizzaPartyStatus)
      : undefined;
    res.json(await listPizzaPartyRequests(statusFilter));
  } catch (err) {
    next(err);
  }
}

export async function patchRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const data = RequestPatchSchema.parse(req.body);
    res.json(await updatePizzaPartyRequest(id, data as Parameters<typeof updatePizzaPartyRequest>[1]));
  } catch (err) {
    next(err);
  }
}
