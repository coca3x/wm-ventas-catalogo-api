import { Router } from 'express';
import healthCheckRouter from './modules/healthCheck/routes';
import clienteRouter from './modules/cliente/routes';

const router = Router();

router.use('/healthcheck', healthCheckRouter);
router.use('/clientes', clienteRouter);

export default router;
