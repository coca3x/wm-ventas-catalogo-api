import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const sqlConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'WMVentasCatalogo',
    server: process.env.DB_HOST || 'localhost',
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
    try {
        await pool.connect();
        console.log('Conexión a SQL Server establecida correctamente');
        return pool;
    } catch (error) {
        console.error('Error al conectar a SQL Server:', error);
        throw error;
    }
};

export { sql, pool, connectDB };
