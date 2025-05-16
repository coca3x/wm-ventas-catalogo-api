import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar y sanitizar datos del cliente
 * Implementa validaciones básicas y sanitización para reducir la carga en el controlador y servicio
 */
export const validateCliente = (req: Request, res: Response, next: NextFunction) => {
    // Solo validamos en POST y PUT
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.body.NIT) req.body.NIT = req.body.NIT.toString().trim();
        if (req.body.NombreCompleto) req.body.NombreCompleto = req.body.NombreCompleto.toString().trim();
        if (req.body.Telefono) req.body.Telefono = req.body.Telefono.toString().trim();
        if (req.body.CorreoElectronico && req.body.CorreoElectronico !== null) {
            req.body.CorreoElectronico = req.body.CorreoElectronico.toString().trim();
        }

        const { NIT, NombreCompleto, Telefono } = req.body;
        const errors = [];

        if (!NIT || NIT === '') {
            errors.push('El NIT es obligatorio');
        }

        if (!NombreCompleto || NombreCompleto === '') {
            errors.push('El nombre completo es obligatorio');
        }

        if (!Telefono || Telefono === '') {
            errors.push('El teléfono es obligatorio');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Datos de cliente inválidos',
                errors
            });
        }
    }

    if (req.params.nit && (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE')) {
        req.params.nit = req.params.nit.trim();
        if (req.params.nit === '') {
            return res.status(400).json({
                success: false,
                message: 'El NIT es obligatorio'
            });
        }
    }

    next();
};
