import { Router } from 'express';
import { DescuentoController } from './controllers/descuento.controller';
import { validateDescuento } from './middlewares/descuento.middleware';

const router = Router();
const controller = new DescuentoController();

/**
 * @swagger
 * /api/descuentos:
 *   get:
 *     summary: Obtiene todos los descuentos
 *     tags: [Descuentos]
 *     parameters:
 *       - in: query
 *         name: productoId
 *         schema:
 *           type: integer
 *         description: Filtra por ID de producto
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *         description: Filtra por estado del descuento (true=activo, false=inactivo)
 *     responses:
 *       200:
 *         description: Lista de descuentos
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
 *                     $ref: '#/components/schemas/Descuento'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/descuentos/{id}:
 *   get:
 *     summary: Obtiene un descuento por su ID
 *     tags: [Descuentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Descuento'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/descuentos/producto/{productoId}:
 *   get:
 *     summary: Obtiene el descuento asociado a un producto
 *     tags: [Descuentos]
 *     parameters:
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Descuento del producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Descuento'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/producto/:productoId', controller.getByProductId);

/**
 * @swagger
 * /api/descuentos:
 *   post:
 *     summary: Crea un nuevo descuento
 *     tags: [Descuentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Descuento'
 *     responses:
 *       201:
 *         description: Descuento creado exitosamente
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
 *                   example: Descuento creado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Descuento'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El producto ya tiene un descuento asignado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', validateDescuento, controller.create);

/**
 * @swagger
 * /api/descuentos/{id}:
 *   put:
 *     summary: Actualiza un descuento existente
 *     tags: [Descuentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Descuento'
 *     responses:
 *       200:
 *         description: Descuento actualizado exitosamente
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
 *                   example: Descuento actualizado exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', validateDescuento, controller.update);

/**
 * @swagger
 * /api/descuentos/{id}/activar:
 *   put:
 *     summary: Activa un descuento
 *     tags: [Descuentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento activado exitosamente
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
 *                   example: Descuento activado exitosamente
 *       400:
 *         description: El descuento ya está activado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id/activar', controller.activate);

/**
 * @swagger
 * /api/descuentos/{id}/desactivar:
 *   put:
 *     summary: Desactiva un descuento
 *     tags: [Descuentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento desactivado exitosamente
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
 *                   example: Descuento desactivado exitosamente
 *       400:
 *         description: El descuento ya está desactivado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id/desactivar', controller.deactivate);

/**
 * @swagger
 * /api/descuentos/tipos:
 *   get:
 *     summary: Obtiene todos los tipos de descuento
 *     tags: [Descuentos]
 *     responses:
 *       200:
 *         description: Lista de tipos de descuento
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
 *                       TipoDescuentoID:
 *                         type: integer
 *                         example: 1
 *                       Codigo:
 *                         type: string
 *                         example: "PORCENTAJE"
 *                       Descripcion:
 *                         type: string
 *                         example: "Descuento por porcentaje"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/tipos', controller.getTiposDescuento);

export default router;
