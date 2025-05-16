import app from './app';
import { connectDB } from './config/database';
import { loadEnv, env } from './config/env';

// Cargar variables de entorno
loadEnv();

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos antes de iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`);
    console.log(`Entorno: ${env.environment}`);
  });
}).catch(err => {
  console.error('No se pudo conectar a la base de datos', err);
  process.exit(1);
});
