import { ReporteService } from '../../../../../modules/reporte/services/reporte.service';
import { ReporteRepository } from '../../../../../modules/reporte/repositories/reporte.repository';
import { ITopProducto, ITopCliente } from '../../../../../modules/reporte/interfaces/reporte.interface';

// Mock del repositorio
jest.mock('../../../../../modules/reporte/repositories/reporte.repository');

describe('ReporteService', () => {
    let reporteService: ReporteService;
    let mockRepository: jest.Mocked<ReporteRepository>;
    const mockDate = new Date('2023-11-01');

    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository = new ReporteRepository() as jest.Mocked<ReporteRepository>;
        reporteService = new ReporteService();

        // Inyectar el mock del repositorio
        (reporteService as any).repository = mockRepository;
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
        it('should return top productos with default limit and sorting by quantity', async () => {
            // Arrange
            mockRepository.getTopProductos.mockResolvedValue([mockTopProducto]);

            // Act
            const result = await reporteService.getTopProductos();

            // Assert
            expect(result).toEqual([mockTopProducto]);
            expect(mockRepository.getTopProductos).toHaveBeenCalledWith(10, false);
        });

        it('should return top productos with specified limit and sorting by amount', async () => {
            // Arrange
            mockRepository.getTopProductos.mockResolvedValue([mockTopProducto]);

            // Act
            const result = await reporteService.getTopProductos(5, true);

            // Assert
            expect(result).toEqual([mockTopProducto]);
            expect(mockRepository.getTopProductos).toHaveBeenCalledWith(5, true);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.getTopProductos.mockRejectedValue(mockError);

            // Act & Assert
            await expect(reporteService.getTopProductos()).rejects.toThrow(mockError);
            expect(mockRepository.getTopProductos).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTopClientes', () => {
        it('should return top clientes with default limit and sorting by transactions', async () => {
            // Arrange
            mockRepository.getTopClientes.mockResolvedValue([mockTopCliente]);

            // Act
            const result = await reporteService.getTopClientes();

            // Assert
            expect(result).toEqual([mockTopCliente]);
            expect(mockRepository.getTopClientes).toHaveBeenCalledWith(5, true);
        });

        it('should return top clientes with specified limit and sorting by amount', async () => {
            // Arrange
            mockRepository.getTopClientes.mockResolvedValue([mockTopCliente]);

            // Act
            const result = await reporteService.getTopClientes(10, false);

            // Assert
            expect(result).toEqual([mockTopCliente]);
            expect(mockRepository.getTopClientes).toHaveBeenCalledWith(10, false);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.getTopClientes.mockRejectedValue(mockError);

            // Act & Assert
            await expect(reporteService.getTopClientes()).rejects.toThrow(mockError);
            expect(mockRepository.getTopClientes).toHaveBeenCalledTimes(1);
        });
    });

    describe('getVentasPorPeriodo', () => {
        it('should return ventas by date range', async () => {
            // Arrange
            const fechaInicio = new Date('2023-10-01');
            const fechaFin = new Date('2023-10-31');
            mockRepository.getVentasPorPeriodo.mockResolvedValue(mockVentasPeriodo);

            // Act
            const result = await reporteService.getVentasPorPeriodo(fechaInicio, fechaFin);

            // Assert
            expect(result).toEqual(mockVentasPeriodo);
            expect(mockRepository.getVentasPorPeriodo).toHaveBeenCalledWith(fechaInicio, fechaFin);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const fechaInicio = new Date('2023-10-01');
            const fechaFin = new Date('2023-10-31');
            const mockError = new Error('Database error');
            mockRepository.getVentasPorPeriodo.mockRejectedValue(mockError);

            // Act & Assert
            await expect(reporteService.getVentasPorPeriodo(fechaInicio, fechaFin)).rejects.toThrow(mockError);
            expect(mockRepository.getVentasPorPeriodo).toHaveBeenCalledTimes(1);
        });
    });
});
