import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar parámetros de consulta en reportes
 */
export const validateReporteQuery = (req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('/productos/top')) {
        if (req.query.limite) {
            const limite = parseInt(req.query.limite as string);
            if (isNaN(limite) || limite <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El límite debe ser un número positivo'
                });
            }
        }

        if (req.query.porMonto && req.query.porMonto !== 'true' && req.query.porMonto !== 'false') {
            return res.status(400).json({
                success: false,
                message: 'El parámetro porMonto debe ser true o false'
            });
        }
    }

    if (req.path.includes('/clientes/top')) {
        if (req.query.limite) {
            const limite = parseInt(req.query.limite as string);
            if (isNaN(limite) || limite <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El límite debe ser un número positivo'
                });
            }
        }

        if (req.query.porTransacciones && req.query.porTransacciones !== 'true' && req.query.porTransacciones !== 'false') {
            return res.status(400).json({
                success: false,
                message: 'El parámetro porTransacciones debe ser true o false'
            });
        }
    }

    if (req.path.includes('/ventas/periodo')) {
        if (!req.query.fechaInicio || !req.query.fechaFin) {
            return res.status(400).json({
                success: false,
                message: 'Los parámetros fechaInicio y fechaFin son obligatorios'
            });
        }

        const fechaInicio = new Date(req.query.fechaInicio as string);
        const fechaFin = new Date(req.query.fechaFin as string);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Formato de fecha inválido'
            });
        }

        if (fechaInicio > fechaFin) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de inicio debe ser anterior a la fecha de fin'
            });
        }
    }

    next();
};
