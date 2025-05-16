import { Router } from 'express';
import { ClienteController } from '../controllers/Cliente.controller';

const router = Router();
const controller = new ClienteController();

router.get('/', controller.getAll);
router.get('/:nit', controller.getByNIT);
router.post('/', controller.create);
router.put('/:nit', controller.update);
router.delete('/:nit', controller.delete);

export default router;
