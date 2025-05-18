import { Request, Response } from 'express';
import { ReporteService } from '../services/reporte.service';

export class ReporteController {
    private service: ReporteService;

    constructor() {
        this.service = new ReporteService();
    }

    getTopProductos = async (req: Request, res: Response) => {
        try {
            const limite = req.query.limite ? parseInt(req.query.limite as string) : 10;
            const porMonto = req.query.porMonto === 'true';

            const productos = await this.service.getTopProductos(limite, porMonto);

            return res.status(200).json({
                success: true,
                message: porMonto ? 'Monto total vendido' : 'Cantidad de unidades vendidas',
                data: productos
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el top de productos',
                error: error.message
            });
        }
    };

    getTopClientes = async (req: Request, res: Response) => {
        try {
            const limite = req.query.limite ? parseInt(req.query.limite as string) : 5;
            const porTransacciones = req.query.porTransacciones !== 'false';

            const clientes = await this.service.getTopClientes(limite, porTransacciones);

            return res.status(200).json({
                success: true,
                message: porTransacciones ? 'Cantidad de transacciones' : 'Monto total comprado',
                data: clientes
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el top de clientes',
                error: error.message
            });
        }
    };

    getVentasPorPeriodo = async (req: Request, res: Response) => {
        try {
            const fechaInicio = new Date(req.query.fechaInicio as string);
            const fechaFin = new Date(req.query.fechaFin as string);

            const ventas = await this.service.getVentasPorPeriodo(fechaInicio, fechaFin);

            return res.status(200).json({
                success: true,
                periodo: {
                    fechaInicio: fechaInicio.toISOString().split('T')[0],
                    fechaFin: fechaFin.toISOString().split('T')[0]
                },
                data: ventas
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener ventas por periodo',
                error: error.message
            });
        }
    };
}
