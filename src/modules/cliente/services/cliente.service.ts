import { ICliente } from '../interfaces/cliente.interface';
import { ClienteRepository } from '../repositories/cliente.repository';

export class ClienteService {
    private repository: ClienteRepository;

    constructor() {
        this.repository = new ClienteRepository();
    }

    async getAllClientes(): Promise<ICliente[]> {
        return await this.repository.findAll();
    }

    async getClienteByNIT(nit: string): Promise<ICliente | null> {
        if (!nit) {
            throw new Error('NIT no válido');
        }

        return await this.repository.findByNIT(nit);
    }

    async createCliente(clienteData: ICliente): Promise<ICliente> {
        if (!clienteData.NIT) {
            throw new Error('El NIT es obligatorio');
        }

        if (!clienteData.NombreCompleto) {
            throw new Error('El nombre completo es obligatorio');
        }

        if (!clienteData.Telefono) {
            throw new Error('El teléfono es obligatorio');
        }

        const cliente: ICliente = {
            NIT: clienteData.NIT,
            NombreCompleto: clienteData.NombreCompleto,
            Telefono: clienteData.Telefono,
            CorreoElectronico: clienteData.CorreoElectronico
        };

        const existingCliente = await this.repository.findByNIT(cliente.NIT);
        if (existingCliente) {
            throw new Error(`Ya existe un cliente con el NIT ${cliente.NIT}`);
        }

        return await this.repository.create(cliente);
    }

    async updateCliente(clienteData: ICliente): Promise<boolean> {
        if (!clienteData.NIT) {
            throw new Error('El NIT es obligatorio');
        }

        const existingCliente = await this.repository.findByNIT(clienteData.NIT);
        if (!existingCliente) {
            throw new Error(`No existe un cliente con el NIT ${clienteData.NIT}`);
        }

        const cliente: ICliente = {
            NIT: clienteData.NIT,
            NombreCompleto: clienteData.NombreCompleto || existingCliente.NombreCompleto,
            Telefono: clienteData.Telefono || existingCliente.Telefono,
            CorreoElectronico: clienteData.CorreoElectronico || existingCliente.CorreoElectronico
        };

        return await this.repository.update(cliente);
    }

    async deleteCliente(nit: string): Promise<boolean> {
        if (!nit) {
            throw new Error('NIT no válido');
        }

        const existingCliente = await this.repository.findByNIT(nit);
        if (!existingCliente) {
            throw new Error(`No existe un cliente con el NIT ${nit}`);
        }

        return await this.repository.delete(nit);
    }
}