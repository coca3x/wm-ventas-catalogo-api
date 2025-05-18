import sql from 'mssql';
import { config } from './config';

// Pool de conexiones para SQL Server
export const pool = new sql.ConnectionPool({
    ...config.DB_CONFIG,
    options: {
        ...config.DB_CONFIG.options,
        connectTimeout: 30000,
        requestTimeout: 30000
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
});

// Función para conectar a la base de datos con reintentos
export const connectDB = async (): Promise<void> => {
    let attempts = 0;
    const maxAttempts = config.DB_RETRY_ATTEMPTS;
    const delayMs = config.DB_RETRY_DELAY_MS;

    while (attempts < maxAttempts) {
        try {
            console.log(`Intentando conectar a la base de datos (intento ${attempts + 1}/${maxAttempts})...`);
            await pool.connect();
            console.log('Conexión exitosa a la base de datos');
            return;
        } catch (err) {
            attempts++;
            console.error(`Error al conectar con la base de datos (intento ${attempts}/${maxAttempts}):`, err);

            if (attempts >= maxAttempts) {
                console.error('Se alcanzó el número máximo de intentos de conexión');
                throw err;
            }

            console.log(`Reintentando en ${delayMs / 1000} segundos...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
};
export { sql };
