import { pool, sql } from '../../../config/database';
import { IDescuento, IDescuentoRepository, ITipoDescuento } from '../interfaces/descuento.interface';

export class DescuentoRepository implements IDescuentoRepository {

    async findAll(): Promise<IDescuento[]> {
        try {
            const result = await pool.request()
                .execute('spObtenerDescuentos');
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener todos los descuentos:', error);
            throw new Error('Error al obtener todos los descuentos');
        }
    }

    async findById(id: number): Promise<IDescuento | null> {
        try {
            const result = await pool.request()
                .input('DescuentoID', sql.Int, id)
                .execute('spObtenerDescuentoPorID');

            if (result.recordset.length === 0) {
                return null;
            }

            return result.recordset[0];
        } catch (error) {
            console.error(`Error al buscar descuento con ID ${id}:`, error);
            throw new Error(`Error al buscar descuento con ID ${id}`);
        }
    }

    async findByProductId(productoId: number): Promise<IDescuento | null> {
        try {
            const result = await pool.request()
                .input('ProductoID', sql.Int, productoId)
                .execute('spObtenerDescuentoPorProductoID');

            if (result.recordset.length === 0) {
                return null;
            }

            return result.recordset[0];
        } catch (error) {
            console.error(`Error al buscar descuento para el producto ${productoId}:`, error);
            throw new Error(`Error al buscar descuento para el producto ${productoId}`);
        }
    }

    async findByFilters(filters: { productoId?: number, estado?: boolean }): Promise<IDescuento[]> {
        try {
            const request = pool.request();

            if (filters.productoId !== undefined) {
                request.input('ProductoID', sql.Int, filters.productoId);
            } else {
                request.input('ProductoID', sql.Int, null);
            }

            if (filters.estado !== undefined) {
                request.input('Estado', sql.Bit, filters.estado);
            } else {
                request.input('Estado', sql.Bit, null);
            }

            const result = await request.execute('spFiltrarDescuentos');
            return result.recordset;
        } catch (error) {
            console.error('Error al filtrar descuentos:', error);
            throw new Error('Error al filtrar descuentos');
        }
    }

    async create(descuento: IDescuento): Promise<IDescuento> {
        try {
            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                const result = await transaction.request()
                    .input('ProductoID', sql.Int, descuento.ProductoID)
                    .input('TipoDescuentoID', sql.Int, descuento.TipoDescuentoID)
                    .input('Valor', sql.Decimal(10, 2), descuento.Valor)
                    .input('FechaInicio', sql.Date, descuento.FechaInicio)
                    .input('FechaFin', sql.Date, descuento.FechaFin)
                    .execute('spInsertarDescuento');

                await transaction.commit();

                if (result.recordset && result.recordset.length > 0) {
                    return result.recordset[0];
                }

                const newDescuento = await this.findByProductId(descuento.ProductoID);
                return newDescuento || descuento;
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error al crear descuento:', error);
            throw new Error('Error al crear descuento');
        }
    }

    async update(descuento: IDescuento): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('DescuentoID', sql.Int, descuento.DescuentoID)
                .input('ProductoID', sql.Int, descuento.ProductoID)
                .input('TipoDescuentoID', sql.Int, descuento.TipoDescuentoID)
                .input('Valor', sql.Decimal(10, 2), descuento.Valor)
                .input('FechaInicio', sql.Date, descuento.FechaInicio)
                .input('FechaFin', sql.Date, descuento.FechaFin)
                .execute('spActualizarDescuento');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al actualizar descuento:', error);
            throw new Error('Error al actualizar descuento');
        }
    }

    async activate(id: number): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('DescuentoID', sql.Int, id)
                .execute('spActivarDescuento');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error(`Error al activar descuento con ID ${id}:`, error);
            throw new Error(`Error al activar descuento con ID ${id}`);
        }
    }

    async deactivate(id: number): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('DescuentoID', sql.Int, id)
                .execute('spDesactivarDescuento');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error(`Error al desactivar descuento con ID ${id}:`, error);
            throw new Error(`Error al desactivar descuento con ID ${id}`);
        }
    }

    async getTiposDescuento(): Promise<ITipoDescuento[]> {
        try {
            const result = await pool.request()
                .query('SELECT * FROM TiposDescuento');
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener tipos de descuento:', error);
            throw new Error('Error al obtener tipos de descuento');
        }
    }
}
