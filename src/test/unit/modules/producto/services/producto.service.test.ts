import { ProductoService } from '../../../../../modules/producto/services/producto.service';
import { ProductoRepository } from '../../../../../modules/producto/repositories/producto.repository';
import { IProducto } from '../../../../../modules/producto/interfaces/producto.interface';

// Mock the repository
jest.mock('../../../../../modules/producto/repositories/producto.repository');

describe('ProductoService', () => {
    let productoService: ProductoService;
    let mockRepository: jest.Mocked<ProductoRepository>;
    const mockDate = new Date('2023-11-01');

    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository = new ProductoRepository() as jest.Mocked<ProductoRepository>;
        productoService = new ProductoService();

        (productoService as any).repository = mockRepository;
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
        FechaCreacion: mockDate
    };

    describe('findProductosByFilters', () => {
        it('should call repository.findAll when no filters are provided', async () => {
            // Arrange
            mockRepository.findAll.mockResolvedValue([mockProducto]);

            // Act
            const result = await productoService.findProductosByFilters();

            // Assert
            expect(result).toEqual([mockProducto]);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(mockRepository.findByFilters).not.toHaveBeenCalled();
        });

        it('should call repository.findByFilters when filters are provided', async () => {
            // Arrange
            mockRepository.findByFilters.mockResolvedValue([mockProducto]);
            const codigo = 'PROD';
            const nombre = 'Test';

            // Act
            const result = await productoService.findProductosByFilters(codigo, nombre);

            // Assert
            expect(result).toEqual([mockProducto]);
            expect(mockRepository.findByFilters).toHaveBeenCalledWith({ codigo, nombre });
            expect(mockRepository.findAll).not.toHaveBeenCalled();
        });

        it('should call repository.findByFilters with only codigo', async () => {
            // Arrange
            mockRepository.findByFilters.mockResolvedValue([mockProducto]);
            const codigo = 'PROD';

            // Act
            const result = await productoService.findProductosByFilters(codigo);

            // Assert
            expect(result).toEqual([mockProducto]);
            expect(mockRepository.findByFilters).toHaveBeenCalledWith({ codigo, nombre: undefined });
        });

        it('should call repository.findByFilters with only nombre', async () => {
            // Arrange
            mockRepository.findByFilters.mockResolvedValue([mockProducto]);
            const nombre = 'Test';

            // Act
            const result = await productoService.findProductosByFilters(undefined, nombre);

            // Assert
            expect(result).toEqual([mockProducto]);
            expect(mockRepository.findByFilters).toHaveBeenCalledWith({ codigo: undefined, nombre });
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.findByFilters.mockRejectedValue(mockError);

            // Act & Assert
            await expect(productoService.findProductosByFilters('PROD', 'Test')).rejects.toThrow(mockError);
            expect(mockRepository.findByFilters).toHaveBeenCalledTimes(1);
        });
    });

    // More tests for other service methods can be added here...
});
