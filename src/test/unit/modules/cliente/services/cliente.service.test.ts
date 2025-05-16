import { ClienteService } from '../../../../../modules/cliente/services/cliente.service';
import { ClienteRepository } from '../../../../../modules/cliente/repositories/cliente.repository';
import { ICliente } from '../../../../../modules/cliente/interfaces/cliente.interface';

// Mock the repository
jest.mock('../../../../../modules/cliente/repositories/cliente.repository');

describe('ClienteService', () => {
    let clienteService: ClienteService;
    let mockRepository: jest.Mocked<ClienteRepository>;
    const mockDate = new Date('2023-11-01');

    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository = new ClienteRepository() as jest.Mocked<ClienteRepository>;
        clienteService = new ClienteService();

        (clienteService as any).repository = mockRepository;
    });

    const mockCliente: ICliente = {
        NIT: '12345678',
        NombreCompleto: 'Test Cliente',
        Telefono: '12345678',
        CorreoElectronico: 'test@example.com',
        Estado: true,
        FechaCreacion: mockDate
    };

    describe('getAllClientes', () => {
        it('should return all clientes', async () => {
            // Arrange
            mockRepository.findAll.mockResolvedValue([mockCliente]);

            // Act
            const result = await clienteService.getAllClientes();

            // Assert
            expect(result).toEqual([mockCliente]);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });

        it('should propagate any error from repository', async () => {
            // Arrange
            const mockError = new Error('Database error');
            mockRepository.findAll.mockRejectedValue(mockError);

            // Act & Assert
            await expect(clienteService.getAllClientes()).rejects.toThrow(mockError);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getClienteByNIT', () => {
        it('should return a cliente by NIT', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(mockCliente);

            // Act
            const result = await clienteService.getClienteByNIT('12345678');

            // Assert
            expect(result).toEqual(mockCliente);
            expect(mockRepository.findByNIT).toHaveBeenCalledWith('12345678');
        });

        it('should throw error if NIT is empty', async () => {
            // Act & Assert
            await expect(clienteService.getClienteByNIT('')).rejects.toThrow('NIT no válido');
            expect(mockRepository.findByNIT).not.toHaveBeenCalled();
        });

        it('should return null if cliente not found', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(null);

            // Act
            const result = await clienteService.getClienteByNIT('nonexistent');

            // Assert
            expect(result).toBeNull();
            expect(mockRepository.findByNIT).toHaveBeenCalledWith('nonexistent');
        });
    });

    describe('createCliente', () => {
        it('should create a cliente successfully', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(null);
            mockRepository.create.mockResolvedValue(mockCliente);

            // Act
            const result = await clienteService.createCliente(mockCliente);

            // Assert
            expect(result).toEqual(mockCliente);
            expect(mockRepository.findByNIT).toHaveBeenCalledWith(mockCliente.NIT);
            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                NIT: mockCliente.NIT,
                NombreCompleto: mockCliente.NombreCompleto,
                Telefono: mockCliente.Telefono,
                CorreoElectronico: mockCliente.CorreoElectronico
            }));
        });

        it('should throw error if NIT is missing', async () => {
            // Arrange
            const invalidCliente = { ...mockCliente, NIT: '' };

            // Act & Assert
            await expect(clienteService.createCliente(invalidCliente)).rejects.toThrow('El NIT es obligatorio');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if NombreCompleto is missing', async () => {
            // Arrange
            const invalidCliente = { ...mockCliente, NombreCompleto: '' };

            // Act & Assert
            await expect(clienteService.createCliente(invalidCliente)).rejects.toThrow('El nombre completo es obligatorio');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if Telefono is missing', async () => {
            // Arrange
            const invalidCliente = { ...mockCliente, Telefono: '' };

            // Act & Assert
            await expect(clienteService.createCliente(invalidCliente)).rejects.toThrow('El teléfono es obligatorio');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if cliente with NIT already exists', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(mockCliente);

            // Act & Assert
            await expect(clienteService.createCliente(mockCliente)).rejects.toThrow(`Ya existe un cliente con el NIT ${mockCliente.NIT}`);
            expect(mockRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('updateCliente', () => {
        it('should update a cliente successfully', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(mockCliente);
            mockRepository.update.mockResolvedValue(true);

            const updateData: ICliente = {
                NIT: '12345678',
                NombreCompleto: 'Updated Name',
                Telefono: '87654321',
                CorreoElectronico: 'updated@example.com'
            };

            // Act
            const result = await clienteService.updateCliente(updateData);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findByNIT).toHaveBeenCalledWith(updateData.NIT);
            expect(mockRepository.update).toHaveBeenCalledWith(updateData);
        });

        it('should throw error if NIT is missing', async () => {
            // Arrange
            const invalidCliente = { NombreCompleto: 'Test', Telefono: '12345678', CorreoElectronico: 'test@example.com' } as ICliente;

            // Act & Assert
            await expect(clienteService.updateCliente(invalidCliente)).rejects.toThrow('El NIT es obligatorio');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if cliente does not exist', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(null);

            // Act & Assert
            await expect(clienteService.updateCliente(mockCliente)).rejects.toThrow(`No existe un cliente con el NIT ${mockCliente.NIT}`);
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should use existing values when update data is partial', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(mockCliente);
            mockRepository.update.mockResolvedValue(true);

            const partialUpdate: ICliente = {
                NIT: '12345678',
                NombreCompleto: 'Updated Name',
                Telefono: ''
            };

            // Act
            const result = await clienteService.updateCliente(partialUpdate);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.update).toHaveBeenCalledWith(expect.objectContaining({
                NIT: partialUpdate.NIT,
                NombreCompleto: partialUpdate.NombreCompleto,
                Telefono: mockCliente.Telefono,  // Should use existing value
                CorreoElectronico: mockCliente.CorreoElectronico  // Should use existing value
            }));
        });
    });

    describe('deleteCliente', () => {
        it('should delete a cliente successfully', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(mockCliente);
            mockRepository.delete.mockResolvedValue(true);

            // Act
            const result = await clienteService.deleteCliente('12345678');

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.findByNIT).toHaveBeenCalledWith('12345678');
            expect(mockRepository.delete).toHaveBeenCalledWith('12345678');
        });

        it('should throw error if NIT is empty', async () => {
            // Act & Assert
            await expect(clienteService.deleteCliente('')).rejects.toThrow('NIT no válido');
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error if cliente does not exist', async () => {
            // Arrange
            mockRepository.findByNIT.mockResolvedValue(null);

            // Act & Assert
            await expect(clienteService.deleteCliente('nonexistent')).rejects.toThrow('No existe un cliente con el NIT nonexistent');
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });
    });
});
