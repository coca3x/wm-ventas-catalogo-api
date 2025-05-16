import { Router } from 'express';
import healthCheckRouter from './modules/healthCheck/routes';
import clienteRouter from './modules/cliente/routes';
import productoRouter from './modules/producto/routes';

const router = Router();

router.use('/healthcheck', healthCheckRouter);
router.use('/clientes', clienteRouter);
router.use('/productos', productoRouter);

export default router;
