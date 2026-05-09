import { Router } from 'express';
import { getMenu, listCategories } from '../controllers/menu.controller';

const router = Router();
router.get('/menu', getMenu);
router.get('/categories', listCategories);
export default router;
