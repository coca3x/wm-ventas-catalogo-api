import dotenv from 'dotenv';
import path from 'path';

// Cargar el archivo .env según el entorno
const env = process.env.NODE_ENV || 'dev';
const envFile = env === 'production' ? '.env' : `.env.${env}`;
const envPath = path.resolve(process.cwd(), envFile);

dotenv.config({ path: envPath });

// Configuración para la aplicación
export const config = {
    PORT: process.env.PORT || 3000,
    DB_CONFIG: {
        server: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '1433'),
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'WMVentasCatalogo',
        options: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true,
            requestTimeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '15000')
        }
    },
    NODE_ENV: env,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?
        process.env.ALLOWED_ORIGINS.split(',') :
        ['http://localhost:3000', 'http://localhost:5173'],
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DB_RETRY_ATTEMPTS: parseInt(process.env.DB_RETRY_ATTEMPTS || '3'),
    DB_RETRY_DELAY_MS: parseInt(process.env.DB_RETRY_DELAY_MS || '2000')
};
