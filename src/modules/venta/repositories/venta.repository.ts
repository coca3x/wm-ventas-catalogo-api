import { pool, sql } from '../../../config/database';
import { IVenta, IDetalleVenta, IMetodoPago, IVentaRepository } from '../interfaces/venta.interface';

export class VentaRepository implements IVentaRepository {

    async findAll(): Promise<IVenta[]> {
        try {
            const result = await pool.request()
                .execute('spObtenerTodasVentas');
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener todas las ventas:', error);
            throw new Error('Error al obtener todas las ventas');
        }
    }

    async findById(id: number): Promise<IVenta | null> {
        try {
            const result = await pool.request()
                .input('VentaID', sql.Int, id)
                .execute('spObtenerVentaPorID');

            if (result.recordset.length === 0) {
                return null;
            }

            const venta = result.recordset[0];
            const detalle = await this.getDetalleVenta(id);
            venta.Detalle = detalle;

            return venta;
        } catch (error) {
            console.error(`Error al buscar venta con ID ${id}:`, error);
            throw new Error(`Error al buscar venta con ID ${id}`);
        }
    }

    async findByCode(codigo: string): Promise<IVenta | null> {
        try {
            const result = await pool.request()
                .input('CodigoVenta', sql.VarChar, codigo)
                .execute('spObtenerVentaPorCodigo');

            if (result.recordset.length === 0) {
                return null;
            }

            const venta = result.recordset[0];
            const detalle = await this.getDetalleVenta(venta.VentaID);
            venta.Detalle = detalle;

            return venta;
        } catch (error) {
            console.error(`Error al buscar venta con código ${codigo}:`, error);
            throw new Error(`Error al buscar venta con código ${codigo}`);
        }
    }

    async findByClienteNIT(nit: string): Promise<IVenta[]> {
        try {
            const result = await pool.request()
                .input('NIT', sql.VarChar, nit)
                .execute('spObtenerVentasPorCliente');

            return result.recordset;
        } catch (error) {
            console.error(`Error al buscar ventas para el cliente con NIT ${nit}:`, error);
            throw new Error(`Error al buscar ventas para el cliente con NIT ${nit}`);
        }
    }

    async findBetweenDates(fechaInicio: Date, fechaFin: Date): Promise<IVenta[]> {
        try {
            const result = await pool.request()
                .input('FechaInicio', sql.Date, fechaInicio)
                .input('FechaFin', sql.Date, fechaFin)
                .execute('spObtenerVentasPorFechas');

            return result.recordset;
        } catch (error) {
            console.error('Error al buscar ventas por rango de fechas:', error);
            throw new Error('Error al buscar ventas por rango de fechas');
        }
    }

    async create(venta: IVenta): Promise<IVenta> {
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();

            // Generar código de venta único basado en la fecha y un número aleatorio
            const fecha = new Date();
            const codigoVenta = `V${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

            // Encabezado de venta
            const ventaResult = await transaction.request()
                .input('CodigoVenta', sql.VarChar, codigoVenta)
                .input('NIT', sql.VarChar, venta.NIT)
                .input('MetodoPagoID', sql.Int, venta.MetodoPagoID)
                .execute('spInsertarVenta');

            const ventaID = ventaResult.recordset[0].VentaID;

            // Detalle de venta
            if (venta.Detalle && venta.Detalle.length > 0) {
                for (const detalle of venta.Detalle) {
                    await transaction.request()
                        .input('VentaID', sql.Int, ventaID)
                        .input('ProductoID', sql.Int, detalle.ProductoID)
                        .input('Cantidad', sql.Int, detalle.Cantidad)
                        .execute('spInsertarDetalleVenta');
                }
            }

            await transaction.commit();

            const ventaCompleta = await this.findById(ventaID);
            return ventaCompleta!;

        } catch (error) {
            await transaction.rollback();
            console.error('Error al crear venta:', error);
            throw new Error('Error al crear venta');
        }
    }

    async update(venta: IVenta): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('VentaID', sql.Int, venta.VentaID)
                .input('NIT', sql.VarChar, venta.NIT)
                .input('MetodoPagoID', sql.Int, venta.MetodoPagoID)
                .execute('spActualizarVenta');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al actualizar venta:', error);
            throw new Error('Error al actualizar venta');
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('VentaID', sql.Int, id)
                .execute('spEliminarVenta');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error(`Error al eliminar venta con ID ${id}:`, error);
            throw new Error(`Error al eliminar venta con ID ${id}`);
        }
    }

    async getDetalleVenta(ventaID: number): Promise<IDetalleVenta[]> {
        try {
            const result = await pool.request()
                .input('VentaID', sql.Int, ventaID)
                .execute('spObtenerDetalleVenta');

            return result.recordset;
        } catch (error) {
            console.error(`Error al obtener detalle de venta con ID ${ventaID}:`, error);
            throw new Error(`Error al obtener detalle de venta con ID ${ventaID}`);
        }
    }

    async getMetodosPago(): Promise<IMetodoPago[]> {
        try {
            const result = await pool.request()
                .query('SELECT * FROM MetodosPago');
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
            throw new Error('Error al obtener métodos de pago');
        }
    }
}
