import express from 'express';
import healthRouter from './routes/health';
import menuRouter from './routes/menu';
import pizzaPartyRouter from './routes/pizzaParty';
import scheduleRouter from './routes/schedule';
import weeklyMenuRouter from './routes/weeklyMenu';
import contactRouter from './routes/contact';
import offersRouter from './routes/offers';
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

app.use(errorHandler);

export default app;
