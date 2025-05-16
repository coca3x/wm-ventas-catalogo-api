import { IProducto } from '../interfaces/producto.interface';
import { ProductoRepository } from '../repositories/producto.repository';

export class ProductoService {
    private repository: ProductoRepository;

    constructor() {
        this.repository = new ProductoRepository();
    }

    async getAllProductos(): Promise<IProducto[]> {
        return await this.repository.findAll();
    }

    async getProductoById(id: number): Promise<IProducto | null> {
        if (!id || isNaN(id)) {
            throw new Error('ID de producto no válido');
        }

        return await this.repository.findById(id);
    }

    async getProductoByCode(codigo: string): Promise<IProducto | null> {
        if (!codigo) {
            throw new Error('Código de producto no válido');
        }

        return await this.repository.findByCode(codigo);
    }

    async createProducto(productoData: IProducto): Promise<IProducto> {
        // Validaciones básicas
        if (!productoData.CodigoProducto) {
            throw new Error('El código del producto es obligatorio');
        }

        if (!productoData.Nombre) {
            throw new Error('El nombre del producto es obligatorio');
        }

        if (!productoData.PrecioUnitario || isNaN(productoData.PrecioUnitario) || productoData.PrecioUnitario <= 0) {
            throw new Error('El precio unitario debe ser un número positivo');
        }

        if (!productoData.UnidadID || isNaN(productoData.UnidadID)) {
            throw new Error('La unidad de medida es obligatoria');
        }

        if (productoData.Stock === undefined || isNaN(productoData.Stock) || productoData.Stock < 0) {
            throw new Error('El stock debe ser un número positivo o cero');
        }

        const existingProducto = await this.repository.findByCode(productoData.CodigoProducto);
        if (existingProducto) {
            throw new Error(`Ya existe un producto con el código ${productoData.CodigoProducto}`);
        }

        const producto: IProducto = {
            CodigoProducto: productoData.CodigoProducto,
            Nombre: productoData.Nombre,
            Descripcion: productoData.Descripcion,
            PrecioUnitario: productoData.PrecioUnitario,
            UnidadID: productoData.UnidadID,
            Stock: productoData.Stock || 0
        };

        return await this.repository.create(producto);
    }

    async updateProducto(productoData: IProducto): Promise<boolean> {
        if (!productoData.ProductoID || isNaN(productoData.ProductoID)) {
            throw new Error('ID de producto no válido');
        }

        const existingProducto = await this.repository.findById(productoData.ProductoID);
        if (!existingProducto) {
            throw new Error(`No existe un producto con el ID ${productoData.ProductoID}`);
        }

        // Verificar que no exista otro producto con ese código
        if (productoData.CodigoProducto && productoData.CodigoProducto !== existingProducto.CodigoProducto) {
            const productWithSameCode = await this.repository.findByCode(productoData.CodigoProducto);
            if (productWithSameCode && productWithSameCode.ProductoID !== productoData.ProductoID) {
                throw new Error(`Ya existe otro producto con el código ${productoData.CodigoProducto}`);
            }
        }

        const producto: IProducto = {
            ProductoID: productoData.ProductoID,
            CodigoProducto: productoData.CodigoProducto || existingProducto.CodigoProducto,
            Nombre: productoData.Nombre || existingProducto.Nombre,
            Descripcion: productoData.Descripcion !== undefined ? productoData.Descripcion : existingProducto.Descripcion,
            PrecioUnitario: productoData.PrecioUnitario || existingProducto.PrecioUnitario,
            UnidadID: productoData.UnidadID || existingProducto.UnidadID,
            Stock: productoData.Stock !== undefined ? productoData.Stock : existingProducto.Stock
        };

        return await this.repository.update(producto);
    }

    async deleteProducto(id: number): Promise<boolean> {
        if (!id || isNaN(id)) {
            throw new Error('ID de producto no válido');
        }

        const existingProducto = await this.repository.findById(id);
        if (!existingProducto) {
            throw new Error(`No existe un producto con el ID ${id}`);
        }

        return await this.repository.delete(id);
    }

    async updateProductoStock(id: number, cantidad: number): Promise<boolean> {
        if (!id || isNaN(id)) {
            throw new Error('ID de producto no válido');
        }

        if (cantidad === 0) {
            return true;
        }

        const existingProducto = await this.repository.findById(id);
        if (!existingProducto) {
            throw new Error(`No existe un producto con el ID ${id}`);
        }

        // Verificar si la cantidad es válida
        if (cantidad < 0 && existingProducto.Stock + cantidad < 0) {
            throw new Error(`Stock insuficiente para el producto ${existingProducto.Nombre}`);
        }

        return await this.repository.updateStock(id, cantidad);
    }

    async findProductosByFilters(codigo?: string, nombre?: string): Promise<IProducto[]> {
        // Si no se proporcionan filtros se ejecuta la busqueda completa
        if (!codigo && !nombre) {
            return await this.repository.findAll();
        }

        return await this.repository.findByFilters({ codigo, nombre });
    }
}
