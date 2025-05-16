import { CorsOptions } from 'cors';

// Configura las opciones de CORS
const corsOptions: CorsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 1 día en segundos
};

export default corsOptions;
