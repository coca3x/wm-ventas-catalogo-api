import { Request, Response } from 'express';
import { ReporteController } from '../../../../../modules/reporte/controllers/reporte.controller';
import { ReporteService } from '../../../../../modules/reporte/services/reporte.service';
import { ITopProducto, ITopCliente } from '../../../../../modules/reporte/interfaces/reporte.interface';

// Mock del servicio
jest.mock('../../../../../modules/reporte/services/reporte.service');

describe('ReporteController', () => {
    let reporteController: ReporteController;
    let mockService: jest.Mocked<ReporteService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockService = new ReporteService() as jest.Mocked<ReporteService>;
        reporteController = new ReporteController();

        // Inyectar el mock del servicio
        (reporteController as any).service = mockService;

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

    const mockTopProducto: ITopProducto = {
        ProductoID: 1,
        CodigoProducto: 'PROD-001',
        Nombre: 'Producto Más Vendido',
        CantidadVendida: 50,
        MontoTotal: 5000,
        Posicion: 1
    };

    const mockTopCliente: ITopCliente = {
        NIT: '12345678',
        NombreCompleto: 'Cliente Top',
        CantidadCompras: 10,
        MontoTotal: 8000,
        Posicion: 1
    };

    const mockVentasPeriodo = [
        {
            Fecha: '2023-10-01',
            CantidadVentas: 5,
            SubtotalVentas: 500,
            TotalDescuentos: 50,
            TotalVentas: 450
        },
        {
            Fecha: '2023-10-02',
            CantidadVentas: 3,
            SubtotalVentas: 300,
            TotalDescuentos: 30,
            TotalVentas: 270
        }
    ];

    describe('getTopProductos', () => {
        it('should return top productos with default parameters', async () => {
            // Arrange
            mockService.getTopProductos.mockResolvedValue([mockTopProducto]);

            // Act
            await reporteController.getTopProductos(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Cantidad de unidades vendidas',
                data: [mockTopProducto]
            });
            expect(mockService.getTopProductos).toHaveBeenCalledWith(10, false);
        });

        it('should return top productos with custom limit', async () => {
            // Arrange
            mockRequest.query = { limite: '5' };
            mockService.getTopProductos.mockResolvedValue([mockTopProducto]);

            // Act
            await reporteController.getTopProductos(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Cantidad de unidades vendidas',
                data: [mockTopProducto]
            });
            expect(mockService.getTopProductos).toHaveBeenCalledWith(5, false);
        });

        it('should return top productos sorted by monto', async () => {
            // Arrange
            mockRequest.query = { porMonto: 'true' };
            mockService.getTopProductos.mockResolvedValue([mockTopProducto]);

            // Act
            await reporteController.getTopProductos(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Monto total vendido',
                data: [mockTopProducto]
            });
            expect(mockService.getTopProductos).toHaveBeenCalledWith(10, true);
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            const mockError = new Error('Service error');
            mockService.getTopProductos.mockRejectedValue(mockError);

            // Act
            await reporteController.getTopProductos(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener el top de productos',
                error: mockError.message
            });
        });
    });

    describe('getTopClientes', () => {
        it('should return top clientes with default parameters', async () => {
            // Arrange
            mockService.getTopClientes.mockResolvedValue([mockTopCliente]);

            // Act
            await reporteController.getTopClientes(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Cantidad de transacciones',
                data: [mockTopCliente]
            });
            expect(mockService.getTopClientes).toHaveBeenCalledWith(5, true);
        });

        it('should return top clientes with custom limit', async () => {
            // Arrange
            mockRequest.query = { limite: '10' };
            mockService.getTopClientes.mockResolvedValue([mockTopCliente]);

            // Act
            await reporteController.getTopClientes(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Cantidad de transacciones',
                data: [mockTopCliente]
            });
            expect(mockService.getTopClientes).toHaveBeenCalledWith(10, true);
        });

        it('should return top clientes sorted by monto', async () => {
            // Arrange
            mockRequest.query = { porTransacciones: 'false' };
            mockService.getTopClientes.mockResolvedValue([mockTopCliente]);

            // Act
            await reporteController.getTopClientes(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                message: 'Monto total comprado',
                data: [mockTopCliente]
            });
            expect(mockService.getTopClientes).toHaveBeenCalledWith(5, false);
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            const mockError = new Error('Service error');
            mockService.getTopClientes.mockRejectedValue(mockError);

            // Act
            await reporteController.getTopClientes(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener el top de clientes',
                error: mockError.message
            });
        });
    });

    describe('getVentasPorPeriodo', () => {
        it('should return ventas por periodo with valid dates', async () => {
            // Arrange
            mockRequest.query = {
                fechaInicio: '2023-10-01',
                fechaFin: '2023-10-31'
            };
            mockService.getVentasPorPeriodo.mockResolvedValue(mockVentasPeriodo);

            // Act
            await reporteController.getVentasPorPeriodo(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                success: true,
                periodo: {
                    fechaInicio: '2023-10-01',
                    fechaFin: '2023-10-31'
                },
                data: mockVentasPeriodo
            });
            expect(mockService.getVentasPorPeriodo).toHaveBeenCalledWith(
                new Date('2023-10-01'),
                new Date('2023-10-31')
            );
        });

        it('should return 500 if service throws an error', async () => {
            // Arrange
            mockRequest.query = {
                fechaInicio: '2023-10-01',
                fechaFin: '2023-10-31'
            };
            const mockError = new Error('Service error');
            mockService.getVentasPorPeriodo.mockRejectedValue(mockError);

            // Act
            await reporteController.getVentasPorPeriodo(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: 'Error al obtener ventas por periodo',
                error: mockError.message
            });
        });
    });
});
