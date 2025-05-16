import { Request, Response } from 'express';
import { ClienteService } from '../services/Cliente.service';

export class ClienteController {
    private service: ClienteService;

    constructor() {
        this.service = new ClienteService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const clientes = await this.service.getAllClientes();
            return res.status(200).json({
                success: true,
                data: clientes
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los clientes',
                error: error.message
            });
        }
    };

    getByNIT = async (req: Request, res: Response) => {
        try {
            const nit = req.params.nit;
            const cliente = await this.service.getClienteByNIT(nit);

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún cliente con el NIT ${nit}`
                });
            }

            return res.status(200).json({
                success: true,
                data: cliente
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el cliente',
                error: error.message
            });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const clienteData = req.body;
            const cliente = await this.service.createCliente(clienteData);

            return res.status(201).json({
                success: true,
                message: 'Cliente creado exitosamente',
                data: cliente
            });
        } catch (error: any) {
            // Si es un error de validación, enviamos código 400
            if (error.message.includes('Ya existe un cliente')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('obligatorio')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al crear el cliente',
                error: error.message
            });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const nit = req.params.nit;
            const clienteData = { ...req.body, NIT: nit };

            const result = await this.service.updateCliente(clienteData);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún cliente con el NIT ${nit}`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cliente actualizado exitosamente'
            });
        } catch (error: any) {
            // Manejar errores específicos
            if (error.message.includes('No existe un cliente')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el cliente',
                error: error.message
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const nit = req.params.nit;
            const result = await this.service.deleteCliente(nit);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún cliente con el NIT ${nit}`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cliente eliminado exitosamente'
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar el cliente',
                error: error.message
            });
        }
    };
}
