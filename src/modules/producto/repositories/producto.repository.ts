import { pool, sql } from '../../../config/database';
import { IProducto, IProductoRepository } from '../interfaces/producto.interface';

export class ProductoRepository implements IProductoRepository {

    async findAll(): Promise<IProducto[]> {
        try {
            const result = await pool.request()
                .execute('spObtenerProductos');
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            throw new Error('Error al obtener todos los productos');
        }
    }

    async findById(id: number): Promise<IProducto | null> {
        try {
            const result = await pool.request()
                .input('ProductoID', sql.Int, id)
                .execute('spObtenerProductoPorID');

            if (result.recordset.length === 0) {
                return null;
            }

            return result.recordset[0];
        } catch (error) {
            console.error(`Error al buscar producto con ID ${id}:`, error);
            throw new Error(`Error al buscar producto con ID ${id}`);
        }
    }

    async findByCode(codigo: string): Promise<IProducto | null> {
        try {
            const result = await pool.request()
                .input('CodigoProducto', sql.VarChar, codigo)
                .execute('spObtenerProductoPorCodigo');

            if (result.recordset.length === 0) {
                return null;
            }

            return result.recordset[0];
        } catch (error) {
            console.error(`Error al buscar producto con código ${codigo}:`, error);
            throw new Error(`Error al buscar producto con código ${codigo}`);
        }
    }

    async findByFilters(filters: { codigo?: string, nombre?: string }): Promise<IProducto[]> {
        try {
            const request = pool.request();

            if (filters.codigo) {
                request.input('CodigoProducto', sql.VarChar, `%${filters.codigo}%`);
            } else {
                request.input('CodigoProducto', sql.VarChar, null);
            }

            if (filters.nombre) {
                request.input('Nombre', sql.VarChar, `%${filters.nombre}%`);
            } else {
                request.input('Nombre', sql.VarChar, null);
            }

            const result = await request.execute('spFiltrarProductos');
            return result.recordset;
        } catch (error) {
            console.error('Error al filtrar productos:', error);
            throw new Error('Error al filtrar productos');
        }
    }

    async create(producto: IProducto): Promise<IProducto> {
        try {
            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                const result = await transaction.request()
                    .input('CodigoProducto', sql.VarChar, producto.CodigoProducto)
                    .input('Nombre', sql.VarChar, producto.Nombre)
                    .input('Descripcion', sql.Text, producto.Descripcion || null)
                    .input('PrecioUnitario', sql.Decimal(10, 2), producto.PrecioUnitario)
                    .input('UnidadID', sql.Int, producto.UnidadID)
                    .input('Stock', sql.Int, producto.Stock)
                    .execute('spInsertarProducto');

                await transaction.commit();

                const newProduct = await this.findByCode(producto.CodigoProducto);
                return newProduct || producto;
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw new Error('Error al crear producto');
        }
    }

    async update(producto: IProducto): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('ProductoID', sql.Int, producto.ProductoID)
                .input('CodigoProducto', sql.VarChar, producto.CodigoProducto)
                .input('Nombre', sql.VarChar, producto.Nombre)
                .input('Descripcion', sql.Text, producto.Descripcion || null)
                .input('PrecioUnitario', sql.Decimal(10, 2), producto.PrecioUnitario)
                .input('UnidadID', sql.Int, producto.UnidadID)
                .input('Stock', sql.Int, producto.Stock)
                .execute('spActualizarProducto');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw new Error('Error al actualizar producto');
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('ProductoID', sql.Int, id)
                .execute('spEliminarProducto');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error(`Error al eliminar producto con ID ${id}:`, error);
            throw new Error(`Error al eliminar producto con ID ${id}`);
        }
    }

    async updateStock(id: number, cantidad: number): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('ProductoID', sql.Int, id)
                .input('Cantidad', sql.Int, cantidad)
                .execute('spActualizarStockProducto');

            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error(`Error al actualizar stock del producto ${id}:`, error);
            throw new Error(`Error al actualizar stock del producto ${id}`);
        }
    }
}
