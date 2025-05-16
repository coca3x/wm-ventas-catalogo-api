import express from 'express';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api', router);

// Error handling
app.use(errorHandler);

export default app;
