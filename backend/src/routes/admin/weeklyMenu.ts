import { Router } from 'express';
import { getWeeklyMenu, putWeeklyMenu } from '../../controllers/admin/weeklyMenu.controller';

const router = Router();

router.get('/weekly-menu', getWeeklyMenu);
router.put('/weekly-menu', putWeeklyMenu);

export default router;
