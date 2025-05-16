import { Request, Response } from 'express';
import { DescuentoService } from '../services/descuento.service';

export class DescuentoController {
    private service: DescuentoService;

    constructor() {
        this.service = new DescuentoService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const productoId = req.query.productoId ? parseInt(req.query.productoId as string) : undefined;
            const estado = req.query.estado !== undefined ? req.query.estado === 'true' : undefined;

            // Si hay algún filtro se utiliza
            if (productoId !== undefined || estado !== undefined) {
                const descuentos = await this.service.getDescuentosByFilters(productoId, estado);
                return res.status(200).json({
                    success: true,
                    data: descuentos
                });
            }

            // Si no hay filtros obtener todo
            const descuentos = await this.service.getAllDescuentos();
            return res.status(200).json({
                success: true,
                data: descuentos
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los descuentos',
                error: error.message
            });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const descuento = await this.service.getDescuentoById(id);

            if (!descuento) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún descuento con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                data: descuento
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el descuento',
                error: error.message
            });
        }
    };

    getByProductId = async (req: Request, res: Response) => {
        try {
            const productoId = parseInt(req.params.productoId);
            const descuento = await this.service.getDescuentoByProductoId(productoId);

            if (!descuento) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún descuento para el producto con ID ${productoId}`
                });
            }

            return res.status(200).json({
                success: true,
                data: descuento
            });
        } catch (error: any) {
            if (error.message.includes('No existe un producto')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al obtener el descuento por producto',
                error: error.message
            });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const descuentoData = req.body;
            const descuento = await this.service.createDescuento(descuentoData);

            return res.status(201).json({
                success: true,
                message: 'Descuento creado exitosamente',
                data: descuento
            });
        } catch (error: any) {
            if (error.message.includes('ya tiene un descuento asignado') ||
                error.message.includes('No existe un producto')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('obligatorio') ||
                error.message.includes('debe ser') ||
                error.message.includes('no es válida') ||
                error.message.includes('debe ser un número positivo')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al crear el descuento',
                error: error.message
            });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const descuentoData = { ...req.body, DescuentoID: id };

            const result = await this.service.updateDescuento(descuentoData);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún descuento con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Descuento actualizado exitosamente'
            });
        } catch (error: any) {
            if (error.message.includes('No existe un descuento')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('ya tiene un descuento asignado') ||
                error.message.includes('debe ser')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el descuento',
                error: error.message
            });
        }
    };

    activate = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.activateDescuento(id);

            return res.status(200).json({
                success: true,
                message: 'Descuento activado exitosamente'
            });
        } catch (error: any) {
            if (error.message.includes('No existe un descuento')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('ya está activado')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al activar el descuento',
                error: error.message
            });
        }
    };

    deactivate = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const result = await this.service.deactivateDescuento(id);

            return res.status(200).json({
                success: true,
                message: 'Descuento desactivado exitosamente'
            });
        } catch (error: any) {
            if (error.message.includes('No existe un descuento')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('ya está desactivado')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al desactivar el descuento',
                error: error.message
            });
        }
    };

    getTiposDescuento = async (_req: Request, res: Response) => {
        try {
            const tiposDescuento = await this.service.getTiposDescuento();
            return res.status(200).json({
                success: true,
                data: tiposDescuento
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los tipos de descuento',
                error: error.message
            });
        }
    };
}
