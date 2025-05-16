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

    describe('getByCode', () => {
        it('should return product by code with status 200', async () => {
            // Arrange
            mockRequest.params = { codigo: 'PROD-001' };
            mockService.getProductoByCode.mockResolvedValue(mockProducto);

            // Act
            await productoController.getByCode(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: mockProducto
            });
            expect(mockService.getProductoByCode).toHaveBeenCalledWith('PROD-001');
        });

        it('should return 404 if product not found by code', async () => {
            // Arrange
            mockRequest.params = { codigo: 'NON-EXIST' };
            mockService.getProductoByCode.mockResolvedValue(null);

            // Act
            await productoController.getByCode(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ningún producto con el código NON-EXIST'
            });
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            mockRequest.params = { codigo: 'PROD-001' };
            const mockError = new Error('Service error');
            mockService.getProductoByCode.mockRejectedValue(mockError);

            // Act
            await productoController.getByCode(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener el producto',
                error: mockError.message
            });
        });
    });

    describe('create', () => {
        it('should create product and return 201 status', async () => {
            // Arrange
            mockRequest.body = {
                CodigoProducto: 'PROD-002',
                Nombre: 'Nuevo Producto',
                Descripcion: 'Descripción de nuevo producto',
                PrecioUnitario: 200,
                UnidadID: 1,
                Stock: 25
            };
            mockService.createProducto.mockResolvedValue({
                ...mockRequest.body,
                ProductoID: 2,
                Estado: true,
                FechaCreacion: new Date()
            });

            // Act
            await productoController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Producto creado exitosamente',
                data: expect.objectContaining(mockRequest.body)
            });
            expect(mockService.createProducto).toHaveBeenCalledWith(mockRequest.body);
        });

        it('should return 400 if product with same code already exists', async () => {
            // Arrange
            mockRequest.body = {
                CodigoProducto: 'PROD-001',
                Nombre: 'Nuevo Producto',
                PrecioUnitario: 200,
                UnidadID: 1
            };
            const mockError = new Error('Ya existe un producto con el código PROD-001');
            mockService.createProducto.mockRejectedValue(mockError);

            // Act
            await productoController.create(mockRequest as Request, mockResponse as Response);

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
                CodigoProducto: 'PROD-002',
                // Missing Nombre
                PrecioUnitario: 200
            };
            const mockError = new Error('El nombre del producto es obligatorio');
            mockService.createProducto.mockRejectedValue(mockError);

            // Act
            await productoController.create(mockRequest as Request, mockResponse as Response);

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
                CodigoProducto: 'PROD-002',
                Nombre: 'Nuevo Producto',
                PrecioUnitario: 200,
                UnidadID: 1
            };
            const mockError = new Error('Database connection error');
            mockService.createProducto.mockRejectedValue(mockError);

            // Act
            await productoController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al crear el producto',
                error: mockError.message
            });
        });
    });

    describe('update', () => {
        it('should update product and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                Nombre: 'Producto Actualizado',
                PrecioUnitario: 150
            };
            mockService.updateProducto.mockResolvedValue(true);

            // Act
            await productoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Producto actualizado exitosamente'
            });
            expect(mockService.updateProducto).toHaveBeenCalledWith({
                ...mockRequest.body,
                ProductoID: 1
            });
        });

        it('should return 404 if product not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockRequest.body = {
                Nombre: 'Producto Actualizado'
            };
            mockService.updateProducto.mockResolvedValue(false);

            // Act
            await productoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ningún producto con el ID 999'
            });
        });

        it('should return 404 if product ID is not valid', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                Nombre: 'Producto Actualizado'
            };
            const mockError = new Error('No existe un producto con el ID 1');
            mockService.updateProducto.mockRejectedValue(mockError);

            // Act
            await productoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 400 if try to use existing code', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                CodigoProducto: 'EXIST-CODE'
            };
            const mockError = new Error('Ya existe otro producto con el código EXIST-CODE');
            mockService.updateProducto.mockRejectedValue(mockError);

            // Act
            await productoController.update(mockRequest as Request, mockResponse as Response);

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
                Nombre: 'Producto Actualizado'
            };
            const mockError = new Error('Database connection error');
            mockService.updateProducto.mockRejectedValue(mockError);

            // Act
            await productoController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al actualizar el producto',
                error: mockError.message
            });
        });
    });

    describe('delete', () => {
        it('should delete product and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockService.deleteProducto.mockResolvedValue(true);

            // Act
            await productoController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Producto eliminado exitosamente'
            });
            expect(mockService.deleteProducto).toHaveBeenCalledWith(1);
        });

        it('should return 404 if product not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockService.deleteProducto.mockResolvedValue(false);

            // Act
            await productoController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ningún producto con el ID 999'
            });
        });

        it('should return 404 if product ID is not valid', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('No existe un producto con el ID 1');
            mockService.deleteProducto.mockRejectedValue(mockError);

            // Act
            await productoController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('Database connection error');
            mockService.deleteProducto.mockRejectedValue(mockError);

            // Act
            await productoController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al eliminar el producto',
                error: mockError.message
            });
        });
    });

    describe('updateStock', () => {
        it('should update product stock and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = { cantidad: 10 };
            mockService.updateProductoStock.mockResolvedValue(true);

            // Act
            await productoController.updateStock(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Stock del producto actualizado exitosamente'
            });
            expect(mockService.updateProductoStock).toHaveBeenCalledWith(1, 10);
        });

        it('should return 400 if cantidad is not provided', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {}; // Missing cantidad

            // Act
            await productoController.updateStock(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Debe proporcionar una cantidad válida'
            });
        });

        it('should return 400 if cantidad is not a number', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = { cantidad: 'abc' };

            // Act
            await productoController.updateStock(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Debe proporcionar una cantidad válida'
            });
        });

        it('should return 400 if stock is insufficient', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = { cantidad: -100 }; // Trying to reduce more than available
            const mockError = new Error('Stock insuficiente para el producto Test Producto');
            mockService.updateProductoStock.mockRejectedValue(mockError);

            // Act
            await productoController.updateStock(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 404 if product not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockRequest.body = { cantidad: 10 };
            const mockError = new Error('No existe un producto con el ID 999');
            mockService.updateProductoStock.mockRejectedValue(mockError);

            // Act
            await productoController.updateStock(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: mockError.message
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = { cantidad: 10 };
            const mockError = new Error('Database connection error');
            mockService.updateProductoStock.mockRejectedValue(mockError);

            // Act
            await productoController.updateStock(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al actualizar el stock del producto',
                error: mockError.message
            });
        });
    });
});
