import { Request, Response } from 'express';
import { VentaController } from '../../../../../modules/venta/controllers/venta.controller';
import { VentaService } from '../../../../../modules/venta/services/venta.service';
import { IVenta, IDetalleVenta, IMetodoPago } from '../../../../../modules/venta/interfaces/venta.interface';

// Mock del servicio
jest.mock('../../../../../modules/venta/services/venta.service');

describe('VentaController', () => {
    let ventaController: VentaController;
    let mockService: jest.Mocked<VentaService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const mockDate = new Date('2023-11-01');

    beforeEach(() => {
        jest.clearAllMocks();
        mockService = new VentaService() as jest.Mocked<VentaService>;
        ventaController = new VentaController();

        // Inyectar el mock del servicio
        (ventaController as any).service = mockService;

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

    const mockDetalleVenta: IDetalleVenta = {
        DetalleID: 1,
        VentaID: 1,
        ProductoID: 1,
        Cantidad: 2,
        PrecioUnitario: 100,
        Subtotal: 200,
        MontoDescuento: 20,
        Total: 180,
        NombreProducto: 'Producto Test',
        CodigoProducto: 'PROD-001'
    };

    const mockVenta: IVenta = {
        VentaID: 1,
        CodigoVenta: 'V20231101-001',
        NIT: '12345678',
        FechaVenta: mockDate,
        MetodoPagoID: 1,
        Total: 180,
        Subtotal: 200,
        TotalDescuento: 20,
        Estado: true,
        Detalle: [mockDetalleVenta]
    };

    const mockMetodoPago: IMetodoPago = {
        MetodoPagoID: 1,
        Codigo: 'EFECTIVO',
        Descripcion: 'Pago en efectivo'
    };

    describe('getAll', () => {
        it('should return all ventas with status 200', async () => {
            // Arrange
            mockService.getAllVentas.mockResolvedValue([mockVenta]);

            // Act
            await ventaController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockVenta]
            });
            expect(mockService.getAllVentas).toHaveBeenCalledTimes(1);
        });

        it('should filter ventas by date range', async () => {
            // Arrange
            mockRequest.query = {
                fechaInicio: '2023-01-01',
                fechaFin: '2023-12-31'
            };
            mockService.getVentasByDateRange.mockResolvedValue([mockVenta]);

            // Act
            await ventaController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockVenta]
            });
            expect(mockService.getVentasByDateRange).toHaveBeenCalledWith(
                new Date('2023-01-01'),
                new Date('2023-12-31')
            );
        });

        it('should filter ventas by cliente NIT', async () => {
            // Arrange
            mockRequest.query = { nit: '12345678' };
            mockService.getVentasByCliente.mockResolvedValue([mockVenta]);

            // Act
            await ventaController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockVenta]
            });
            expect(mockService.getVentasByCliente).toHaveBeenCalledWith('12345678');
        });

        it('should return 400 for invalid date format', async () => {
            // Arrange
            mockRequest.query = {
                fechaInicio: 'invalid-date',
                fechaFin: '2023-12-31'
            };

            // Act
            await ventaController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Formato de fecha inválido'
            });
        });

        it('should return 404 if cliente not found', async () => {
            // Arrange
            mockRequest.query = { nit: 'nonexistent' };
            const mockError = new Error('No existe un cliente con el NIT nonexistent');
            mockService.getVentasByCliente.mockRejectedValue(mockError);

            // Act
            await ventaController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No existe un cliente con el NIT nonexistent'
            });
        });

        it('should return 500 if service throws an unexpected error', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockService.getAllVentas.mockRejectedValue(mockError);

            // Act
            await ventaController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener las ventas',
                error: mockError.message
            });
        });
    });

    describe('getById', () => {
        it('should return venta by ID with status 200', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockService.getVentaById.mockResolvedValue(mockVenta);

            // Act
            await ventaController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: mockVenta
            });
            expect(mockService.getVentaById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if venta not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockService.getVentaById.mockResolvedValue(null);

            // Act
            await ventaController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ninguna venta con el ID 999'
            });
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('Database error');
            mockService.getVentaById.mockRejectedValue(mockError);

            // Act
            await ventaController.getById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener la venta',
                error: mockError.message
            });
        });
    });

    describe('getByCode', () => {
        it('should return venta by code with status 200', async () => {
            // Arrange
            mockRequest.params = { codigo: 'V20231101-001' };
            mockService.getVentaByCode.mockResolvedValue(mockVenta);

            // Act
            await ventaController.getByCode(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: mockVenta
            });
            expect(mockService.getVentaByCode).toHaveBeenCalledWith('V20231101-001');
        });

        it('should return 404 if venta not found', async () => {
            // Arrange
            mockRequest.params = { codigo: 'INVALID-CODE' };
            mockService.getVentaByCode.mockResolvedValue(null);

            // Act
            await ventaController.getByCode(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ninguna venta con el código INVALID-CODE'
            });
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            mockRequest.params = { codigo: 'V20231101-001' };
            const mockError = new Error('Database error');
            mockService.getVentaByCode.mockRejectedValue(mockError);

            // Act
            await ventaController.getByCode(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener la venta',
                error: mockError.message
            });
        });
    });

    describe('create', () => {
        it('should create venta and return 201 status', async () => {
            // Arrange
            mockRequest.body = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 2
                    }
                ]
            };
            mockService.createVenta.mockResolvedValue(mockVenta);

            // Act
            await ventaController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Venta creada exitosamente',
                data: mockVenta
            });
            expect(mockService.createVenta).toHaveBeenCalledWith(mockRequest.body);
        });

        it('should return 400 if cliente not found', async () => {
            // Arrange
            mockRequest.body = {
                NIT: 'nonexistent',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 2
                    }
                ]
            };
            const mockError = new Error('No existe un cliente con el NIT nonexistent');
            mockService.createVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No existe un cliente con el NIT nonexistent'
            });
        });

        it('should return 400 if stock is insufficient', async () => {
            // Arrange
            mockRequest.body = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 1000 // Más que el stock disponible
                    }
                ]
            };
            const mockError = new Error('Stock insuficiente para el producto Producto Test');
            mockService.createVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Stock insuficiente para el producto Producto Test'
            });
        });

        it('should return 400 for validation errors', async () => {
            // Arrange
            mockRequest.body = {
                NIT: '12345678',
                MetodoPagoID: 1
                // Detalle faltante
            };
            const mockError = new Error('La venta debe tener al menos un producto');
            mockService.createVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'La venta debe tener al menos un producto'
            });
        });

        it('should return 500 for unexpected errors', async () => {
            // Arrange
            mockRequest.body = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 2
                    }
                ]
            };
            const mockError = new Error('Database error');
            mockService.createVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.create(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al crear la venta',
                error: mockError.message
            });
        });
    });

    describe('update', () => {
        it('should update venta and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                NIT: '87654321',
                MetodoPagoID: 2
            };
            mockService.updateVenta.mockResolvedValue(true);

            // Act
            await ventaController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Venta actualizada exitosamente'
            });
            expect(mockService.updateVenta).toHaveBeenCalledWith({
                ...mockRequest.body,
                VentaID: 1
            });
        });

        it('should return 404 if venta not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockRequest.body = {
                NIT: '12345678',
                MetodoPagoID: 1
            };
            mockService.updateVenta.mockResolvedValue(false);

            // Act
            await ventaController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ninguna venta con el ID 999'
            });
        });

        it('should return 404 if venta ID is invalid', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                NIT: '12345678',
                MetodoPagoID: 1
            };
            const mockError = new Error('No existe una venta con el ID 1');
            mockService.updateVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No existe una venta con el ID 1'
            });
        });

        it('should return 400 if cliente not found', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                NIT: 'nonexistent',
                MetodoPagoID: 1
            };
            const mockError = new Error('No existe un cliente con el NIT nonexistent');
            mockService.updateVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No existe un cliente con el NIT nonexistent'
            });
        });

        it('should return 500 for unexpected errors', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                NIT: '12345678',
                MetodoPagoID: 1
            };
            const mockError = new Error('Database error');
            mockService.updateVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.update(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al actualizar la venta',
                error: mockError.message
            });
        });
    });

    describe('delete', () => {
        it('should delete venta and return 200 status', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            mockService.deleteVenta.mockResolvedValue(true);

            // Act
            await ventaController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Venta anulada exitosamente y stock de productos restaurado'
            });
            expect(mockService.deleteVenta).toHaveBeenCalledWith(1);
        });

        it('should return 404 if venta not found', async () => {
            // Arrange
            mockRequest.params = { id: '999' };
            mockService.deleteVenta.mockResolvedValue(false);

            // Act
            await ventaController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No se encontró ninguna venta con el ID 999'
            });
        });

        it('should return 404 if venta ID is invalid', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('No existe una venta con el ID 1');
            mockService.deleteVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'No existe una venta con el ID 1'
            });
        });

        it('should return 500 for unexpected errors', async () => {
            // Arrange
            mockRequest.params = { id: '1' };
            const mockError = new Error('Database error');
            mockService.deleteVenta.mockRejectedValue(mockError);

            // Act
            await ventaController.delete(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al anular la venta',
                error: mockError.message
            });
        });
    });

    describe('getMetodosPago', () => {
        it('should return métodos de pago with status 200', async () => {
            // Arrange
            mockService.getMetodosPago.mockResolvedValue([mockMetodoPago]);

            // Act
            await ventaController.getMetodosPago(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                data: [mockMetodoPago]
            });
            expect(mockService.getMetodosPago).toHaveBeenCalledTimes(1);
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockService.getMetodosPago.mockRejectedValue(mockError);

            // Act
            await ventaController.getMetodosPago(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener los métodos de pago',
                error: mockError.message
            });
        });
    });
});
