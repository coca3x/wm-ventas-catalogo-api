import { Router } from 'express';
import { ReporteController } from './controllers/reporte.controller';
import { validateReporteQuery } from './middlewares/reporte.middleware';

const router = Router();
const controller = new ReporteController();

/**
 * @swagger
 * /api/reportes/productos/top:
 *   get:
 *     summary: Obtiene el top de productos más vendidos
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de productos a incluir en el reporte
 *       - in: query
 *         name: porMonto
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Ordenar por monto vendido (true) o por cantidad vendida (false)
 *     responses:
 *       200:
 *         description: Top de productos más vendidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cantidad de unidades vendidas"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ProductoID:
 *                         type: integer
 *                       CodigoProducto:
 *                         type: string
 *                       Nombre:
 *                         type: string
 *                       CantidadVendida:
 *                         type: integer
 *                       MontoTotal:
 *                         type: number
 *                       Posicion:
 *                         type: integer
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/productos/top', validateReporteQuery, controller.getTopProductos);

/**
 * @swagger
 * /api/reportes/clientes/top:
 *   get:
 *     summary: Obtiene el top de clientes que más han comprado
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Número de clientes a incluir en el reporte
 *       - in: query
 *         name: porTransacciones
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Ordenar por número de transacciones (true) o por monto comprado (false)
 *     responses:
 *       200:
 *         description: Top de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cantidad de transacciones"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       NIT:
 *                         type: string
 *                       NombreCompleto:
 *                         type: string
 *                       CantidadCompras:
 *                         type: integer
 *                       MontoTotal:
 *                         type: number
 *                       Posicion:
 *                         type: integer
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/clientes/top', validateReporteQuery, controller.getTopClientes);

/**
 * @swagger
 * /api/reportes/ventas/periodo:
 *   get:
 *     summary: Obtiene un reporte de ventas por periodo
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del periodo (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del periodo (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Reporte de ventas por periodo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 periodo:
 *                   type: object
 *                   properties:
 *                     fechaInicio:
 *                       type: string
 *                       format: date
 *                     fechaFin:
 *                       type: string
 *                       format: date
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Fecha:
 *                         type: string
 *                         format: date
 *                       CantidadVentas:
 *                         type: integer
 *                       SubtotalVentas:
 *                         type: number
 *                       TotalDescuentos:
 *                         type: number
 *                       TotalVentas:
 *                         type: number
 *       400:
 *         description: Parámetros de fecha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/ventas/periodo', validateReporteQuery, controller.getVentasPorPeriodo);

export default router;
