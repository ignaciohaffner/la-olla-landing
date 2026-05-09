import { Router } from 'express';
import { getConfig, patchConfig, listRequests, patchRequest } from '../../controllers/admin/pizzaParty.controller';

const router = Router();

router.get('/pizza-party/config', getConfig);
router.patch('/pizza-party/config', patchConfig);
router.get('/pizza-party/requests', listRequests);
router.patch('/pizza-party/requests/:id', patchRequest);

export default router;
