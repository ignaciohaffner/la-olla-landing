import { Router } from 'express';
import { getSchedule } from '../controllers/schedule.controller';

const router = Router();
router.get('/schedule', getSchedule);
export default router;
