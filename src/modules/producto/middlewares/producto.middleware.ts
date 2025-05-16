import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar datos esenciales del producto
 */
export const validateProducto = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.body.CodigoProducto) req.body.CodigoProducto = req.body.CodigoProducto.toString().trim();
        if (req.body.Nombre) req.body.Nombre = req.body.Nombre.toString().trim();
        if (req.body.Descripcion) req.body.Descripcion = req.body.Descripcion.toString().trim();

        const { CodigoProducto, Nombre, PrecioUnitario, UnidadID } = req.body;
        const errors = [];

        if (!CodigoProducto || CodigoProducto === '') {
            errors.push('El código del producto es obligatorio');
        }

        if (!Nombre || Nombre === '') {
            errors.push('El nombre del producto es obligatorio');
        }

        if (!PrecioUnitario || isNaN(PrecioUnitario) || Number(PrecioUnitario) <= 0) {
            errors.push('El precio unitario debe ser un número positivo');
        }

        if (!UnidadID || isNaN(UnidadID) || Number(UnidadID) <= 0) {
            errors.push('La unidad de medida es obligatoria y debe ser un número válido');
        }

        if (req.body.PrecioUnitario) req.body.PrecioUnitario = Number(req.body.PrecioUnitario);
        if (req.body.UnidadID) req.body.UnidadID = Number(req.body.UnidadID);
        if (req.body.Stock !== undefined) req.body.Stock = Number(req.body.Stock);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Datos de producto inválidos',
                errors
            });
        }
    }

    if (req.params.id && (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE')) {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El ID del producto debe ser un número válido'
            });
        }
    }

    next();
};
