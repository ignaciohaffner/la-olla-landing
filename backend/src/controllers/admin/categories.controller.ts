import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  findAllCategories,
  createCategory,
  updateCategory,
  deleteCategoryIfEmpty,
} from '../../repositories/category.repository';

const CreateCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  sortOrder: z.number().int().optional().default(0),
});

const PatchCategorySchema = z
  .object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
    sortOrder: z.number().int().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' });

export async function listCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await findAllCategories());
  } catch (err) {
    next(err);
  }
}

export async function createCategoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = CreateCategorySchema.parse(req.body);
    const category = await createCategory(data);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function patchCategoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const data = PatchCategorySchema.parse(req.body);
    const category = await updateCategory(id, data);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const result = await deleteCategoryIfEmpty(id);
    if (result === 'not_found') {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    if (result === 'has_items') {
      res.status(409).json({ error: 'Category has items; remove or reassign them first' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
