import { Request, Response } from 'express';
import { DescuentoController } from '../../../../../modules/descuento/controllers/descuento.controller';
import { DescuentoService } from '../../../../../modules/descuento/services/descuento.service';
import { IDescuento, ITipoDescuento } from '../../../../../modules/descuento/interfaces/descuento.interface';

// Mock del servicio
jest.mock('../../../../../modules/descuento/services/descuento.service');

describe('DescuentoController', () => {
    let descuentoController: DescuentoController;
    let mockService: jest.Mocked<DescuentoService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const mockDate = new Date('2023-11-01');
    const futureDate = new Date('2023-12-31');

    beforeEach(() => {
        jest.clearAllMocks();
        mockService = new DescuentoService() as jest.Mocked<DescuentoService>;
        descuentoController = new DescuentoController();

        // Inyectar el mock del servicio
        (descuentoController as any).service = mockService;

        // Mock de respuesta HTTP
        jsonMock = jest.fn().mockReturnThis();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        mockRequest = {
            query: {},
            params: {},
            body: {}
        };
        mockResponse = {
            status: statusMock,
            json: jsonMock
        };
    });

    const mockTipoDescuento: ITipoDescuento = {
        TipoDescuentoID: 1,
        Codigo: 'PORCENTAJE',
        Descripcion: 'Descuento por porcentaje'
    };

    const mockDescuento: IDescuento = {
        DescuentoID: 1,
        ProductoID: 1,
        TipoDescuentoID: 1,
        Valor: 10,
        FechaInicio: mockDate,
        FechaFin: futureDate,
        Estado: true
    };

    describe('getAll', () => {
        it('should return all descuentos with status 200', async () => {
            // Arrange
            mockService.getAllDescuentos.mockResolvedValue([mockDescuento]);

            // Act
            await descuentoController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockDescuento]
            });
            expect(mockService.getAllDescuentos).toHaveBeenCalledTimes(1);
        });

        it('should filter descuentos by producto ID', async () => {
            // Arrange
            mockRequest.query = { productoId: '1' };
            mockService.getDescuentosByFilters.mockResolvedValue([mockDescuento]);

            // Act
            await descuentoController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockDescuento]
            });
            expect(mockService.getDescuentosByFilters).toHaveBeenCalledWith(1, undefined);
        });

        it('should filter descuentos by estado', async () => {
            // Arrange
            mockRequest.query = { estado: 'true' };
            mockService.getDescuentosByFilters.mockResolvedValue([mockDescuento]);

            // Act
            await descuentoController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockDescuento]
            });
            expect(mockService.getDescuentosByFilters).toHaveBeenCalledWith(undefined, true);
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            const mockError = new Error('Service error');
            mockService.getAllDescuentos.mockRejectedValue(mockError);

            // Act
            await descuentoController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener los descuentos',
                error: mockError.message
            });
        });
    });

    describe('getById', () => {
        it('should return descuento by ID with status 200', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockService.getDescuentoById.mockResolvedValue(mockDescuento);

            // Act
            await descuentoController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: mockDescuento
            });
            expect(mockService.getDescuentoById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if descuento not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockService.getDescuentoById.mockResolvedValue(null);

            // Act
            await descuentoController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ningún descuento con el ID 999'
            });
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('Service error');
            mockService.getDescuentoById.mockRejectedValue(mockError);

            // Act
            await descuentoController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener el descuento',
                error: mockError.message
            });
        });
    });

    describe('getByProductId', () => {
        it('should return descuento by producto ID with status 200', async () => {
            // Arrange
            mockRequest.params = { productoId: '1' };
            mockService.getDescuentoByProductoId.mockResolvedValue(mockDescuento);

            // Act
            await descuentoController.getByProductId(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: mockDescuento
            });
            expect(mockService.getDescuentoByProductoId).toHaveBeenCalledWith(1);
        });

        it('should return 404 if descuento not found for producto', async () => {
            // Arrange
            mockRequest.params = { productoId: '1' };
            mockService.getDescuentoByProductoId.mockResolvedValue(null);

            // Act
            await descuentoController.getByProductId(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ningún descuento para el producto con ID 1'
            });
        });

        it('should return 404 if producto not found', async () => {
            // Arrange
            mockRequest.params = { productoId: '999' };
            const mockError = new Error('No existe un producto con el ID 999');
            mockService.getDescuentoByProductoId.mockRejectedValue(mockError);

            // Act
            await descuentoController.getByProductId(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No existe un producto con el ID 999'
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            mockRequest.params = { productoId: '1' };
            const mockError = new Error('Database error');
            mockService.getDescuentoByProductoId.mockRejectedValue(mockError);

            // Act
            await descuentoController.getByProductId(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener el descuento por producto',
                error: mockError.message
            });
        });
    });

    describe('create', () => {
        it('should create descuento and return 201 status', async () => {
            // Arrange
            mockRequest.body = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: '2023-11-01',
                FechaFin: '2023-12-31'
            };
            mockService.createDescuento.mockResolvedValue(mockDescuento);

            // Act
            await descuentoController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Descuento creado exitosamente',
                data: mockDescuento
            });
            expect(mockService.createDescuento).toHaveBeenCalledWith(mockRequest.body);
        });

        it('should return 400 if producto already has a descuento', async () => {
            // Arrange
            mockRequest.body = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: '2023-11-01',
                FechaFin: '2023-12-31'
            };
            const mockError = new Error('El producto con ID 1 ya tiene un descuento asignado');
            mockService.createDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 400 if required fields are missing', async () => {
            // Arrange
            mockRequest.body = {
                ProductoID: 1,
                // Missing other required fields
            };
            const mockError = new Error('El tipo de descuento es obligatorio');
            mockService.createDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            mockRequest.body = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: '2023-11-01',
                FechaFin: '2023-12-31'
            };
            const mockError = new Error('Database error');
            mockService.createDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al crear el descuento',
                error: mockError.message
            });
        });
    });

    describe('update', () => {
        it('should update descuento and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                ProductoID: 1,
                TipoDescuentoID: 2,
                Valor: 15,
                FechaInicio: '2023-11-01',
                FechaFin: '2023-12-31'
            };
            mockService.updateDescuento.mockResolvedValue(true);

            // Act
            await descuentoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Descuento actualizado exitosamente'
            });
            expect(mockService.updateDescuento).toHaveBeenCalledWith({
                ...mockRequest.body,
                DescuentoID: 1
            });
        });

        it('should return 404 if descuento not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockRequest.body = {
                ProductoID: 1,
                TipoDescuentoID: 1
            };
            mockService.updateDescuento.mockResolvedValue(false);

            // Act
            await descuentoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ningún descuento con el ID 999'
            });
        });

        it('should return 404 if service throws "No existe un descuento" error', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockRequest.body = {
                ProductoID: 1,
                TipoDescuentoID: 1
            };
            const mockError = new Error('No existe un descuento con el ID 999');
            mockService.updateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 400 if producto already has a descuento', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                ProductoID: 2, // Cambiar a otro producto
                TipoDescuentoID: 1
            };
            const mockError = new Error('El producto con ID 2 ya tiene un descuento asignado');
            mockService.updateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                ProductoID: 1,
                TipoDescuentoID: 1
            };
            const mockError = new Error('Database error');
            mockService.updateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al actualizar el descuento',
                error: mockError.message
            });
        });
    });

    describe('activate', () => {
        it('should activate descuento and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockService.activateDescuento.mockResolvedValue(true);

            // Act
            await descuentoController.activate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Descuento activado exitosamente'
            });
            expect(mockService.activateDescuento).toHaveBeenCalledWith(1);
        });

        it('should return 404 if descuento not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            const mockError = new Error('No existe un descuento con el ID 999');
            mockService.activateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.activate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 400 if descuento is already active', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('El descuento con ID 1 ya está activado');
            mockService.activateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.activate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('Database error');
            mockService.activateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.activate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al activar el descuento',
                error: mockError.message
            });
        });
    });

    describe('deactivate', () => {
        it('should deactivate descuento and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockService.deactivateDescuento.mockResolvedValue(true);

            // Act
            await descuentoController.deactivate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Descuento desactivado exitosamente'
            });
            expect(mockService.deactivateDescuento).toHaveBeenCalledWith(1);
        });

        it('should return 404 if descuento not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            const mockError = new Error('No existe un descuento con el ID 999');
            mockService.deactivateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.deactivate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 400 if descuento is already inactive', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('El descuento con ID 1 ya está desactivado');
            mockService.deactivateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.deactivate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('Database error');
            mockService.deactivateDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.deactivate(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al desactivar el descuento',
                error: mockError.message
            });
        });
    });

    describe('getTiposDescuento', () => {
        it('should return tipos de descuento with status 200', async () => {
            // Arrange
            mockService.getTiposDescuento.mockResolvedValue([mockTipoDescuento]);

            // Act
            await descuentoController.getTiposDescuento(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockTipoDescuento]
            });
            expect(mockService.getTiposDescuento).toHaveBeenCalledTimes(1);
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            const mockError = new Error('Service error');
            mockService.getTiposDescuento.mockRejectedValue(mockError);

            // Act
            await descuentoController.getTiposDescuento(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener los tipos de descuento',
                error: mockError.message
            });
        });
    });
});
