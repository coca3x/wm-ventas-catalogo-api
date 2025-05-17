import { Router } from 'express';
import { ReporteController } from './controllers/reporte.controller';
import { validateReporteQuery } from './middlewares/reporte.middleware';

const router = Router();
const controller = new ReporteController();

router.get('/productos/top', validateReporteQuery, controller.getTopProductos);
router.get('/clientes/top', validateReporteQuery, controller.getTopClientes);
router.get('/ventas/periodo', validateReporteQuery, controller.getVentasPorPeriodo);

export default router;
