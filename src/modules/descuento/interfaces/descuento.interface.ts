export interface IDescuento {
    DescuentoID?: number;
    ProductoID: number;
    TipoDescuentoID: number;
    Valor: number;
    FechaInicio: Date;
    FechaFin: Date;
    Estado?: boolean;
}

export interface ITipoDescuento {
    TipoDescuentoID: number;
    Codigo: string;
    Descripcion: string;
}

export interface IDescuentoRepository {
    findAll(): Promise<IDescuento[]>;
    findById(id: number): Promise<IDescuento | null>;
    findByProductId(productoId: number): Promise<IDescuento | null>;
    findByFilters(filters: { productoId?: number, estado?: boolean }): Promise<IDescuento[]>;
    create(descuento: IDescuento): Promise<IDescuento>;
    update(descuento: IDescuento): Promise<boolean>;
    activate(id: number): Promise<boolean>;
    deactivate(id: number): Promise<boolean>;
    getTiposDescuento(): Promise<ITipoDescuento[]>;
}
