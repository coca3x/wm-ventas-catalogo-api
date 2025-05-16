export interface IProducto {
    ProductoID?: number;
    CodigoProducto: string;
    Nombre: string;
    Descripcion?: string;
    PrecioUnitario: number;
    UnidadID: number;
    Stock: number;
    Estado?: boolean;
    FechaCreacion?: Date;
}

export interface IProductoRepository {
    findAll(): Promise<IProducto[]>;
    findById(id: number): Promise<IProducto | null>;
    findByCode(codigo: string): Promise<IProducto | null>;
    findByFilters(filters: { codigo?: string, nombre?: string }): Promise<IProducto[]>;
    create(producto: IProducto): Promise<IProducto>;
    update(producto: IProducto): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    updateStock(id: number, cantidad: number): Promise<boolean>;
}
