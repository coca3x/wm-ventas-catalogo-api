export interface IVenta {
    VentaID?: number;
    CodigoVenta?: string;
    NIT: string;
    FechaVenta?: Date;
    MetodoPagoID: number;
    Total?: number;
    Subtotal?: number;
    TotalDescuento?: number;
    Estado?: boolean;
    Detalle?: IDetalleVenta[];
}

export interface IDetalleVenta {
    DetalleID?: number;
    VentaID?: number;
    ProductoID: number;
    Cantidad: number;
    PrecioUnitario?: number;
    Subtotal?: number;
    MontoDescuento?: number;
    Total?: number;
    NombreProducto?: string;
    CodigoProducto?: string;
}

export interface IMetodoPago {
    MetodoPagoID: number;
    Codigo: string;
    Descripcion: string;
}

export interface IVentaRepository {
    findAll(): Promise<IVenta[]>;
    findById(id: number): Promise<IVenta | null>;
    findByCode(codigo: string): Promise<IVenta | null>;
    findByClienteNIT(nit: string): Promise<IVenta[]>;
    findBetweenDates(fechaInicio: Date, fechaFin: Date): Promise<IVenta[]>;
    create(venta: IVenta): Promise<IVenta>;
    update(venta: IVenta): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    getDetalleVenta(ventaID: number): Promise<IDetalleVenta[]>;
    getMetodosPago(): Promise<IMetodoPago[]>;
}
