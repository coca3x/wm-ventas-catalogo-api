import { Router } from 'express';
import { DescuentoController } from './controllers/descuento.controller';
import { validateDescuento } from './middlewares/descuento.middleware';

const router = Router();
const controller = new DescuentoController();

// Rutas básicas CRUD
router.get('/', controller.getAll);
router.get('/tipos', controller.getTiposDescuento);
router.get('/:id', validateDescuento, controller.getById);
router.get('/producto/:productoId', controller.getByProductId);
router.post('/', validateDescuento, controller.create);
router.put('/:id', validateDescuento, controller.update);

// Rutas específicas para activar/desactivar
router.patch('/:id/activar', validateDescuento, controller.activate);
router.patch('/:id/desactivar', validateDescuento, controller.deactivate);

export default router;
