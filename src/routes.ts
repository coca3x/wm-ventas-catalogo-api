import { Router } from 'express';
import healthCheckRouter from './modules/healthCheck/routes';
import clienteRouter from './modules/cliente/routes';
import productoRouter from './modules/producto/routes';
import descuentoRouter from './modules/descuento/routes';
import ventaRouter from './modules/venta/routes';
import reporteRouter from './modules/reporte/routes';

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Operaciones relacionadas con clientes
 *   - name: Productos
 *     description: Operaciones relacionadas con productos
 *   - name: Descuentos
 *     description: Operaciones relacionadas con descuentos
 *   - name: Ventas
 *     description: Operaciones relacionadas con ventas
 *   - name: Reportes
 *     description: Operaciones relacionadas con reportes
 */

const router = Router();

router.use('/healthcheck', healthCheckRouter);
router.use('/clientes', clienteRouter);
router.use('/productos', productoRouter);
router.use('/descuentos', descuentoRouter);
router.use('/ventas', ventaRouter);
router.use('/reportes', reporteRouter);

export default router;
