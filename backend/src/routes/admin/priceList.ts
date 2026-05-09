import { Router } from 'express';
import { generatePriceListImage } from '../../controllers/admin/priceList.controller';

const router = Router();

router.get('/price-list/image', generatePriceListImage);

export default router;
