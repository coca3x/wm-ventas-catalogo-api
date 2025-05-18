import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Ventas y Catálogo',
            version,
            description: 'API para gestión de ventas y catálogo de productos',
            contact: {
                name: 'Eduardo Xuyá',
                email: 'ozcar2294@@gmail.com'
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor de desarrollo'
            },
            {
                url: 'https://api-stage.example.com',
                description: 'Servidor de staging'
            },
            {
                url: 'https://api.example.com',
                description: 'Servidor de producción'
            }
        ],
        components: {
            schemas: {
                Cliente: {
                    type: 'object',
                    required: ['NIT', 'NombreCompleto', 'Telefono'],
                    properties: {
                        NIT: {
                            type: 'string',
                            description: 'NIT del cliente'
                        },
                        NombreCompleto: {
                            type: 'string',
                            description: 'Nombre completo del cliente'
                        },
                        Telefono: {
                            type: 'string',
                            description: 'Número de teléfono del cliente'
                        },
                        CorreoElectronico: {
                            type: 'string',
                            description: 'Correo electrónico del cliente'
                        },
                        Estado: {
                            type: 'boolean',
                            description: 'Estado del cliente (activo/inactivo)'
                        },
                        FechaCreacion: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación del cliente'
                        }
                    }
                },
                Producto: {
                    type: 'object',
                    required: ['CodigoProducto', 'Nombre', 'PrecioUnitario', 'UnidadID'],
                    properties: {
                        ProductoID: {
                            type: 'integer',
                            description: 'ID del producto'
                        },
                        CodigoProducto: {
                            type: 'string',
                            description: 'Código único del producto'
                        },
                        Nombre: {
                            type: 'string',
                            description: 'Nombre del producto'
                        },
                        Descripcion: {
                            type: 'string',
                            description: 'Descripción del producto'
                        },
                        PrecioUnitario: {
                            type: 'number',
                            description: 'Precio unitario del producto'
                        },
                        UnidadID: {
                            type: 'integer',
                            description: 'ID de la unidad de medida'
                        },
                        Stock: {
                            type: 'integer',
                            description: 'Cantidad disponible en inventario'
                        },
                        Estado: {
                            type: 'boolean',
                            description: 'Estado del producto (activo/inactivo)'
                        },
                        FechaCreacion: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación del producto'
                        }
                    }
                },
                Descuento: {
                    type: 'object',
                    required: ['ProductoID', 'TipoDescuentoID', 'Valor', 'FechaInicio', 'FechaFin'],
                    properties: {
                        DescuentoID: {
                            type: 'integer',
                            description: 'ID del descuento'
                        },
                        ProductoID: {
                            type: 'integer',
                            description: 'ID del producto al que aplica el descuento'
                        },
                        TipoDescuentoID: {
                            type: 'integer',
                            description: 'ID del tipo de descuento (porcentaje o monto fijo)'
                        },
                        Valor: {
                            type: 'number',
                            description: 'Valor del descuento'
                        },
                        FechaInicio: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de inicio del descuento'
                        },
                        FechaFin: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de fin del descuento'
                        },
                        Estado: {
                            type: 'boolean',
                            description: 'Estado del descuento (activo/inactivo)'
                        }
                    }
                },
                Venta: {
                    type: 'object',
                    required: ['NIT', 'MetodoPagoID', 'Detalle'],
                    properties: {
                        VentaID: {
                            type: 'integer',
                            description: 'ID de la venta'
                        },
                        CodigoVenta: {
                            type: 'string',
                            description: 'Código único de la venta'
                        },
                        NIT: {
                            type: 'string',
                            description: 'NIT del cliente'
                        },
                        FechaVenta: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha y hora de la venta'
                        },
                        MetodoPagoID: {
                            type: 'integer',
                            description: 'ID del método de pago'
                        },
                        Subtotal: {
                            type: 'number',
                            description: 'Subtotal de la venta antes de descuentos'
                        },
                        TotalDescuento: {
                            type: 'number',
                            description: 'Total de descuentos aplicados'
                        },
                        Total: {
                            type: 'number',
                            description: 'Total de la venta después de descuentos'
                        },
                        Estado: {
                            type: 'boolean',
                            description: 'Estado de la venta (activa/anulada)'
                        },
                        Detalle: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/DetalleVenta'
                            }
                        }
                    }
                },
                DetalleVenta: {
                    type: 'object',
                    required: ['ProductoID', 'Cantidad'],
                    properties: {
                        DetalleID: {
                            type: 'integer',
                            description: 'ID del detalle de venta'
                        },
                        VentaID: {
                            type: 'integer',
                            description: 'ID de la venta'
                        },
                        ProductoID: {
                            type: 'integer',
                            description: 'ID del producto'
                        },
                        Cantidad: {
                            type: 'integer',
                            description: 'Cantidad de productos'
                        },
                        PrecioUnitario: {
                            type: 'number',
                            description: 'Precio unitario del producto al momento de la venta'
                        },
                        Subtotal: {
                            type: 'number',
                            description: 'Subtotal (precio * cantidad)'
                        },
                        MontoDescuento: {
                            type: 'number',
                            description: 'Monto del descuento aplicado'
                        },
                        Total: {
                            type: 'number',
                            description: 'Total después de descuentos'
                        }
                    }
                },
                Reporte: {
                    type: 'object',
                    properties: {
                        // Propiedades específicas según el tipo de reporte
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string'
                        },
                        error: {
                            type: 'string'
                        }
                    }
                }
            },
            responses: {
                BadRequest: {
                    description: 'La petición contiene datos inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    message: {
                                        type: 'string'
                                    },
                                    error: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                NotFound: {
                    description: 'El recurso no fue encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    message: {
                                        type: 'string'
                                    },
                                    error: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/modules/*/routes.ts', './src/routes.ts'], // Rutas donde se encuentran las anotaciones JSDoc para swagger
};

export const specs = swaggerJsdoc(options);
