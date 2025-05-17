import { Request, Response } from 'express';
import { VentaService } from '../services/venta.service';

export class VentaController {
    private service: VentaService;

    constructor() {
        this.service = new VentaService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            // Si hay parámetros de fecha, filtrar por rango de fechas
            if (req.query.fechaInicio && req.query.fechaFin) {
                const fechaInicio = new Date(req.query.fechaInicio as string);
                const fechaFin = new Date(req.query.fechaFin as string);

                if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Formato de fecha inválido'
                    });
                }

                const ventas = await this.service.getVentasByDateRange(fechaInicio, fechaFin);
                return res.status(200).json({
                    success: true,
                    data: ventas
                });
            }

            // Si hay parámetro de cliente (NIT), filtrar por cliente
            if (req.query.nit) {
                const ventas = await this.service.getVentasByCliente(req.query.nit as string);
                return res.status(200).json({
                    success: true,
                    data: ventas
                });
            }

            // Si no hay filtros, retornar todas las ventas
            const ventas = await this.service.getAllVentas();
            return res.status(200).json({
                success: true,
                data: ventas
            });
        } catch (error: any) {
            if (error.message.includes('No existe un cliente')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al obtener las ventas',
                error: error.message
            });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const venta = await this.service.getVentaById(id);

            if (!venta) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ninguna venta con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                data: venta
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener la venta',
                error: error.message
            });
        }
    };

    getByCode = async (req: Request, res: Response) => {
        try {
            const codigo = req.params.codigo;
            const venta = await this.service.getVentaByCode(codigo);

            if (!venta) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ninguna venta con el código ${codigo}`
                });
            }

            return res.status(200).json({
                success: true,
                data: venta
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener la venta',
                error: error.message
            });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const ventaData = req.body;
            const venta = await this.service.createVenta(ventaData);

            return res.status(201).json({
                success: true,
                message: 'Venta creada exitosamente',
                data: venta
            });
        } catch (error: any) {
            if (error.message.includes('No existe un cliente') ||
                error.message.includes('No existe un producto') ||
                error.message.includes('Stock insuficiente')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('obligatorio') ||
                error.message.includes('debe tener al menos un producto')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al crear la venta',
                error: error.message
            });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const ventaData = { ...req.body, VentaID: id };

            const result = await this.service.updateVenta(ventaData);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ninguna venta con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Venta actualizada exitosamente'
            });
        } catch (error: any) {
            if (error.message.includes('No existe una venta')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('No existe un cliente')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('obligatorio')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al actualizar la venta',
                error: error.message
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.deleteVenta(id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ninguna venta con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Venta anulada exitosamente y stock de productos restaurado'
            });
        } catch (error: any) {
            if (error.message.includes('No existe una venta')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al anular la venta',
                error: error.message
            });
        }
    };

    getMetodosPago = async (_req: Request, res: Response) => {
        try {
            const metodosPago = await this.service.getMetodosPago();
            return res.status(200).json({
                success: true,
                data: metodosPago
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los métodos de pago',
                error: error.message
            });
        }
    };
}
