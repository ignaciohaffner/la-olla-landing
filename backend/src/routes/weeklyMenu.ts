import { Router } from 'express';
import { getWeeklyMenu } from '../controllers/weeklyMenu.controller';

const router = Router();
router.get('/weekly-menu', getWeeklyMenu);
export default router;
