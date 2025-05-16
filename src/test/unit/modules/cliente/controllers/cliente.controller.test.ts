import { Request, Response } from 'express';
import { ClienteController } from '../../../../../modules/cliente/controllers/cliente.controller';
import { ClienteService } from '../../../../../modules/cliente/services/cliente.service';
import { ICliente } from '../../../../../modules/cliente/interfaces/cliente.interface';

// Mock the service
jest.mock('../../../../../modules/cliente/services/cliente.service');

describe('ClienteController', () => {
    let clienteController: ClienteController;
    let mockService: jest.Mocked<ClienteService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockService = new ClienteService() as jest.Mocked<ClienteService>;
        clienteController = new ClienteController();

        (clienteController as any).service = mockService;


        jsonMock = jest.fn().mockReturnThis();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        mockRequest = {};
        mockResponse = {
            status: statusMock,
            json: jsonMock
        };
    });

    const mockCliente: ICliente = {
        NIT: '12345678',
        NombreCompleto: 'Test Cliente',
        Telefono: '12345678',
        CorreoElectronico: 'test@example.com',
        Estado: true,
        FechaCreacion: new Date()
    };

    describe('getAll', () => {
        it('should return all clientes with status 200', async () => {
            // Arrange
            mockService.getAllClientes.mockResolvedValue([mockCliente]);

            // Act
            await clienteController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockCliente]
            });
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            const mockError = new Error('Service error');
            mockService.getAllClientes.mockRejectedValue(mockError);

            // Act
            await clienteController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener los clientes',
                error: mockError.message
            });
        });
    });

    describe('getByNIT', () => {
        it('should return cliente by NIT with status 200', async () => {
            // Arrange
            mockRequest.params = { nit: '12345678' };
            mockService.getClienteByNIT.mockResolvedValue(mockCliente);

            // Act
            await clienteController.getByNIT(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: mockCliente
            });
        });

        it('should return 404 if cliente not found', async () => {
            // Arrange
            mockRequest.params = { nit: 'nonexistent' };
            mockService.getClienteByNIT.mockResolvedValue(null);

            // Act
            await clienteController.getByNIT(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: `No se encontró ningún cliente con el NIT nonexistent`
            });
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            mockRequest.params = { nit: '12345678' };
            const mockError = new Error('Service error');
            mockService.getClienteByNIT.mockRejectedValue(mockError);

            // Act
            await clienteController.getByNIT(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener el cliente',
                error: mockError.message
            });
        });
    });

    describe('create', () => {
        it('should create cliente and return 201 status', async () => {
            // Arrange
            mockRequest.body = mockCliente;
            mockService.createCliente.mockResolvedValue(mockCliente);

            // Act
            await clienteController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Cliente creado exitosamente',
                data: mockCliente
            });
        });

        it('should return 409 if cliente already exists', async () => {
            // Arrange
            mockRequest.body = mockCliente;
            const mockError = new Error('Ya existe un cliente con el NIT 12345678');
            mockService.createCliente.mockRejectedValue(mockError);

            // Act
            await clienteController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(409);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 400 if validation fails', async () => {
            // Arrange
            mockRequest.body = { NIT: '', NombreCompleto: 'Test' };
            const mockError = new Error('El NIT es obligatorio');
            mockService.createCliente.mockRejectedValue(mockError);

            // Act
            await clienteController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 for other errors', async () => {
            // Arrange
            mockRequest.body = mockCliente;
            const mockError = new Error('Database error');
            mockService.createCliente.mockRejectedValue(mockError);

            // Act
            await clienteController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al crear el cliente',
                error: mockError.message
            });
        });
    });

    describe('update', () => {
        it('should update cliente and return 200 status', async () => {
            // Arrange
            mockRequest.params = { nit: '12345678' };
            mockRequest.body = { NombreCompleto: 'Updated Name' };
            mockService.updateCliente.mockResolvedValue(true);

            // Act
            await clienteController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Cliente actualizado exitosamente'
            });
        });

        it('should return 404 if cliente not found', async () => {
            // Arrange
            mockRequest.params = { nit: 'nonexistent' };
            mockRequest.body = { NombreCompleto: 'Updated Name' };
            mockService.updateCliente.mockResolvedValue(false);

            // Act
            await clienteController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: `No se encontró ningún cliente con el NIT nonexistent`
            });
        });

        it('should return 404 if service throws "No existe un cliente" error', async () => {
            // Arrange
            mockRequest.params = { nit: '12345678' };
            mockRequest.body = { NombreCompleto: 'Updated Name' };
            const mockError = new Error('No existe un cliente con el NIT 12345678');
            mockService.updateCliente.mockRejectedValue(mockError);

            // Act
            await clienteController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 for other errors', async () => {
            // Arrange
            mockRequest.params = { nit: '12345678' };
            mockRequest.body = { NombreCompleto: 'Updated Name' };
            const mockError = new Error('Database error');
            mockService.updateCliente.mockRejectedValue(mockError);

            // Act
            await clienteController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al actualizar el cliente',
                error: mockError.message
            });
        });
    });

    describe('delete', () => {
        it('should delete cliente and return 200 status', async () => {
            // Arrange
            mockRequest.params = { nit: '12345678' };
            mockService.deleteCliente.mockResolvedValue(true);

            // Act
            await clienteController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Cliente eliminado exitosamente'
            });
        });

        it('should return 404 if cliente not found', async () => {
            // Arrange
            mockRequest.params = { nit: 'nonexistent' };
            mockService.deleteCliente.mockResolvedValue(false);

            // Act
            await clienteController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: `No se encontró ningún cliente con el NIT nonexistent`
            });
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            mockRequest.params = { nit: '12345678' };
            const mockError = new Error('Service error');
            mockService.deleteCliente.mockRejectedValue(mockError);

            // Act
            await clienteController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al eliminar el cliente',
                error: mockError.message
            });
        });
    });
});
