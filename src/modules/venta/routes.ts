import { Router } from 'express';
import { VentaController } from './controllers/venta.controller';
import { validateVenta } from './middlewares/venta.middleware';

const router = Router();
const controller = new VentaController();

// Rutas básicas CRUD
router.get('/', controller.getAll);
router.get('/metodos-pago', controller.getMetodosPago);
router.get('/:id', validateVenta, controller.getById);
router.get('/codigo/:codigo', controller.getByCode);
router.post('/', validateVenta, controller.create);
router.put('/:id', validateVenta, controller.update);
router.delete('/:id', validateVenta, controller.delete);

export default router;
