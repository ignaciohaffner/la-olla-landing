import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { findAllOffers, createOffer, updateOffer, deleteOffer } from '../../repositories/offer.repository';

const CreateOfferSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    badge: z.string().optional(),
    validFrom: z.coerce.date(),
    validTo: z.coerce.date(),
    active: z.boolean().optional().default(true),
  })
  .refine((d) => d.validTo >= d.validFrom, { message: 'validTo must be >= validFrom', path: ['validTo'] });

const PatchOfferSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  badge: z.string().nullable().optional(),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
  active: z.boolean().optional(),
});

export async function listOffers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await findAllOffers());
  } catch (err) {
    next(err);
  }
}

export async function createOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = CreateOfferSchema.parse(req.body);
    res.status(201).json(await createOffer(data));
  } catch (err) {
    next(err);
  }
}

export async function patchOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const data = PatchOfferSchema.parse(req.body);
    res.json(await updateOffer(id, data));
  } catch (err) {
    next(err);
  }
}

export async function deleteOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    await deleteOffer(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
