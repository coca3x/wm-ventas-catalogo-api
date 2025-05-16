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

    describe('getAllProductos', () => {
        it('should return all products from repository', async () => {
            // Arrange
            mockRepository.findAll.mockResolvedValue([mockProducto]);

            // Act
            const result = await productoService.getAllProductos();

            // Assert
            expect(result).toEqual([mockProducto]);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.findAll.mockRejectedValue(mockError);

            // Act & Assert
            await expect(productoService.getAllProductos()).rejects.toThrow(mockError);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProductoById', () => {
        it('should return a product by ID', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockProducto);
            const productId = 1;

            // Act
            const result = await productoService.getProductoById(productId);

            // Assert
            expect(result).toEqual(mockProducto);
            expect(mockRepository.findById).toHaveBeenCalledWith(productId);
        });

        it('should return null if product not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);
            const productId = 999;

            // Act
            const result = await productoService.getProductoById(productId);

            // Assert
            expect(result).toBeNull();
            expect(mockRepository.findById).toHaveBeenCalledWith(productId);
        });

        it('should throw error if ID is invalid', async () => {
            // Arrange
            const invalidId = NaN;

            // Act & Assert
            await expect(productoService.getProductoById(invalidId)).rejects.toThrow('ID de producto no válido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.findById.mockRejectedValue(mockError);

            // Act & Assert
            await expect(productoService.getProductoById(1)).rejects.toThrow(mockError);
            expect(mockRepository.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProductoByCode', () => {
        it('should return a product by code', async () => {
            // Arrange
            mockRepository.findByCode.mockResolvedValue(mockProducto);
            const productCode = 'PROD-001';

            // Act
            const result = await productoService.getProductoByCode(productCode);

            // Assert
            expect(result).toEqual(mockProducto);
            expect(mockRepository.findByCode).toHaveBeenCalledWith(productCode);
        });

        it('should return null if product not found', async () => {
            // Arrange
            mockRepository.findByCode.mockResolvedValue(null);
            const productCode = 'NON-EXISTENT';

            // Act
            const result = await productoService.getProductoByCode(productCode);

            // Assert
            expect(result).toBeNull();
            expect(mockRepository.findByCode).toHaveBeenCalledWith(productCode);
        });

        it('should throw error if code is invalid', async () => {
            // Arrange
            const invalidCode = '';

            // Act & Assert
            await expect(productoService.getProductoByCode(invalidCode)).rejects.toThrow('Código de producto no válido');
            expect(mockRepository.findByCode).not.toHaveBeenCalled();
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.findByCode.mockRejectedValue(mockError);

            // Act & Assert
            await expect(productoService.getProductoByCode('PROD-001')).rejects.toThrow(mockError);
            expect(mockRepository.findByCode).toHaveBeenCalledTimes(1);
        });
    });

    describe('createProducto', () => {
        it('should create a new product successfully', async () => {
            // Arrange
            const newProductData = {
                CodigoProducto: 'PROD-002',
                Nombre: 'Nuevo Producto',
                Descripcion: 'Descripción de nuevo producto',
                PrecioUnitario: 200,
                UnidadID: 1,
                Stock: 25
            };

            const createdProducto = {
                ...newProductData,
                ProductoID: 2,
                Estado: true,
                FechaCreacion: mockDate
            };

            mockRepository.findByCode.mockResolvedValue(null); // Product doesn't exist
            mockRepository.create.mockResolvedValue(createdProducto);

            // Act
            const result = await productoService.createProducto(newProductData);

            // Assert
            expect(result).toEqual(createdProducto);
            expect(mockRepository.findByCode).toHaveBeenCalledWith(newProductData.CodigoProducto);
            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                CodigoProducto: newProductData.CodigoProducto,
                Nombre: newProductData.Nombre,
                Descripcion: newProductData.Descripcion,
                PrecioUnitario: newProductData.PrecioUnitario,
                UnidadID: newProductData.UnidadID,
                Stock: newProductData.Stock
            }));
        });

        it('should throw error if code already exists', async () => {
            // Arrange
            const existingProductData = {
                CodigoProducto: 'PROD-001',
                Nombre: 'Nuevo Producto',
                PrecioUnitario: 200,
                UnidadID: 1,
                Stock: 25
            };

            mockRepository.findByCode.mockResolvedValue(mockProducto); // Product already exists

            // Act & Assert
            await expect(productoService.createProducto(existingProductData)).rejects.toThrow(
                'Ya existe un producto con el código PROD-001'
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if code is missing', async () => {
            // Arrange
            const invalidProductData = {
                Nombre: 'Nuevo Producto',
                PrecioUnitario: 200,
                UnidadID: 1
            } as IProducto;

            // Act & Assert
            await expect(productoService.createProducto(invalidProductData)).rejects.toThrow(
                'El código del producto es obligatorio'
            );
            expect(mockRepository.findByCode).not.toHaveBeenCalled();
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if name is missing', async () => {
            // Arrange
            const invalidProductData = {
                CodigoProducto: 'PROD-002',
                PrecioUnitario: 200,
                UnidadID: 1
            } as IProducto;

            // Act & Assert
            await expect(productoService.createProducto(invalidProductData)).rejects.toThrow(
                'El nombre del producto es obligatorio'
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if price is invalid', async () => {
            // Arrange
            const invalidProductData = {
                CodigoProducto: 'PROD-002',
                Nombre: 'Nuevo Producto',
                PrecioUnitario: -50,
                UnidadID: 1,
                Stock: 0
            };

            // Act & Assert
            await expect(productoService.createProducto(invalidProductData)).rejects.toThrow(
                'El precio unitario debe ser un número positivo'
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if unidad is missing', async () => {
            // Arrange
            const invalidProductData = {
                CodigoProducto: 'PROD-002',
                Nombre: 'Nuevo Producto',
                PrecioUnitario: 200
            } as IProducto;

            // Act & Assert
            await expect(productoService.createProducto(invalidProductData)).rejects.toThrow(
                'La unidad de medida es obligatoria'
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if stock is negative', async () => {
            // Arrange
            const invalidProductData = {
                CodigoProducto: 'PROD-002',
                Nombre: 'Nuevo Producto',
                PrecioUnitario: 200,
                UnidadID: 1,
                Stock: -10
            };

            // Act & Assert
            await expect(productoService.createProducto(invalidProductData)).rejects.toThrow(
                'El stock debe ser un número positivo o cero'
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        //     // Arrange
        //     const productDataWithoutStock = {
        //         CodigoProducto: 'PROD-002',
        //         Nombre: 'Nuevo Producto',
        //         PrecioUnitario: 200,
        //         UnidadID: 1
        //     } as IProducto;

        //     const createdProducto = {
        //         ...productDataWithoutStock,
        //         Stock: 0,
        //         ProductoID: 2,
        //         Estado: true,
        //         FechaCreacion: mockDate
        //     };

        //     mockRepository.findByCode.mockResolvedValue(null);
        //     mockRepository.create.mockResolvedValue(createdProducto);

        //     // Act
        //     const result = await productoService.createProducto(productDataWithoutStock);

        //     // Assert
        //     expect(result).toEqual(createdProducto);
        //     expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        //         Stock: 0
        //     }));
        // });
    });

    describe('updateProducto', () => {
        it('should throw error if product ID is invalid', async () => {
            // Arrange
            const invalidUpdateData = {
                Nombre: 'Producto Actualizado'
            } as IProducto;

            // Act & Assert
            await expect(productoService.updateProducto(invalidUpdateData)).rejects.toThrow(
                'ID de producto no válido'
            );
            expect(mockRepository.findById).not.toHaveBeenCalled();
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if product does not exist', async () => {
            // Arrange
            const updateData = {
                ProductoID: 999,
                Nombre: 'Producto Actualizado',
                CodigoProducto: 'PROD-002',
                PrecioUnitario: 0,
                UnidadID: 0,
                Stock: 0
            };

            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(productoService.updateProducto(updateData)).rejects.toThrow(
                'No existe un producto con el ID 999'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if trying to update to an existing code', async () => {
            // Arrange
            const updateData = {
                ProductoID: 1,
                Nombre: 'Producto Actualizado',
                CodigoProducto: 'EXIST-CODE',
                PrecioUnitario: 0,
                UnidadID: 0,
                Stock: 0
            };

            mockRepository.findById.mockResolvedValue(mockProducto);
            mockRepository.findByCode.mockResolvedValue({
                ...mockProducto,
                ProductoID: 2,
                CodigoProducto: 'EXIST-CODE',
                PrecioUnitario: 0,
                UnidadID: 0,
                Stock: 0
            });

            // Act & Assert
            await expect(productoService.updateProducto(updateData)).rejects.toThrow(
                'Ya existe otro producto con el código EXIST-CODE'
            );
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should allow updating to same code', async () => {
            // Arrange
            const updateData = {
                ProductoID: 1,
                CodigoProducto: 'PROD-001',
                Nombre: 'Producto Actualizado',
                PrecioUnitario: 0,
                UnidadID: 0,
                Stock: 0
            };

            mockRepository.findById.mockResolvedValue(mockProducto);
            mockRepository.findByCode.mockResolvedValue(mockProducto); // Same product
            mockRepository.update.mockResolvedValue(true);

            // Act
            const result = await productoService.updateProducto(updateData);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.update).toHaveBeenCalled();
        });


    });

    describe('deleteProducto', () => {
        it('should delete an existing product', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockProducto);
            mockRepository.delete.mockResolvedValue(true);

            // Act
            const result = await productoService.deleteProducto(1);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw error if product ID is invalid', async () => {
            // Arrange
            const invalidId = NaN;

            // Act & Assert
            await expect(productoService.deleteProducto(invalidId)).rejects.toThrow(
                'ID de producto no válido'
            );
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error if product does not exist', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(productoService.deleteProducto(999)).rejects.toThrow(
                'No existe un producto con el ID 999'
            );
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockProducto);
            const mockError = new Error('Database error');
            mockRepository.delete.mockRejectedValue(mockError);

            // Act & Assert
            await expect(productoService.deleteProducto(1)).rejects.toThrow(mockError);
            expect(mockRepository.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateProductoStock', () => {
        it('should update product stock successfully', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockProducto);
            mockRepository.updateStock.mockResolvedValue(true);

            // Act
            const result = await productoService.updateProductoStock(1, 10);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.updateStock).toHaveBeenCalledWith(1, 10);
        });

        it('should return true without calling updateStock if cantidad is 0', async () => {
            // Act
            const result = await productoService.updateProductoStock(1, 0);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).not.toHaveBeenCalled();
            expect(mockRepository.updateStock).not.toHaveBeenCalled();
        });

        it('should throw error if product ID is invalid', async () => {
            // Arrange
            const invalidId = NaN;

            // Act & Assert
            await expect(productoService.updateProductoStock(invalidId, 10)).rejects.toThrow(
                'ID de producto no válido'
            );
            expect(mockRepository.updateStock).not.toHaveBeenCalled();
        });

        it('should throw error if product does not exist', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(productoService.updateProductoStock(999, 10)).rejects.toThrow(
                'No existe un producto con el ID 999'
            );
            expect(mockRepository.updateStock).not.toHaveBeenCalled();
        });

        it('should throw error if trying to reduce more than available stock', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockProducto); // Stock: 50

            // Act & Assert
            await expect(productoService.updateProductoStock(1, -60)).rejects.toThrow(
                'Stock insuficiente para el producto Test Producto'
            );
            expect(mockRepository.updateStock).not.toHaveBeenCalled();
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockProducto);
            const mockError = new Error('Database error');
            mockRepository.updateStock.mockRejectedValue(mockError);

            // Act & Assert
            await expect(productoService.updateProductoStock(1, 10)).rejects.toThrow(mockError);
            expect(mockRepository.updateStock).toHaveBeenCalledTimes(1);
        });
    });
});
