import { ReporteRepository } from '../repositories/reporte.repository';
import { ITopProducto, ITopCliente } from '../interfaces/reporte.interface';

export class ReporteService {
    private repository: ReporteRepository;

    constructor() {
        this.repository = new ReporteRepository();
    }

    async getTopProductos(limite: number = 10, porMonto: boolean = false): Promise<ITopProducto[]> {
        // Eliminamos la validación de límite ya que se realiza en el middleware
        return await this.repository.getTopProductos(limite, porMonto);
    }

    async getTopClientes(limite: number = 5, porTransacciones: boolean = true): Promise<ITopCliente[]> {
        // Eliminamos la validación de límite ya que se realiza en el middleware
        return await this.repository.getTopClientes(limite, porTransacciones);
    }

    async getVentasPorPeriodo(fechaInicio: Date, fechaFin: Date): Promise<any> {
        // Eliminamos las validaciones de fecha ya que se realizan en el middleware
        return await this.repository.getVentasPorPeriodo(fechaInicio, fechaFin);
    }
}
