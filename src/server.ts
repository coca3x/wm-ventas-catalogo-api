import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import { config } from './config/config';
import { connectDB } from './config/database';
import { loadEnv } from './config/env';

loadEnv();

const app = express();
const PORT = config.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Ruta de verificación de estado (health check)
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Rutas
app.use('/api', routes);

// Ruta por defecto
app.get('/', (_req, res) => {
  res.json({
    message: 'API de Ventas y Catálogo',
    docs: '/api-docs',
    health: '/health'
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT} (${config.NODE_ENV})`);
      console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error fatal al iniciar la aplicación:', error);

    if (config.NODE_ENV === 'dev') {
      console.log('Iniciando en modo de contingencia (solo para desarrollo)...');
      app.listen(PORT, () => {
        console.log(`Servidor de contingencia corriendo en el puerto ${PORT}`);
        console.log('ADVERTENCIA: La conexión a la base de datos ha fallado.');
      });
    } else {
      process.exit(1);
    }
  }
};

startServer();

export default app;
