import { Router } from 'express';
import { getSchedule, patchSchedule } from '../../controllers/admin/schedule.controller';

const router = Router();

router.get('/schedule', getSchedule);
router.patch('/schedule', patchSchedule);

export default router;
