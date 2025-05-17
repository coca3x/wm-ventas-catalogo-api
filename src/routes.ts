import { Router } from 'express';
import healthCheckRouter from './modules/healthCheck/routes';
import clienteRouter from './modules/cliente/routes';
import productoRouter from './modules/producto/routes';
import descuentoRouter from './modules/descuento/routes';
import ventaRouter from './modules/venta/routes';
import reporteRouter from './modules/reporte/routes';

const router = Router();

router.use('/healthcheck', healthCheckRouter);
router.use('/clientes', clienteRouter);
router.use('/productos', productoRouter);
router.use('/descuentos', descuentoRouter);
router.use('/ventas', ventaRouter);
router.use('/reportes', reporteRouter);

export default router;
