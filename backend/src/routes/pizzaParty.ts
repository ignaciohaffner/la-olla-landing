import { Router } from 'express';
import {
  getPizzaPartyConfig,
  createPizzaPartyRequest,
} from '../controllers/pizzaParty.controller';

const router = Router();
router.get('/pizza-party/config', getPizzaPartyConfig);
router.post('/pizza-party/request', createPizzaPartyRequest);
export default router;
