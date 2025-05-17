import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1'
    },
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],
    collectCoverageFrom: [
        'src/modules/cliente/controllers/**/*.ts',
        'src/modules/cliente/services/**/*.ts',
        'src/modules/producto/controllers/**/*.ts',
        'src/modules/producto/services/**/*.ts',
        'src/modules/descuento/controllers/**/*.ts',
        'src/modules/descuento/services/**/*.ts',
        'src/modules/venta/controllers/**/*.ts',
        'src/modules/venta/services/**/*.ts'
    ],
    moduleDirectories: ['node_modules', 'src']
};

export default config;
