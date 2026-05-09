import express from 'express';
import healthRouter from './routes/health';
import menuRouter from './routes/menu';
import pizzaPartyRouter from './routes/pizzaParty';
import scheduleRouter from './routes/schedule';
import weeklyMenuRouter from './routes/weeklyMenu';
import contactRouter from './routes/contact';
import offersRouter from './routes/offers';
import adminRouter from './routes/admin/index';
import { authMiddleware } from './middleware/auth';
import { loginHandler } from './controllers/admin/auth.controller';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.use('/api', healthRouter);
app.use('/api', menuRouter);
app.use('/api', pizzaPartyRouter);
app.use('/api', scheduleRouter);
app.use('/api', weeklyMenuRouter);
app.use('/api', contactRouter);
app.use('/api', offersRouter);

app.post('/api/admin/login', loginHandler);
app.use('/api/admin', authMiddleware, adminRouter);

app.use(errorHandler);

export default app;
