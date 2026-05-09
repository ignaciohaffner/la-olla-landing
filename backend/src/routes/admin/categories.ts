import { Router } from 'express';
import {
  listCategories,
  createCategoryHandler,
  patchCategoryHandler,
  deleteCategoryHandler,
} from '../../controllers/admin/categories.controller';

const router = Router();

router.get('/categories', listCategories);
router.post('/categories', createCategoryHandler);
router.patch('/categories/:id', patchCategoryHandler);
router.delete('/categories/:id', deleteCategoryHandler);

export default router;
