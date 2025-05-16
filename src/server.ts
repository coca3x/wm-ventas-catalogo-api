import express from 'express';
import router from './routes';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);

// Middleware para manejar errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Ha ocurrido un error interno en el servidor',
  });
});

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('No se pudo conectar a la base de datos', err);
  process.exit(1);
});
