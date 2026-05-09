import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  findAllMenuWithCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  bulkUpdatePrices,
} from '../../repositories/menu.repository';

const CreateMenuItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  categoryId: z.number().int().positive(),
  description: z.string().optional(),
  available: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const PatchMenuItemSchema = z
  .object({
    name: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    categoryId: z.number().int().positive().optional(),
    description: z.string().nullable().optional(),
    available: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' });

const BulkPriceSchema = z
  .array(z.object({ id: z.number().int().positive(), price: z.number().min(0) }))
  .min(1);

export async function getAdminMenu(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await findAllMenuWithCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function createItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = CreateMenuItemSchema.parse(req.body);
    const item = await createMenuItem(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function patchItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const data = PatchMenuItemSchema.parse(req.body);
    const item = await updateMenuItem(id, data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    await deleteMenuItem(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdatePricesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = BulkPriceSchema.parse(req.body);
    const updated = await bulkUpdatePrices(items);
    res.json({ updated: updated.length });
  } catch (err) {
    next(err);
  }
}
