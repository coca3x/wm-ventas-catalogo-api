import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export const loadEnv = () => {
    const nodeEnv = process.env.NODE_ENV || 'development';

    const envFileMapping: { [key: string]: string } = {
        'development': '.env.dev',
        'dev': '.env.dev',
        'stage': '.env.stage',
        'staging': '.env.stage',
        'production': '.env.production',
        'prod': '.env.production'
    };

    let envFile = envFileMapping[nodeEnv.toLowerCase()] || `.env.${nodeEnv.toLowerCase()}`;

    const envPath = path.resolve(process.cwd(), envFile);
    // Verificar si el archivo de entorno existe
    if (!fs.existsSync(envPath)) {
        console.warn(`Archivo ${envFile} no encontrado. Usando .env.dev por defecto.`);
        envFile = '.env.dev';
    }

    // Cargar las variables de entorno
    const result = dotenv.config({ path: envFile });

    if (result.error) {
        console.error(`Error al cargar el archivo de entorno ${envFile}:`, result.error);
        throw result.error;
    }

    return {
        environment: nodeEnv,
        envFile,
        isProduction: ['production', 'prod'].includes(nodeEnv.toLowerCase()),
        isDevelopment: ['development'].includes(nodeEnv.toLowerCase()),
        isStage: ['stage', 'staging'].includes(nodeEnv.toLowerCase())
    };
};

// Exportar un objeto con información sobre el entorno actual
export const env = {
    environment: process.env.NODE_ENV || 'development',
    isProduction: ['production', 'prod'].includes((process.env.NODE_ENV || '').toLowerCase()),
    isDevelopment: ['development', 'dev'].includes((process.env.NODE_ENV || 'development').toLowerCase()),
    isStage: ['stage', 'staging'].includes((process.env.NODE_ENV || '').toLowerCase())
};
