import sql from 'mssql';
import { loadEnv } from './env';

// Carga variables de entorno
loadEnv();

const sqlConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'WMVentasCatalogo',
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(sqlConfig);

const connectDB = async () => {
    // Reintentos a BD
    const maxRetries = parseInt(process.env.DB_RETRY_ATTEMPTS || '3', 10);
    const retryDelay = parseInt(process.env.DB_RETRY_DELAY_MS || '5000', 10);
    let retries = 0;

    while (retries <= maxRetries) {
        try {
            await pool.connect();
            console.log(`Conexión a SQL Server (${process.env.DB_HOST}) establecida correctamente`);
            return pool;
        } catch (error) {
            retries++;

            if (retries > maxRetries) {
                console.error(`Agotados todos los intentos (${maxRetries}) de conexión a SQL Server:`, error);
                throw error;
            }

            console.warn(`Intento ${retries} de ${maxRetries} fallido. Reintentando en ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }

    return pool;
};

export { sql, pool, connectDB };
