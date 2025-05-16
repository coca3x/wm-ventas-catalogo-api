import { Router } from 'express';
import { ClienteController } from './controllers/cliente.controller';
import { validateCliente } from './middlewares/cliente.middleware';

const router = Router();
const controller = new ClienteController();

router.get('/', controller.getAll);
router.get('/:nit', validateCliente, controller.getByNIT);
router.post('/', validateCliente, controller.create);
router.put('/:nit', validateCliente, controller.update);
router.delete('/:nit', validateCliente, controller.delete);

export default router;
