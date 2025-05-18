import { Router } from 'express';
import { VentaController } from './controllers/venta.controller';
import { validateVenta } from './middlewares/venta.middleware';

const router = Router();
const controller = new VentaController();

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtiene todas las ventas
 *     tags: [Ventas]
 *     parameters:
 *       - in: query
 *         name: nit
 *         schema:
 *           type: string
 *         description: Filtrar ventas por NIT del cliente
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venta'
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtiene una venta por su ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/ventas/codigo/{codigo}:
 *   get:
 *     summary: Obtiene una venta por su código
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/codigo/:codigo', controller.getByCode);

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Crea una nueva venta
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
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
 *                   example: Venta creada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
 *       400:
 *         description: Datos inválidos o recursos no disponibles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', validateVenta, controller.create);

/**
 * @swagger
 * /api/ventas/{id}:
 *   put:
 *     summary: Actualiza una venta existente
 *     description: Sólo permite actualizar el cliente (NIT) y el método de pago
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - NIT
 *               - MetodoPagoID
 *             properties:
 *               NIT:
 *                 type: string
 *                 description: NIT del cliente
 *               MetodoPagoID:
 *                 type: integer
 *                 description: ID del método de pago
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
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
 *                   example: Venta actualizada exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', validateVenta, controller.update);

/**
 * @swagger
 * /api/ventas/{id}:
 *   delete:
 *     summary: Anula una venta existente
 *     description: Cambia el estado de la venta a inactivo y restaura el stock de productos
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta anulada exitosamente
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
 *                   example: Venta anulada exitosamente y stock de productos restaurado
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', controller.delete);

/**
 * @swagger
 * /api/ventas/metodos-pago:
 *   get:
 *     summary: Obtiene todos los métodos de pago
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de métodos de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MetodoPagoID:
 *                         type: integer
 *                         example: 1
 *                       Codigo:
 *                         type: string
 *                         example: "EFECTIVO"
 *                       Descripcion:
 *                         type: string
 *                         example: "Pago en efectivo"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/metodos-pago', controller.getMetodosPago);

export default router;
