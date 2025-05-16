import { Router } from 'express';
import { ProductoController } from './controllers/producto.controller';
import { validateProducto } from './middlewares/producto.middleware';

const router = Router();
const controller = new ProductoController();

// Rutas básicas CRUD
router.get('/', controller.getAll);
router.get('/:id', validateProducto, controller.getById);
router.get('/codigo/:codigo', controller.getByCode);
router.post('/', validateProducto, controller.create);
router.put('/:id', validateProducto, controller.update);
router.delete('/:id', validateProducto, controller.delete);

// Rutas específicas
router.patch('/:id/stock', validateProducto, controller.updateStock);

export default router;
