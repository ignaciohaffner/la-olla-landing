import { Router } from 'express';
import { listOffers } from '../controllers/offer.controller';

const router = Router();
router.get('/offers', listOffers);
export default router;
