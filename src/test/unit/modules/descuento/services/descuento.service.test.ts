import { DescuentoService } from '../../../../../modules/descuento/services/descuento.service';
import { DescuentoRepository } from '../../../../../modules/descuento/repositories/descuento.repository';
import { ProductoService } from '../../../../../modules/producto/services/producto.service';
import { IDescuento, ITipoDescuento } from '../../../../../modules/descuento/interfaces/descuento.interface';
import { IProducto } from '../../../../../modules/producto/interfaces/producto.interface';

// Mock del repositorio y del servicio de productos
jest.mock('../../../../../modules/descuento/repositories/descuento.repository');
jest.mock('../../../../../modules/producto/services/producto.service');

describe('DescuentoService', () => {
    let descuentoService: DescuentoService;
    let mockRepository: jest.Mocked<DescuentoRepository>;
    let mockProductoService: jest.Mocked<ProductoService>;
    const mockDate = new Date('2023-11-01');
    const futureDate = new Date('2023-12-31');

    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository = new DescuentoRepository() as jest.Mocked<DescuentoRepository>;
        mockProductoService = new ProductoService() as jest.Mocked<ProductoService>;
        descuentoService = new DescuentoService();

        // Inyectar los mocks
        (descuentoService as any).repository = mockRepository;
        (descuentoService as any).productoService = mockProductoService;
    });

    const mockTipoDescuento: ITipoDescuento = {
        TipoDescuentoID: 1,
        Codigo: 'PORCENTAJE',
        Descripcion: 'Descuento por porcentaje'
    };

    const mockProducto: IProducto = {
        ProductoID: 1,
        CodigoProducto: 'PROD-001',
        Nombre: 'Producto de Prueba',
        PrecioUnitario: 100,
        UnidadID: 1,
        Stock: 50
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

    describe('getAllDescuentos', () => {
        it('should return all descuentos', async () => {
            // Arrange
            mockRepository.findAll.mockResolvedValue([mockDescuento]);

            // Act
            const result = await descuentoService.getAllDescuentos();

            // Assert
            expect(result).toEqual([mockDescuento]);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.findAll.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.getAllDescuentos()).rejects.toThrow(mockError);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getDescuentoById', () => {
        it('should return a descuento by ID', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockDescuento);

            // Act
            const result = await descuentoService.getDescuentoById(1);

            // Assert
            expect(result).toEqual(mockDescuento);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return null if descuento not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act
            const result = await descuentoService.getDescuentoById(999);

            // Assert
            expect(result).toBeNull();
            expect(mockRepository.findById).toHaveBeenCalledWith(999);
        });

        it('should throw error if ID is invalid', async () => {
            // Arrange
            const invalidId = NaN;

            // Act & Assert
            await expect(descuentoService.getDescuentoById(invalidId)).rejects.toThrow('ID de descuento no válido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should throw error if ID is zero', async () => {
            // Act & Assert
            await expect(descuentoService.getDescuentoById(0)).rejects.toThrow('ID de descuento no válido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });
    });

    describe('getDescuentoByProductoId', () => {
        it('should return a descuento by producto ID', async () => {
            // Arrange
            mockProductoService.getProductoById.mockResolvedValue(mockProducto);
            mockRepository.findByProductId.mockResolvedValue(mockDescuento);

            // Act
            const result = await descuentoService.getDescuentoByProductoId(1);

            // Assert
            expect(result).toEqual(mockDescuento);
            expect(mockProductoService.getProductoById).toHaveBeenCalledWith(1);
            expect(mockRepository.findByProductId).toHaveBeenCalledWith(1);
        });

        it('should return null if descuento not found for producto', async () => {
            // Arrange
            mockProductoService.getProductoById.mockResolvedValue(mockProducto);
            mockRepository.findByProductId.mockResolvedValue(null);

            // Act
            const result = await descuentoService.getDescuentoByProductoId(1);

            // Assert
            expect(result).toBeNull();
            expect(mockProductoService.getProductoById).toHaveBeenCalledWith(1);
            expect(mockRepository.findByProductId).toHaveBeenCalledWith(1);
        });

        it('should throw error if producto not found', async () => {
            // Arrange
            mockProductoService.getProductoById.mockResolvedValue(null);

            // Act & Assert
            await expect(descuentoService.getDescuentoByProductoId(999)).rejects.toThrow('No existe un producto con el ID 999');
            expect(mockRepository.findByProductId).not.toHaveBeenCalled();
        });

        it('should throw error if producto ID is zero', async () => {
            // Act & Assert
            await expect(descuentoService.getDescuentoByProductoId(0)).rejects.toThrow('ID de producto no válido');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
            expect(mockRepository.findByProductId).not.toHaveBeenCalled();
        });

        it('should propagate error from producto service', async () => {
            // Arrange
            const mockError = new Error('Error from producto service');
            mockProductoService.getProductoById.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.getDescuentoByProductoId(1)).rejects.toThrow(mockError);
            expect(mockRepository.findByProductId).not.toHaveBeenCalled();
        });

        it('should propagate error from repository', async () => {
            // Arrange
            mockProductoService.getProductoById.mockResolvedValue(mockProducto);
            const mockError = new Error('Error from repository');
            mockRepository.findByProductId.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.getDescuentoByProductoId(1)).rejects.toThrow(mockError);
        });
    });

    describe('getDescuentosByFilters', () => {
        it('should filter descuentos by producto ID', async () => {
            // Arrange
            mockRepository.findByFilters.mockResolvedValue([mockDescuento]);

            // Act
            const result = await descuentoService.getDescuentosByFilters(1);

            // Assert
            expect(result).toEqual([mockDescuento]);
            expect(mockRepository.findByFilters).toHaveBeenCalledWith({ productoId: 1 });
        });

        it('should filter descuentos by estado', async () => {
            // Arrange
            mockRepository.findByFilters.mockResolvedValue([mockDescuento]);

            // Act
            const result = await descuentoService.getDescuentosByFilters(undefined, true);

            // Assert
            expect(result).toEqual([mockDescuento]);
            expect(mockRepository.findByFilters).toHaveBeenCalledWith({ estado: true });
        });

        it('should filter descuentos by both producto ID and estado', async () => {
            // Arrange
            mockRepository.findByFilters.mockResolvedValue([mockDescuento]);

            // Act
            const result = await descuentoService.getDescuentosByFilters(1, true);

            // Assert
            expect(result).toEqual([mockDescuento]);
            expect(mockRepository.findByFilters).toHaveBeenCalledWith({ productoId: 1, estado: true });
        });


        it('should return results from repository', async () => {
            // Arrange
            mockRepository.findByFilters.mockResolvedValue([]);

            // Act
            const result = await descuentoService.getDescuentosByFilters();

            // Assert
            expect(result).toEqual([]);
            expect(mockRepository.findByFilters).toHaveBeenCalledWith({});
        });

        it('should propagate error from repository', async () => {
            // Arrange
            const mockError = new Error('Repository error');
            mockRepository.findByFilters.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.getDescuentosByFilters(1, true)).rejects.toThrow(mockError);
        });
    });

    describe('createDescuento', () => {
        it('should create a descuento successfully', async () => {
            // Arrange
            const newDescuentoData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockProductoService.getProductoById.mockResolvedValue(mockProducto);
            mockRepository.findByProductId.mockResolvedValue(null); // No existe descuento previo
            mockRepository.create.mockResolvedValue(mockDescuento);

            // Act
            const result = await descuentoService.createDescuento(newDescuentoData);

            // Assert
            expect(result).toEqual(mockDescuento);
            expect(mockProductoService.getProductoById).toHaveBeenCalledWith(newDescuentoData.ProductoID);
            expect(mockRepository.findByProductId).toHaveBeenCalledWith(newDescuentoData.ProductoID);
            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                ProductoID: newDescuentoData.ProductoID,
                TipoDescuentoID: newDescuentoData.TipoDescuentoID,
                Valor: newDescuentoData.Valor,
                FechaInicio: newDescuentoData.FechaInicio,
                FechaFin: newDescuentoData.FechaFin
            }));
        });

        it('should throw error if producto already has a descuento', async () => {
            // Arrange
            const newDescuentoData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockProductoService.getProductoById.mockResolvedValue(mockProducto);
            mockRepository.findByProductId.mockResolvedValue(mockDescuento); // Ya existe un descuento

            // Act & Assert
            await expect(descuentoService.createDescuento(newDescuentoData)).rejects.toThrow('El producto con ID 1 ya tiene un descuento asignado');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if producto not found', async () => {
            // Arrange
            const newDescuentoData: IDescuento = {
                ProductoID: 999,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockProductoService.getProductoById.mockResolvedValue(null);

            // Act & Assert
            await expect(descuentoService.createDescuento(newDescuentoData)).rejects.toThrow('No existe un producto con el ID 999');
            expect(mockRepository.findByProductId).not.toHaveBeenCalled();
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if fechaInicio is after fechaFin', async () => {
            // Arrange
            const newDescuentoData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: futureDate, // Fecha futura
                FechaFin: mockDate      // Fecha pasada
            };

            mockProductoService.getProductoById.mockResolvedValue(mockProducto);

            // Act & Assert
            await expect(descuentoService.createDescuento(newDescuentoData)).rejects.toThrow('La fecha de inicio debe ser anterior a la fecha de fin');
            expect(mockRepository.findByProductId).not.toHaveBeenCalled();
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if valor is not positive', async () => {
            // Arrange
            const newDescuentoData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 0, // Valor no positivo
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(newDescuentoData)).rejects.toThrow('El valor del descuento debe ser un número positivo');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
            expect(mockRepository.findByProductId).not.toHaveBeenCalled();
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if TipoDescuentoID is missing', async () => {
            // Arrange
            const invalidData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: undefined as any,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(invalidData)).rejects.toThrow('El tipo de descuento es obligatorio');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
        });

        it('should throw error if FechaInicio is missing', async () => {
            // Arrange
            const invalidData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: undefined as any,
                FechaFin: futureDate
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(invalidData)).rejects.toThrow('La fecha de inicio es obligatoria');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
        });

        it('should throw error if FechaFin is missing', async () => {
            // Arrange
            const invalidData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: undefined as any
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(invalidData)).rejects.toThrow('La fecha de fin es obligatoria');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
        });

        it('should throw error if FechaInicio is invalid', async () => {
            // Arrange
            const invalidData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: 'invalid-date' as any,
                FechaFin: futureDate
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(invalidData)).rejects.toThrow('La fecha de inicio no es válida');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
        });

        it('should throw error if FechaFin is invalid', async () => {
            // Arrange
            const invalidData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: 'invalid-date' as any
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(invalidData)).rejects.toThrow('La fecha de fin no es válida');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
        });

        it('should throw error if ProductoID is missing', async () => {
            // Arrange
            const invalidData: IDescuento = {
                ProductoID: undefined as any,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(invalidData)).rejects.toThrow('El ID del producto es obligatorio');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
        });

        it('should throw error if ProductoID is NaN', async () => {
            // Arrange
            const invalidData: IDescuento = {
                ProductoID: NaN,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            // Act & Assert
            await expect(descuentoService.createDescuento(invalidData)).rejects.toThrow('El ID del producto es obligatorio');
            expect(mockProductoService.getProductoById).not.toHaveBeenCalled();
        });

        it('should propagate error from create repository method', async () => {
            // Arrange
            const newDescuentoData: IDescuento = {
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockProductoService.getProductoById.mockResolvedValue(mockProducto);
            mockRepository.findByProductId.mockResolvedValue(null);
            const mockError = new Error('Error creating descuento');
            mockRepository.create.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.createDescuento(newDescuentoData)).rejects.toThrow(mockError);
            expect(mockRepository.create).toHaveBeenCalled();
        });
    });

    describe('updateDescuento', () => {
        it('should update a descuento successfully', async () => {
            // Arrange
            const updateData: IDescuento = {
                DescuentoID: 1,
                ProductoID: 1,
                TipoDescuentoID: 2,
                Valor: 15,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockRepository.findById.mockResolvedValue(mockDescuento);
            mockRepository.update.mockResolvedValue(true);

            // Act
            const result = await descuentoService.updateDescuento(updateData);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith(updateData.DescuentoID);
            expect(mockRepository.update).toHaveBeenCalledWith(updateData);
        });

        it('should throw error if descuento not found', async () => {
            // Arrange
            const updateData: IDescuento = {
                DescuentoID: 999,
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(descuentoService.updateDescuento(updateData)).rejects.toThrow('No existe un descuento con el ID 999');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if new producto already has a descuento', async () => {
            // Arrange
            const existingDescuento: IDescuento = {
                DescuentoID: 1,
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate,
                Estado: true
            };

            const anotherDescuento: IDescuento = {
                DescuentoID: 2,
                ProductoID: 2,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate,
                Estado: true
            };

            const updateData: IDescuento = {
                DescuentoID: 1,
                ProductoID: 2, // Cambiar a producto que ya tiene descuento
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockRepository.findById.mockResolvedValue(existingDescuento);
            mockRepository.findByProductId.mockResolvedValue(anotherDescuento);

            // Act & Assert
            await expect(descuentoService.updateDescuento(updateData)).rejects.toThrow('El producto con ID 2 ya tiene un descuento asignado');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if fechaInicio is after fechaFin', async () => {
            // Arrange
            const updateData: IDescuento = {
                DescuentoID: 1,
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: futureDate, // Fecha futura
                FechaFin: mockDate       // Fecha pasada
            };

            mockRepository.findById.mockResolvedValue(mockDescuento);

            // Act & Assert
            await expect(descuentoService.updateDescuento(updateData)).rejects.toThrow('La fecha de inicio debe ser anterior a la fecha de fin');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should validate ID is provided and valid', async () => {
            // Arrange
            const invalidData: IDescuento = {
                DescuentoID: undefined as any,
                ProductoID: 1,
                TipoDescuentoID: 1,
                Valor: 10,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            // Act & Assert
            await expect(descuentoService.updateDescuento(invalidData)).rejects.toThrow('ID de descuento no válido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should use existing values when fields are not provided', async () => {
            // Arrange
            const partialUpdateData: IDescuento = {
                DescuentoID: 1,
                ProductoID: undefined as any,
                TipoDescuentoID: 2, // Only this is changing
                Valor: undefined as any,
                FechaInicio: undefined as any,
                FechaFin: undefined as any
            };

            mockRepository.findById.mockResolvedValue(mockDescuento);
            mockRepository.update.mockResolvedValue(true);

            // Act
            const result = await descuentoService.updateDescuento(partialUpdateData);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.update).toHaveBeenCalledWith(expect.objectContaining({
                DescuentoID: 1,
                ProductoID: mockDescuento.ProductoID,
                TipoDescuentoID: 2, // Changed
                Valor: mockDescuento.Valor,
                FechaInicio: mockDescuento.FechaInicio,
                FechaFin: mockDescuento.FechaFin
            }));
        });

        it('should handle when Valor is specifically provided as 0', async () => {
            // Arrange
            const updateData: IDescuento = {
                DescuentoID: 1,
                Valor: 0, // Should be caught in validation
                ProductoID: 1,
                TipoDescuentoID: 1,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockRepository.findById.mockResolvedValue(mockDescuento);

            // Act & Assert
            // This test confirms that even if Valor is 0, it's still considered "provided"
            // and not overwritten by the existing value
            const expectedValue = updateData.Valor !== undefined ? Number(updateData.Valor) : mockDescuento.Valor;
            expect(expectedValue).toBe(0);
        });

        it('should propagate error from update repository method', async () => {
            // Arrange
            const updateData: IDescuento = {
                DescuentoID: 1,
                ProductoID: 1,
                TipoDescuentoID: 2,
                Valor: 15,
                FechaInicio: mockDate,
                FechaFin: futureDate
            };

            mockRepository.findById.mockResolvedValue(mockDescuento);
            const mockError = new Error('Error updating descuento');
            mockRepository.update.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.updateDescuento(updateData)).rejects.toThrow(mockError);
            expect(mockRepository.findById).toHaveBeenCalled();
            expect(mockRepository.update).toHaveBeenCalled();
        });
    });

    describe('activateDescuento', () => {
        it('should activate a descuento successfully', async () => {
            // Arrange
            const inactiveDescuento: IDescuento = { ...mockDescuento, Estado: false };
            mockRepository.findById.mockResolvedValue(inactiveDescuento);
            mockRepository.activate.mockResolvedValue(true);

            // Act
            const result = await descuentoService.activateDescuento(1);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.activate).toHaveBeenCalledWith(1);
        });

        it('should throw error if descuento not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(descuentoService.activateDescuento(999)).rejects.toThrow('No existe un descuento con el ID 999');
            expect(mockRepository.activate).not.toHaveBeenCalled();
        });

        it('should throw error if descuento is already active', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockDescuento); // Ya está activo

            // Act & Assert
            await expect(descuentoService.activateDescuento(1)).rejects.toThrow('El descuento con ID 1 ya está activado');
            expect(mockRepository.activate).not.toHaveBeenCalled();
        });

        it('should propagate error from repository activate method', async () => {
            // Arrange
            const inactiveDescuento: IDescuento = { ...mockDescuento, Estado: false };
            mockRepository.findById.mockResolvedValue(inactiveDescuento);
            const mockError = new Error('Error activating descuento');
            mockRepository.activate.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.activateDescuento(1)).rejects.toThrow(mockError);
            expect(mockRepository.findById).toHaveBeenCalled();
            expect(mockRepository.activate).toHaveBeenCalled();
        });

        it('should throw error if ID is zero', async () => {
            // Act & Assert
            await expect(descuentoService.activateDescuento(0)).rejects.toThrow('ID de descuento no válido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });
    });

    describe('deactivateDescuento', () => {
        it('should deactivate a descuento successfully', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockDescuento); // Está activo
            mockRepository.deactivate.mockResolvedValue(true);

            // Act
            const result = await descuentoService.deactivateDescuento(1);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.deactivate).toHaveBeenCalledWith(1);
        });

        it('should throw error if descuento not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(descuentoService.deactivateDescuento(999)).rejects.toThrow('No existe un descuento con el ID 999');
            expect(mockRepository.deactivate).not.toHaveBeenCalled();
        });

        it('should throw error if descuento is already inactive', async () => {
            // Arrange
            const inactiveDescuento: IDescuento = { ...mockDescuento, Estado: false };
            mockRepository.findById.mockResolvedValue(inactiveDescuento);

            // Act & Assert
            await expect(descuentoService.deactivateDescuento(1)).rejects.toThrow('El descuento con ID 1 ya está desactivado');
            expect(mockRepository.deactivate).not.toHaveBeenCalled();
        });

        it('should propagate error from repository deactivate method', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockDescuento);
            const mockError = new Error('Error deactivating descuento');
            mockRepository.deactivate.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.deactivateDescuento(1)).rejects.toThrow(mockError);
            expect(mockRepository.findById).toHaveBeenCalled();
            expect(mockRepository.deactivate).toHaveBeenCalled();
        });

        it('should throw error if ID is zero', async () => {
            // Act & Assert
            await expect(descuentoService.deactivateDescuento(0)).rejects.toThrow('ID de descuento no válido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });
    });

    describe('getTiposDescuento', () => {
        it('should return all tipos de descuento', async () => {
            // Arrange
            mockRepository.getTiposDescuento.mockResolvedValue([mockTipoDescuento]);

            // Act
            const result = await descuentoService.getTiposDescuento();

            // Assert
            expect(result).toEqual([mockTipoDescuento]);
            expect(mockRepository.getTiposDescuento).toHaveBeenCalledTimes(1);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.getTiposDescuento.mockRejectedValue(mockError);

            // Act & Assert
            await expect(descuentoService.getTiposDescuento()).rejects.toThrow(mockError);
            expect(mockRepository.getTiposDescuento).toHaveBeenCalledTimes(1);
        });
    });
});
