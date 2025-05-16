import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import corsOptions from './config/cors';

const app = express();

// CORS
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// Routes
app.use('/api', router);

// Error handling
app.use(errorHandler);

export default app;
