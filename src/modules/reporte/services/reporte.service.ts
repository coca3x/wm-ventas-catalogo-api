import { ReporteRepository } from '../repositories/reporte.repository';
import { ITopProducto, ITopCliente } from '../interfaces/reporte.interface';

export class ReporteService {
    private repository: ReporteRepository;

    constructor() {
        this.repository = new ReporteRepository();
    }

    async getTopProductos(limite: number = 10, porMonto: boolean = false): Promise<ITopProducto[]> {
        return await this.repository.getTopProductos(limite, porMonto);
    }

    async getTopClientes(limite: number = 5, porTransacciones: boolean = true): Promise<ITopCliente[]> {
        return await this.repository.getTopClientes(limite, porTransacciones);
    }

    async getVentasPorPeriodo(fechaInicio: Date, fechaFin: Date): Promise<any> {
        return await this.repository.getVentasPorPeriodo(fechaInicio, fechaFin);
    }
}
