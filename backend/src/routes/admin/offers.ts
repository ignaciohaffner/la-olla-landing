import { Router } from 'express';
import { listOffers, createOfferHandler, patchOfferHandler, deleteOfferHandler } from '../../controllers/admin/offers.controller';

const router = Router();

router.get('/offers', listOffers);
router.post('/offers', createOfferHandler);
router.patch('/offers/:id', patchOfferHandler);
router.delete('/offers/:id', deleteOfferHandler);

export default router;
