import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';

export class ProductoController {
    private service: ProductoService;

    constructor() {
        this.service = new ProductoService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const { codigo, nombre } = req.query;

            // Cuando existan parametros se usará el método de filtrado
            if (codigo || nombre) {
                const productos = await this.service.findProductosByFilters(
                    codigo?.toString(),
                    nombre?.toString()
                );

                return res.status(200).json({
                    success: true,
                    data: productos
                });
            }

            // Cuando no hayan parametros extraer todos los productos
            const productos = await this.service.getAllProductos();
            return res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los productos',
                error: error.message
            });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const producto = await this.service.getProductoById(id);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún producto con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                data: producto
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el producto',
                error: error.message
            });
        }
    };

    getByCode = async (req: Request, res: Response) => {
        try {
            const codigo = req.params.codigo;
            const producto = await this.service.getProductoByCode(codigo);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún producto con el código ${codigo}`
                });
            }

            return res.status(200).json({
                success: true,
                data: producto
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el producto',
                error: error.message
            });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const productoData = req.body;
            const producto = await this.service.createProducto(productoData);

            return res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: producto
            });
        } catch (error: any) {
            if (error.message.includes('Ya existe un producto') ||
                error.message.includes('obligatorio') ||
                error.message.includes('positivo')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al crear el producto',
                error: error.message
            });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const productoData = { ...req.body, ProductoID: id };

            const result = await this.service.updateProducto(productoData);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún producto con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente'
            });
        } catch (error: any) {
            if (error.message.includes('No existe un producto') ||
                error.message.includes('ID de producto no válido')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('Ya existe otro producto')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el producto',
                error: error.message
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const result = await this.service.deleteProducto(id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró ningún producto con el ID ${id}`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Producto eliminado exitosamente'
            });
        } catch (error: any) {
            if (error.message.includes('No existe un producto')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al eliminar el producto',
                error: error.message
            });
        }
    };

    updateStock = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { cantidad } = req.body;

            if (cantidad === undefined || isNaN(Number(cantidad))) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe proporcionar una cantidad válida'
                });
            }

            const result = await this.service.updateProductoStock(id, Number(cantidad));

            return res.status(200).json({
                success: true,
                message: `Stock del producto actualizado exitosamente`
            });
        } catch (error: any) {
            if (error.message.includes('Stock insuficiente')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('No existe un producto')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el stock del producto',
                error: error.message
            });
        }
    };
}
