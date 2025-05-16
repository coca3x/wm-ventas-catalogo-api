import { ICliente } from '../interfaces/Cliente.interface';
import { ClienteRepository } from '../repositories/Cliente.repository';

export class ClienteService {
    private repository: ClienteRepository;

    constructor() {
        this.repository = new ClienteRepository();
    }

    async getAllClientes(): Promise<ICliente[]> {
        return await this.repository.findAll();
    }

    async getClienteByNIT(nit: string): Promise<ICliente | null> {
        if (!nit || nit.trim() === '') {
            throw new Error('NIT no válido');
        }

        return await this.repository.findByNIT(nit.trim());
    }

    async createCliente(clienteData: ICliente): Promise<ICliente> {
        if (!clienteData.NIT || clienteData.NIT.trim() === '') {
            throw new Error('El NIT es obligatorio');
        }

        if (!clienteData.NombreCompleto || clienteData.NombreCompleto.trim() === '') {
            throw new Error('El nombre completo es obligatorio');
        }

        if (!clienteData.Telefono || clienteData.Telefono.trim() === '') {
            throw new Error('El teléfono es obligatorio');
        }

        const cliente: ICliente = {
            NIT: clienteData.NIT.trim(),
            NombreCompleto: clienteData.NombreCompleto.trim(),
            Telefono: clienteData.Telefono.trim(),
            CorreoElectronico: clienteData.CorreoElectronico ? clienteData.CorreoElectronico.trim() : undefined
        };

        const existingCliente = await this.repository.findByNIT(cliente.NIT);
        if (existingCliente) {
            throw new Error(`Ya existe un cliente con el NIT ${cliente.NIT}`);
        }

        return await this.repository.create(cliente);
    }

    async updateCliente(clienteData: ICliente): Promise<boolean> {
        if (!clienteData.NIT || clienteData.NIT.trim() === '') {
            throw new Error('El NIT es obligatorio');
        }

        const existingCliente = await this.repository.findByNIT(clienteData.NIT);
        if (!existingCliente) {
            throw new Error(`No existe un cliente con el NIT ${clienteData.NIT}`);
        }

        const cliente: ICliente = {
            NIT: clienteData.NIT.trim(),
            NombreCompleto: clienteData.NombreCompleto ? clienteData.NombreCompleto.trim() : existingCliente.NombreCompleto,
            Telefono: clienteData.Telefono ? clienteData.Telefono.trim() : existingCliente.Telefono,
            CorreoElectronico: clienteData.CorreoElectronico ? clienteData.CorreoElectronico.trim() : existingCliente.CorreoElectronico
        };

        return await this.repository.update(cliente);
    }

    async deleteCliente(nit: string): Promise<boolean> {
        if (!nit || nit.trim() === '') {
            throw new Error('NIT no válido');
        }

        const existingCliente = await this.repository.findByNIT(nit);
        if (!existingCliente) {
            throw new Error(`No existe un cliente con el NIT ${nit}`);
        }

        return await this.repository.delete(nit);
    }
}
