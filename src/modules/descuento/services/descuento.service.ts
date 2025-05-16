import { IDescuento, ITipoDescuento } from '../interfaces/descuento.interface';
import { DescuentoRepository } from '../repositories/descuento.repository';
import { ProductoService } from '../../producto/services/producto.service';

export class DescuentoService {
    private repository: DescuentoRepository;
    private productoService: ProductoService;

    constructor() {
        this.repository = new DescuentoRepository();
        this.productoService = new ProductoService();
    }

    async getAllDescuentos(): Promise<IDescuento[]> {
        return await this.repository.findAll();
    }

    async getDescuentoById(id: number): Promise<IDescuento | null> {
        if (!id || isNaN(id)) {
            throw new Error('ID de descuento no válido');
        }

        return await this.repository.findById(id);
    }

    async getDescuentoByProductoId(productoId: number): Promise<IDescuento | null> {
        if (!productoId || isNaN(productoId)) {
            throw new Error('ID de producto no válido');
        }

        const producto = await this.productoService.getProductoById(productoId);
        if (!producto) {
            throw new Error(`No existe un producto con el ID ${productoId}`);
        }

        return await this.repository.findByProductId(productoId);
    }

    async getDescuentosByFilters(productoId?: number, estado?: boolean): Promise<IDescuento[]> {
        const filters: { productoId?: number, estado?: boolean } = {};

        if (productoId) {
            if (isNaN(productoId)) {
                throw new Error('ID de producto no válido');
            }
            filters.productoId = productoId;
        }

        if (estado !== undefined) {
            filters.estado = estado;
        }

        return await this.repository.findByFilters(filters);
    }

    async createDescuento(descuentoData: IDescuento): Promise<IDescuento> {
        if (!descuentoData.ProductoID || isNaN(descuentoData.ProductoID)) {
            throw new Error('El ID del producto es obligatorio');
        }

        if (!descuentoData.TipoDescuentoID || isNaN(descuentoData.TipoDescuentoID)) {
            throw new Error('El tipo de descuento es obligatorio');
        }

        if (!descuentoData.Valor || isNaN(Number(descuentoData.Valor)) || Number(descuentoData.Valor) <= 0) {
            throw new Error('El valor del descuento debe ser un número positivo');
        }

        if (!descuentoData.FechaInicio) {
            throw new Error('La fecha de inicio es obligatoria');
        }

        if (!descuentoData.FechaFin) {
            throw new Error('La fecha de fin es obligatoria');
        }

        const fechaInicio = new Date(descuentoData.FechaInicio);
        const fechaFin = new Date(descuentoData.FechaFin);

        if (isNaN(fechaInicio.getTime())) {
            throw new Error('La fecha de inicio no es válida');
        }

        if (isNaN(fechaFin.getTime())) {
            throw new Error('La fecha de fin no es válida');
        }

        if (fechaInicio > fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        const producto = await this.productoService.getProductoById(descuentoData.ProductoID);
        if (!producto) {
            throw new Error(`No existe un producto con el ID ${descuentoData.ProductoID}`);
        }

        // Verificar que el producto no tenga ya un descuento asignado
        const existingDescuento = await this.repository.findByProductId(descuentoData.ProductoID);
        if (existingDescuento) {
            throw new Error(`El producto con ID ${descuentoData.ProductoID} ya tiene un descuento asignado`);
        }

        const descuento: IDescuento = {
            ProductoID: descuentoData.ProductoID,
            TipoDescuentoID: descuentoData.TipoDescuentoID,
            Valor: Number(descuentoData.Valor),
            FechaInicio: fechaInicio,
            FechaFin: fechaFin
        };

        return await this.repository.create(descuento);
    }

    async updateDescuento(descuentoData: IDescuento): Promise<boolean> {
        if (!descuentoData.DescuentoID || isNaN(descuentoData.DescuentoID)) {
            throw new Error('ID de descuento no válido');
        }

        const existingDescuento = await this.repository.findById(descuentoData.DescuentoID);
        if (!existingDescuento) {
            throw new Error(`No existe un descuento con el ID ${descuentoData.DescuentoID}`);
        }

        // Verificar que si se cambia el producto, no tenga ya un descuento asignado
        if (descuentoData.ProductoID && descuentoData.ProductoID !== existingDescuento.ProductoID) {
            const productoDescuento = await this.repository.findByProductId(descuentoData.ProductoID);
            if (productoDescuento && productoDescuento.DescuentoID !== descuentoData.DescuentoID) {
                throw new Error(`El producto con ID ${descuentoData.ProductoID} ya tiene un descuento asignado`);
            }
        }

        // Validación de fechas - proporcionadas
        let fechaInicio = existingDescuento.FechaInicio;
        let fechaFin = existingDescuento.FechaFin;

        if (descuentoData.FechaInicio) {
            fechaInicio = new Date(descuentoData.FechaInicio);
            if (isNaN(fechaInicio.getTime())) {
                throw new Error('La fecha de inicio no es válida');
            }
        }

        if (descuentoData.FechaFin) {
            fechaFin = new Date(descuentoData.FechaFin);
            if (isNaN(fechaFin.getTime())) {
                throw new Error('La fecha de fin no es válida');
            }
        }

        if (fechaInicio > fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        const descuento: IDescuento = {
            DescuentoID: descuentoData.DescuentoID,
            ProductoID: descuentoData.ProductoID || existingDescuento.ProductoID,
            TipoDescuentoID: descuentoData.TipoDescuentoID || existingDescuento.TipoDescuentoID,
            Valor: descuentoData.Valor !== undefined ? Number(descuentoData.Valor) : existingDescuento.Valor,
            FechaInicio: fechaInicio,
            FechaFin: fechaFin
        };

        return await this.repository.update(descuento);
    }

    async activateDescuento(id: number): Promise<boolean> {
        if (!id || isNaN(id)) {
            throw new Error('ID de descuento no válido');
        }

        const existingDescuento = await this.repository.findById(id);
        if (!existingDescuento) {
            throw new Error(`No existe un descuento con el ID ${id}`);
        }

        if (existingDescuento.Estado) {
            throw new Error(`El descuento con ID ${id} ya está activado`);
        }

        return await this.repository.activate(id);
    }

    async deactivateDescuento(id: number): Promise<boolean> {
        if (!id || isNaN(id)) {
            throw new Error('ID de descuento no válido');
        }

        const existingDescuento = await this.repository.findById(id);
        if (!existingDescuento) {
            throw new Error(`No existe un descuento con el ID ${id}`);
        }

        if (!existingDescuento.Estado) {
            throw new Error(`El descuento con ID ${id} ya está desactivado`);
        }

        return await this.repository.deactivate(id);
    }

    async getTiposDescuento(): Promise<ITipoDescuento[]> {
        return await this.repository.getTiposDescuento();
    }
}
