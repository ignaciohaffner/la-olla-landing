import { Router } from 'express';
import {
  getAdminMenu,
  createItem,
  patchItem,
  deleteItem,
  bulkUpdatePricesHandler,
} from '../../controllers/admin/menu.controller';

const router = Router();

router.get('/menu', getAdminMenu);
router.post('/menu/items', createItem);
router.patch('/menu/items/:id', patchItem);
router.delete('/menu/items/:id', deleteItem);
router.patch('/menu/prices', bulkUpdatePricesHandler);

export default router;
