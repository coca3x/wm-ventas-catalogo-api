import { Router } from 'express';
import healthCheckRouter from './HealthCheck/HealthCheck.router';
import clienteRouter from './routes/Cliente.routes';

const router = Router();

router.use('/healthcheck', healthCheckRouter);
router.use('/clientes', clienteRouter);

export default router;
