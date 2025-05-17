export interface ITopProducto {
    ProductoID: number;
    CodigoProducto: string;
    Nombre: string;
    CantidadVendida?: number;
    MontoTotal?: number;
    Posicion?: number;
}

export interface ITopCliente {
    NIT: string;
    NombreCompleto: string;
    CantidadCompras: number;
    MontoTotal?: number;
    Posicion?: number;
}

export interface IReporteRepository {
    getTopProductos(limite: number, porMonto?: boolean): Promise<ITopProducto[]>;
    getTopClientes(limite: number, porTransacciones?: boolean): Promise<ITopCliente[]>;
    getVentasPorPeriodo(fechaInicio: Date, fechaFin: Date): Promise<any>;
}
