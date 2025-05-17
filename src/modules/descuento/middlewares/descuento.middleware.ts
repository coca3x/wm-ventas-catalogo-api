import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar datos esenciales del descuento
 */
export const validateDescuento = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.body.Valor !== undefined) {
            req.body.Valor = parseFloat(req.body.Valor);
        }

        if (req.body.ProductoID !== undefined) {
            req.body.ProductoID = parseInt(req.body.ProductoID);
        }

        if (req.body.TipoDescuentoID !== undefined) {
            req.body.TipoDescuentoID = parseInt(req.body.TipoDescuentoID);
        }

        if (req.method === 'POST') {
            const { ProductoID, TipoDescuentoID, Valor, FechaInicio, FechaFin } = req.body;
            const errors = [];

            if (!ProductoID || isNaN(ProductoID)) {
                errors.push('El ID del producto es obligatorio y debe ser un número');
            }

            if (!TipoDescuentoID || isNaN(TipoDescuentoID)) {
                errors.push('El tipo de descuento es obligatorio y debe ser un número');
            }

            if (!Valor || isNaN(Valor) || Valor <= 0) {
                errors.push('El valor del descuento debe ser un número positivo');
            }

            if (!FechaInicio) {
                errors.push('La fecha de inicio es obligatoria');
            }

            if (!FechaFin) {
                errors.push('La fecha de fin es obligatoria');
            }

            if (FechaInicio && FechaFin) {
                const fechaInicio = new Date(FechaInicio);
                const fechaFin = new Date(FechaFin);

                if (isNaN(fechaInicio.getTime())) {
                    errors.push('La fecha de inicio no es válida');
                }

                if (isNaN(fechaFin.getTime())) {
                    errors.push('La fecha de fin no es válida');
                }

                if (fechaInicio > fechaFin) {
                    errors.push('La fecha de inicio debe ser anterior a la fecha de fin');
                }
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de descuento inválidos',
                    errors
                });
            }
        }
    }

    if (req.params.id && ['GET', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El ID del descuento debe ser un número válido'
            });
        }
    }

    next();
};
