import { IVenta, IDetalleVenta, IMetodoPago } from '../interfaces/venta.interface';
import { VentaRepository } from '../repositories/venta.repository';
import { ClienteService } from '../../cliente/services/cliente.service';
import { ProductoService } from '../../producto/services/producto.service';
import { DescuentoService } from '../../descuento/services/descuento.service';

export class VentaService {
    private repository: VentaRepository;
    private clienteService: ClienteService;
    private productoService: ProductoService;
    private descuentoService: DescuentoService;

    constructor() {
        this.repository = new VentaRepository();
        this.clienteService = new ClienteService();
        this.productoService = new ProductoService();
        this.descuentoService = new DescuentoService();
    }

    async getAllVentas(): Promise<IVenta[]> {
        return await this.repository.findAll();
    }

    async getVentaById(id: number): Promise<IVenta | null> {
        if (!id || isNaN(id)) {
            throw new Error('ID de venta no válido');
        }

        return await this.repository.findById(id);
    }

    async getVentaByCode(codigo: string): Promise<IVenta | null> {
        if (!codigo) {
            throw new Error('Código de venta no válido');
        }

        return await this.repository.findByCode(codigo);
    }

    async getVentasByCliente(nit: string): Promise<IVenta[]> {
        if (!nit) {
            throw new Error('NIT de cliente no válido');
        }

        const cliente = await this.clienteService.getClienteByNIT(nit);
        if (!cliente) {
            throw new Error(`No existe un cliente con el NIT ${nit}`);
        }

        return await this.repository.findByClienteNIT(nit);
    }

    async getVentasByDateRange(fechaInicio: Date, fechaFin: Date): Promise<IVenta[]> {
        if (!fechaInicio || !fechaFin || isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            throw new Error('Fechas no válidas');
        }

        if (fechaInicio > fechaFin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        return await this.repository.findBetweenDates(fechaInicio, fechaFin);
    }

    async createVenta(ventaData: IVenta): Promise<IVenta> {
        if (!ventaData.NIT) {
            throw new Error('El NIT del cliente es obligatorio');
        }

        if (!ventaData.MetodoPagoID || isNaN(ventaData.MetodoPagoID)) {
            throw new Error('El método de pago es obligatorio');
        }

        if (!ventaData.Detalle || ventaData.Detalle.length === 0) {
            throw new Error('La venta debe tener al menos un producto');
        }

        const cliente = await this.clienteService.getClienteByNIT(ventaData.NIT);
        if (!cliente) {
            throw new Error(`No existe un cliente con el NIT ${ventaData.NIT}`);
        }

        // Validar cada detalle de la venta y calcular subtotales
        let subtotal = 0;
        let totalDescuento = 0;

        for (const detalle of ventaData.Detalle) {
            if (!detalle.ProductoID || isNaN(detalle.ProductoID)) {
                throw new Error('El ID del producto es obligatorio');
            }

            if (!detalle.Cantidad || isNaN(detalle.Cantidad) || detalle.Cantidad <= 0) {
                throw new Error('La cantidad debe ser un número positivo');
            }

            // Verificar stock
            const producto = await this.productoService.getProductoById(detalle.ProductoID);
            if (!producto) {
                throw new Error(`No existe un producto con el ID ${detalle.ProductoID}`);
            }

            if (producto.Stock < detalle.Cantidad) {
                throw new Error(`Stock insuficiente para el producto ${producto.Nombre}. Stock disponible: ${producto.Stock}`);
            }

            // Calcular subtotal del producto
            const precioUnitario = producto.PrecioUnitario;
            const subtotalProducto = precioUnitario * detalle.Cantidad;

            // Verificar si el producto tiene descuento activo
            const descuento = await this.descuentoService.getDescuentoByProductoId(detalle.ProductoID);
            let montoDescuento = 0;

            if (descuento && descuento.Estado) {
                const fechaActual = new Date();
                const fechaInicio = new Date(descuento.FechaInicio);
                const fechaFin = new Date(descuento.FechaFin);

                // Verificar si el descuento está vigente
                if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
                    // Calcular el descuento según su tipo
                    // Porcentaje
                    if (descuento.TipoDescuentoID === 1) {
                        montoDescuento = subtotalProducto * (descuento.Valor / 100);
                    }
                    // Monto fijo
                    else if (descuento.TipoDescuentoID === 2) {
                        montoDescuento = Math.min(subtotalProducto, descuento.Valor * detalle.Cantidad);
                    }
                }
            }

            // Guardar información calculada en el detalle
            detalle.PrecioUnitario = precioUnitario;
            detalle.Subtotal = subtotalProducto;
            detalle.MontoDescuento = montoDescuento;
            detalle.Total = subtotalProducto - montoDescuento;

            // Acumular totales de la venta
            subtotal += subtotalProducto;
            totalDescuento += montoDescuento;
        }

        // Calcular el total de la venta
        const total = subtotal - totalDescuento;

        const venta: IVenta = {
            NIT: ventaData.NIT,
            MetodoPagoID: ventaData.MetodoPagoID,
            Subtotal: subtotal,
            TotalDescuento: totalDescuento,
            Total: total,
            Detalle: ventaData.Detalle
        };

        return await this.repository.create(venta);
    }

    async updateVenta(ventaData: IVenta): Promise<boolean> {
        if (!ventaData.VentaID || isNaN(ventaData.VentaID)) {
            throw new Error('ID de venta no válido');
        }

        const existingVenta = await this.repository.findById(ventaData.VentaID);
        if (!existingVenta) {
            throw new Error(`No existe una venta con el ID ${ventaData.VentaID}`);
        }

        if (!ventaData.NIT) {
            throw new Error('El NIT del cliente es obligatorio');
        }

        if (!ventaData.MetodoPagoID || isNaN(ventaData.MetodoPagoID)) {
            throw new Error('El método de pago es obligatorio');
        }

        const cliente = await this.clienteService.getClienteByNIT(ventaData.NIT);
        if (!cliente) {
            throw new Error(`No existe un cliente con el NIT ${ventaData.NIT}`);
        }

        return await this.repository.update(ventaData);
    }

    async deleteVenta(id: number): Promise<boolean> {
        if (!id || isNaN(id)) {
            throw new Error('ID de venta no válido');
        }

        const existingVenta = await this.repository.findById(id);
        if (!existingVenta) {
            throw new Error(`No existe una venta con el ID ${id}`);
        }

        return await this.repository.delete(id);
    }

    async getMetodosPago(): Promise<IMetodoPago[]> {
        return await this.repository.getMetodosPago();
    }
}
