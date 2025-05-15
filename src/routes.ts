import { Router } from 'express';
import healthCheckRouter from './HealthCheck/HealthCheck.router';

const router = Router();

router.use('/healthcheck', healthCheckRouter);

export default router;
