import { pool, sql } from '../config/database';
import { ICliente, IClienteRepository } from '../interfaces/Cliente.interface';

export class ClienteRepository implements IClienteRepository {

    async findAll(): Promise<ICliente[]> {
        try {
            const result = await pool.request()
                .execute('spObtenerTodosClientes');
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener todos los clientes:', error);
            throw new Error('Error al obtener todos los clientes');
        }
    }

    async findByNIT(nit: string): Promise<ICliente | null> {
        try {
            const result = await pool.request()
                .input('NIT', sql.VarChar, nit)
                .execute('spBuscarClientePorNIT');

            if (result.recordset.length === 0) {
                return null;
            }

            return result.recordset[0];
        } catch (error) {
            console.error(`Error al buscar cliente con NIT ${nit}:`, error);
            throw new Error(`Error al buscar cliente con NIT ${nit}`);
        }
    }

    async create(cliente: ICliente): Promise<ICliente> {
        try {
            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                await transaction.request()
                    .input('NIT', sql.VarChar, cliente.NIT)
                    .input('NombreCompleto', sql.VarChar, cliente.NombreCompleto)
                    .input('Telefono', sql.VarChar, cliente.Telefono)
                    .input('CorreoElectronico', sql.VarChar, cliente.CorreoElectronico || null)
                    .execute('spInsertarCliente');

                await transaction.commit();
                return cliente;
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw new Error('Error al crear cliente');
        }
    }

    async update(cliente: ICliente): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('NIT', sql.VarChar, cliente.NIT)
                .input('NombreCompleto', sql.VarChar, cliente.NombreCompleto)
                .input('Telefono', sql.VarChar, cliente.Telefono)
                .input('CorreoElectronico', sql.VarChar, cliente.CorreoElectronico || null)
                .execute('spActualizarCliente');

            return result.recordset.length > 0;
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            throw new Error('Error al actualizar cliente');
        }
    }

    async delete(nit: string): Promise<boolean> {
        try {
            const result = await pool.request()
                .input('NIT', sql.VarChar, nit)
                .execute('spEliminarCliente');

            return result.recordset.length > 0;
        } catch (error) {
            console.error(`Error al eliminar cliente con NIT ${nit}:`, error);
            throw new Error(`Error al eliminar cliente con NIT ${nit}`);
        }
    }
}
