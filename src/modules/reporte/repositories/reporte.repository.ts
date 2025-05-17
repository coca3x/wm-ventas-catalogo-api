import { pool, sql } from '../../../config/database';
import { IReporteRepository, ITopProducto, ITopCliente } from '../interfaces/reporte.interface';

export class ReporteRepository implements IReporteRepository {

    async getTopProductos(limite: number = 10, porMonto: boolean = false): Promise<ITopProducto[]> {
        try {
            const result = await pool.request()
                .input('Limite', sql.Int, limite)
                .input('PorMonto', sql.Bit, porMonto)
                .execute('spObtenerTopProductos');

            return result.recordset;
        } catch (error) {
            console.error('Error al obtener top productos:', error);
            throw new Error('Error al obtener top productos');
        }
    }

    async getTopClientes(limite: number = 5, porTransacciones: boolean = true): Promise<ITopCliente[]> {
        try {
            const result = await pool.request()
                .input('Limite', sql.Int, limite)
                .input('PorTransacciones', sql.Bit, porTransacciones)
                .execute('spObtenerTopClientes');

            return result.recordset;
        } catch (error) {
            console.error('Error al obtener top clientes:', error);
            throw new Error('Error al obtener top clientes');
        }
    }

    async getVentasPorPeriodo(fechaInicio: Date, fechaFin: Date): Promise<any> {
        try {
            const result = await pool.request()
                .input('FechaInicio', sql.Date, fechaInicio)
                .input('FechaFin', sql.Date, fechaFin)
                .execute('spObtenerVentasPorPeriodo');

            return result.recordset;
        } catch (error) {
            console.error('Error al obtener ventas por periodo:', error);
            throw new Error('Error al obtener ventas por periodo');
        }
    }
}
