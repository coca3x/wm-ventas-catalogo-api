import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    // Manejo de errores por defecto 500
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Ha ocurrido un error interno en el servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
