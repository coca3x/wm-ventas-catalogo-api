import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar datos esenciales de la venta
 */
export const validateVenta = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST') {
        const { NIT, MetodoPagoID, Detalle } = req.body;
        const errors = [];

        if (!NIT || NIT.trim() === '') {
            errors.push('El NIT del cliente es obligatorio');
        }

        if (!MetodoPagoID || isNaN(parseInt(MetodoPagoID))) {
            errors.push('El método de pago es obligatorio y debe ser un número válido');
        } else {
            req.body.MetodoPagoID = parseInt(req.body.MetodoPagoID);
        }

        if (!Detalle || !Array.isArray(Detalle) || Detalle.length === 0) {
            errors.push('La venta debe incluir al menos un producto');
        } else {
            req.body.Detalle.forEach((item: any, index: number) => {
                if (!item.ProductoID || isNaN(parseInt(item.ProductoID))) {
                    errors.push(`El ID del producto en la línea ${index + 1} es obligatorio y debe ser un número válido`);
                } else {
                    req.body.Detalle[index].ProductoID = parseInt(item.ProductoID);
                }

                if (!item.Cantidad || isNaN(parseInt(item.Cantidad)) || parseInt(item.Cantidad) <= 0) {
                    errors.push(`La cantidad en la línea ${index + 1} debe ser un número positivo`);
                } else {
                    req.body.Detalle[index].Cantidad = parseInt(item.Cantidad);
                }
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Datos de venta inválidos',
                errors
            });
        }
    }

    if (req.method === 'PUT') {
        const { NIT, MetodoPagoID } = req.body;
        const errors = [];

        if (!NIT || NIT.trim() === '') {
            errors.push('El NIT del cliente es obligatorio');
        }

        if (!MetodoPagoID || isNaN(parseInt(MetodoPagoID))) {
            errors.push('El método de pago es obligatorio y debe ser un número válido');
        } else {
            req.body.MetodoPagoID = parseInt(req.body.MetodoPagoID);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Datos de venta inválidos',
                errors
            });
        }
    }

    if (req.params.id && ['GET', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la venta debe ser un número válido'
            });
        }
    }

    next();
};
