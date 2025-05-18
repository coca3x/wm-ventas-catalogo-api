import { Router } from 'express';
import { ClienteController } from './controllers/cliente.controller';
import { validateCliente } from './middlewares/cliente.middleware';

const router = Router();
const controller = new ClienteController();

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
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
 *                     $ref: '#/components/schemas/Cliente'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/clientes/{nit}:
 *   get:
 *     summary: Obtiene un cliente por su NIT
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: nit
 *         required: true
 *         schema:
 *           type: string
 *         description: NIT del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:nit', validateCliente, controller.getByNIT);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
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
 *                   example: Cliente creado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Conflicto, el cliente ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', validateCliente, controller.create);

/**
 * @swagger
 * /api/clientes/{nit}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: nit
 *         required: true
 *         schema:
 *           type: string
 *         description: NIT del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
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
 *                   example: Cliente actualizado exitosamente
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:nit', validateCliente, controller.update);

/**
 * @swagger
 * /api/clientes/{nit}:
 *   delete:
 *     summary: Elimina un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: nit
 *         required: true
 *         schema:
 *           type: string
 *         description: NIT del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
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
 *                   example: Cliente eliminado exitosamente
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:nit', validateCliente, controller.delete);

export default router;
