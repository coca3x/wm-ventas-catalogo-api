import { Request, Response } from 'express';
import { ProductoController } from '../../../../../modules/producto/controllers/producto.controller';
import { ProductoService } from '../../../../../modules/producto/services/producto.service';
import { IProducto } from '../../../../../modules/producto/interfaces/producto.interface';

// Mock the service
jest.mock('../../../../../modules/producto/services/producto.service');

describe('ProductoController', () => {
    let productoController: ProductoController;
    let mockService: jest.Mocked<ProductoService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockService = new ProductoService() as jest.Mocked<ProductoService>;
        productoController = new ProductoController();

        (productoController as any).service = mockService;

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

    const mockProducto: IProducto = {
        ProductoID: 1,
        CodigoProducto: 'PROD-001',
        Nombre: 'Test Producto',
        Descripcion: 'Descripción de prueba',
        PrecioUnitario: 100,
        UnidadID: 1,
        Stock: 50,
        Estado: true,
        FechaCreacion: new Date()
    };

    describe('getAll', () => {
        it('should return all products with status 200', async () => {
            // Arrange
            mockService.getAllProductos.mockResolvedValue([mockProducto]);

            // Act
            await productoController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockProducto]
            });
            expect(mockService.getAllProductos).toHaveBeenCalledTimes(1);
            expect(mockService.findProductosByFilters).not.toHaveBeenCalled();
        });

        it('should filter products when query parameters are provided', async () => {
            // Arrange
            mockRequest.query = { codigo: 'PROD', nombre: 'Test' };
            mockService.findProductosByFilters.mockResolvedValue([mockProducto]);

            // Act
            await productoController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockProducto]
            });
            expect(mockService.findProductosByFilters).toHaveBeenCalledWith('PROD', 'Test');
            expect(mockService.getAllProductos).not.toHaveBeenCalled();
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            const mockError = new Error('Service error');
            mockService.getAllProductos.mockRejectedValue(mockError);

            // Act
            await productoController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener los productos',
                error: mockError.message
            });
        });
    });

    describe('getById', () => {
        it('should return product by ID with status 200', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockService.getProductoById.mockResolvedValue(mockProducto);

            // Act
            await productoController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: mockProducto
            });
            expect(mockService.getProductoById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if product not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockService.getProductoById.mockResolvedValue(null);

            // Act
            await productoController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ningún producto con el ID 999'
            });
        });
    });

    // More tests for other controller methods can be added here...
});
