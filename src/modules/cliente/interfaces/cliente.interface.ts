export interface ICliente {
    NIT: string;
    NombreCompleto: string;
    Telefono: string;
    CorreoElectronico?: string;
    Estado?: boolean;
    FechaCreacion?: Date;
}

export interface IClienteRepository {
    findAll(): Promise<ICliente[]>;
    findByNIT(nit: string): Promise<ICliente | null>;
    create(cliente: ICliente): Promise<ICliente>;
    update(cliente: ICliente): Promise<boolean>;
    delete(nit: string): Promise<boolean>;
}
