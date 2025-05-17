import { VentaService } from '../../../../../modules/venta/services/venta.service';
import { VentaRepository } from '../../../../../modules/venta/repositories/venta.repository';
import { ClienteService } from '../../../../../modules/cliente/services/cliente.service';
import { ProductoService } from '../../../../../modules/producto/services/producto.service';
import { DescuentoService } from '../../../../../modules/descuento/services/descuento.service';
import { IVenta, IDetalleVenta, IMetodoPago } from '../../../../../modules/venta/interfaces/venta.interface';
import { IProducto } from '../../../../../modules/producto/interfaces/producto.interface';
import { ICliente } from '../../../../../modules/cliente/interfaces/cliente.interface';
import { IDescuento } from '../../../../../modules/descuento/interfaces/descuento.interface';

// Mock de los repositorios y servicios dependientes
jest.mock('../../../../../modules/venta/repositories/venta.repository');
jest.mock('../../../../../modules/cliente/services/cliente.service');
jest.mock('../../../../../modules/producto/services/producto.service');
jest.mock('../../../../../modules/descuento/services/descuento.service');

describe('VentaService', () => {
    let ventaService: VentaService;
    let mockRepository: jest.Mocked<VentaRepository>;
    let mockClienteService: jest.Mocked<ClienteService>;
    let mockProductoService: jest.Mocked<ProductoService>;
    let mockDescuentoService: jest.Mocked<DescuentoService>;
    const mockDate = new Date('2023-11-01');

    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository = new VentaRepository() as jest.Mocked<VentaRepository>;
        mockClienteService = new ClienteService() as jest.Mocked<ClienteService>;
        mockProductoService = new ProductoService() as jest.Mocked<ProductoService>;
        mockDescuentoService = new DescuentoService() as jest.Mocked<DescuentoService>;
        ventaService = new VentaService();

        // Inyectar los mocks
        (ventaService as any).repository = mockRepository;
        (ventaService as any).clienteService = mockClienteService;
        (ventaService as any).productoService = mockProductoService;
        (ventaService as any).descuentoService = mockDescuentoService;
    });

    const mockCliente: ICliente = {
        NIT: '12345678',
        NombreCompleto: 'Cliente Test',
        Telefono: '12345678',
        CorreoElectronico: 'test@example.com',
        Estado: true,
        FechaCreacion: mockDate
    };

    const mockProducto: IProducto = {
        ProductoID: 1,
        CodigoProducto: 'PROD-001',
        Nombre: 'Producto Test',
        Descripcion: 'Descripción de prueba',
        PrecioUnitario: 100,
        UnidadID: 1,
        Stock: 50,
        Estado: true,
        FechaCreacion: mockDate
    };

    const mockDescuento: IDescuento = {
        DescuentoID: 1,
        ProductoID: 1,
        TipoDescuentoID: 1, // Porcentaje
        Valor: 10, // 10%
        FechaInicio: new Date('2023-01-01'),
        FechaFin: new Date('2023-12-31'),
        Estado: true
    };

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

    describe('getAllVentas', () => {
        it('should return all ventas', async () => {
            // Arrange
            mockRepository.findAll.mockResolvedValue([mockVenta]);

            // Act
            const result = await ventaService.getAllVentas();

            // Assert
            expect(result).toEqual([mockVenta]);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.findAll.mockRejectedValue(mockError);

            // Act & Assert
            await expect(ventaService.getAllVentas()).rejects.toThrow(mockError);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getVentaById', () => {
        it('should return a venta by ID', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockVenta);

            // Act
            const result = await ventaService.getVentaById(1);

            // Assert
            expect(result).toEqual(mockVenta);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return null if venta not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act
            const result = await ventaService.getVentaById(999);

            // Assert
            expect(result).toBeNull();
            expect(mockRepository.findById).toHaveBeenCalledWith(999);
        });

        it('should throw error if ID is invalid', async () => {
            // Arrange
            const invalidId = NaN;

            // Act & Assert
            await expect(ventaService.getVentaById(invalidId)).rejects.toThrow('ID de venta no válido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });
    });

    describe('getVentaByCode', () => {
        it('should return a venta by code', async () => {
            // Arrange
            mockRepository.findByCode.mockResolvedValue(mockVenta);

            // Act
            const result = await ventaService.getVentaByCode('V20231101-001');

            // Assert
            expect(result).toEqual(mockVenta);
            expect(mockRepository.findByCode).toHaveBeenCalledWith('V20231101-001');
        });

        it('should return null if venta not found', async () => {
            // Arrange
            mockRepository.findByCode.mockResolvedValue(null);

            // Act
            const result = await ventaService.getVentaByCode('INVALID-CODE');

            // Assert
            expect(result).toBeNull();
            expect(mockRepository.findByCode).toHaveBeenCalledWith('INVALID-CODE');
        });

        it('should throw error if code is empty', async () => {
            // Act & Assert
            await expect(ventaService.getVentaByCode('')).rejects.toThrow('Código de venta no válido');
            expect(mockRepository.findByCode).not.toHaveBeenCalled();
        });
    });

    describe('getVentasByCliente', () => {
        it('should return ventas by cliente NIT', async () => {
            // Arrange
            mockClienteService.getClienteByNIT.mockResolvedValue(mockCliente);
            mockRepository.findByClienteNIT.mockResolvedValue([mockVenta]);

            // Act
            const result = await ventaService.getVentasByCliente('12345678');

            // Assert
            expect(result).toEqual([mockVenta]);
            expect(mockClienteService.getClienteByNIT).toHaveBeenCalledWith('12345678');
            expect(mockRepository.findByClienteNIT).toHaveBeenCalledWith('12345678');
        });

        it('should throw error if NIT is empty', async () => {
            // Act & Assert
            await expect(ventaService.getVentasByCliente('')).rejects.toThrow('NIT de cliente no válido');
            expect(mockClienteService.getClienteByNIT).not.toHaveBeenCalled();
            expect(mockRepository.findByClienteNIT).not.toHaveBeenCalled();
        });

        it('should throw error if cliente not found', async () => {
            // Arrange
            mockClienteService.getClienteByNIT.mockResolvedValue(null);

            // Act & Assert
            await expect(ventaService.getVentasByCliente('nonexistent')).rejects.toThrow('No existe un cliente con el NIT nonexistent');
            expect(mockRepository.findByClienteNIT).not.toHaveBeenCalled();
        });
    });

    describe('getVentasByDateRange', () => {
        it('should return ventas by date range', async () => {
            // Arrange
            const fechaInicio = new Date('2023-01-01');
            const fechaFin = new Date('2023-12-31');
            mockRepository.findBetweenDates.mockResolvedValue([mockVenta]);

            // Act
            const result = await ventaService.getVentasByDateRange(fechaInicio, fechaFin);

            // Assert
            expect(result).toEqual([mockVenta]);
            expect(mockRepository.findBetweenDates).toHaveBeenCalledWith(fechaInicio, fechaFin);
        });

        it('should throw error if fechaInicio is invalid', async () => {
            // Arrange
            const fechaInicio = new Date('invalid-date');
            const fechaFin = new Date('2023-12-31');

            // Act & Assert
            await expect(ventaService.getVentasByDateRange(fechaInicio, fechaFin)).rejects.toThrow('Fechas no válidas');
            expect(mockRepository.findBetweenDates).not.toHaveBeenCalled();
        });

        it('should throw error if fechaFin is invalid', async () => {
            // Arrange
            const fechaInicio = new Date('2023-01-01');
            const fechaFin = new Date('invalid-date');

            // Act & Assert
            await expect(ventaService.getVentasByDateRange(fechaInicio, fechaFin)).rejects.toThrow('Fechas no válidas');
            expect(mockRepository.findBetweenDates).not.toHaveBeenCalled();
        });

        it('should throw error if fechaInicio is after fechaFin', async () => {
            // Arrange
            const fechaInicio = new Date('2023-12-31');
            const fechaFin = new Date('2023-01-01');

            // Act & Assert
            await expect(ventaService.getVentasByDateRange(fechaInicio, fechaFin)).rejects.toThrow('La fecha de inicio debe ser anterior a la fecha de fin');
            expect(mockRepository.findBetweenDates).not.toHaveBeenCalled();
        });
    });

    describe('createVenta', () => {
        it('should create a venta successfully', async () => {
            // Arrange
            const ventaData: IVenta = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 2
                    }
                ]
            };

            mockClienteService.getClienteByNIT.mockResolvedValue(mockCliente);
            mockProductoService.getProductoById.mockResolvedValue(mockProducto);
            mockDescuentoService.getDescuentoByProductoId.mockResolvedValue(mockDescuento);
            mockRepository.create.mockResolvedValue(mockVenta);

            // Act
            const result = await ventaService.createVenta(ventaData);

            // Assert
            expect(result).toEqual(mockVenta);
            expect(mockClienteService.getClienteByNIT).toHaveBeenCalledWith('12345678');
            expect(mockProductoService.getProductoById).toHaveBeenCalledWith(1);
            expect(mockDescuentoService.getDescuentoByProductoId).toHaveBeenCalledWith(1);
            expect(mockRepository.create).toHaveBeenCalled();
        });

        it('should throw error if NIT is missing', async () => {
            // Arrange
            const ventaData: IVenta = {
                NIT: '',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 2
                    }
                ]
            };

            // Act & Assert
            await expect(ventaService.createVenta(ventaData)).rejects.toThrow('El NIT del cliente es obligatorio');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if MetodoPagoID is missing', async () => {
            // Arrange
            const ventaData: IVenta = {
                NIT: '12345678',
                MetodoPagoID: undefined as any,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 2
                    }
                ]
            };

            // Act & Assert
            await expect(ventaService.createVenta(ventaData)).rejects.toThrow('El método de pago es obligatorio');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if Detalle is empty', async () => {
            // Arrange
            const ventaData: IVenta = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: []
            };

            // Act & Assert
            await expect(ventaService.createVenta(ventaData)).rejects.toThrow('La venta debe tener al menos un producto');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if cliente not found', async () => {
            // Arrange
            const ventaData: IVenta = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 2
                    }
                ]
            };

            mockClienteService.getClienteByNIT.mockResolvedValue(null);

            // Act & Assert
            await expect(ventaService.createVenta(ventaData)).rejects.toThrow('No existe un cliente con el NIT 12345678');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if producto not found', async () => {
            // Arrange
            const ventaData: IVenta = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 999,
                        Cantidad: 2
                    }
                ]
            };

            mockClienteService.getClienteByNIT.mockResolvedValue(mockCliente);
            mockProductoService.getProductoById.mockResolvedValue(null);

            // Act & Assert
            await expect(ventaService.createVenta(ventaData)).rejects.toThrow('No existe un producto con el ID 999');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if stock is insufficient', async () => {
            // Arrange
            const ventaData: IVenta = {
                NIT: '12345678',
                MetodoPagoID: 1,
                Detalle: [
                    {
                        ProductoID: 1,
                        Cantidad: 100 // Más que el stock disponible
                    }
                ]
            };

            mockClienteService.getClienteByNIT.mockResolvedValue(mockCliente);
            mockProductoService.getProductoById.mockResolvedValue(mockProducto); // Stock: 50

            // Act & Assert
            await expect(ventaService.createVenta(ventaData)).rejects.toThrow(`Stock insuficiente para el producto ${mockProducto.Nombre}`);
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

    });

    describe('updateVenta', () => {
        it('should update a venta successfully', async () => {
            // Arrange
            const ventaData: IVenta = {
                VentaID: 1,
                NIT: '87654321',
                MetodoPagoID: 2
            };

            mockRepository.findById.mockResolvedValue(mockVenta);
            mockClienteService.getClienteByNIT.mockResolvedValue(mockCliente);
            mockRepository.update.mockResolvedValue(true);

            // Act
            const result = await ventaService.updateVenta(ventaData);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockClienteService.getClienteByNIT).toHaveBeenCalledWith('87654321');
            expect(mockRepository.update).toHaveBeenCalledWith(ventaData);
        });

        it('should throw error if VentaID is invalid', async () => {
            // Arrange
            const ventaData: IVenta = {
                VentaID: undefined as any,
                NIT: '12345678',
                MetodoPagoID: 1
            };

            // Act & Assert
            await expect(ventaService.updateVenta(ventaData)).rejects.toThrow('ID de venta no válido');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if venta not found', async () => {
            // Arrange
            const ventaData: IVenta = {
                VentaID: 999,
                NIT: '12345678',
                MetodoPagoID: 1
            };

            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(ventaService.updateVenta(ventaData)).rejects.toThrow('No existe una venta con el ID 999');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if NIT is missing', async () => {
            // Arrange
            const ventaData: IVenta = {
                VentaID: 1,
                NIT: '',
                MetodoPagoID: 1
            };

            mockRepository.findById.mockResolvedValue(mockVenta);

            // Act & Assert
            await expect(ventaService.updateVenta(ventaData)).rejects.toThrow('El NIT del cliente es obligatorio');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if cliente not found', async () => {
            // Arrange
            const ventaData: IVenta = {
                VentaID: 1,
                NIT: '87654321',
                MetodoPagoID: 1
            };

            mockRepository.findById.mockResolvedValue(mockVenta);
            mockClienteService.getClienteByNIT.mockResolvedValue(null);

            // Act & Assert
            await expect(ventaService.updateVenta(ventaData)).rejects.toThrow('No existe un cliente con el NIT 87654321');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteVenta', () => {
        it('should delete a venta successfully', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(mockVenta);
            mockRepository.delete.mockResolvedValue(true);

            // Act
            const result = await ventaService.deleteVenta(1);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw error if VentaID is invalid', async () => {
            // Act & Assert
            await expect(ventaService.deleteVenta(NaN)).rejects.toThrow('ID de venta no válido');
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error if venta not found', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(ventaService.deleteVenta(999)).rejects.toThrow('No existe una venta con el ID 999');
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });
    });

    describe('getMetodosPago', () => {
        it('should return all métodos de pago', async () => {
            // Arrange
            mockRepository.getMetodosPago.mockResolvedValue([mockMetodoPago]);

            // Act
            const result = await ventaService.getMetodosPago();

            // Assert
            expect(result).toEqual([mockMetodoPago]);
            expect(mockRepository.getMetodosPago).toHaveBeenCalledTimes(1);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.getMetodosPago.mockRejectedValue(mockError);

            // Act & Assert
            await expect(ventaService.getMetodosPago()).rejects.toThrow(mockError);
            expect(mockRepository.getMetodosPago).toHaveBeenCalledTimes(1);
        });
    });
});
