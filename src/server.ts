import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('No se pudo conectar a la base de datos', err);
  process.exit(1);
});
