import { Router } from 'express';
import menuRouter from './menu';
import categoriesRouter from './categories';
import pizzaPartyRouter from './pizzaParty';
import offersRouter from './offers';
import scheduleRouter from './schedule';
import weeklyMenuRouter from './weeklyMenu';
import contactRouter from './contact';
import priceListRouter from './priceList';

const adminRouter = Router();

adminRouter.use(menuRouter);
adminRouter.use(categoriesRouter);
adminRouter.use(pizzaPartyRouter);
adminRouter.use(offersRouter);
adminRouter.use(scheduleRouter);
adminRouter.use(weeklyMenuRouter);
adminRouter.use(contactRouter);
adminRouter.use(priceListRouter);

export default adminRouter;
