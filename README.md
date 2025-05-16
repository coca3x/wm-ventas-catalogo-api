# Backend - Sales and Catalog Management System

This repository contains the backend code for the **Sales and Catalog Management System** project. The backend is developed using **Node.js**, **Express**, and **TypeScript** for improved robustness and scalability.

## Main Features

- RESTful API for managing products, clients, discounts, and sales.
- Modular architecture for easy extension.
- Use of stored procedures for database interaction.
- Data validation and input sanitization.
- Implementation of SOLID principles and best development practices.
- Support for logical deletion of records.
- Security through username and password authentication (to be implemented).
- Generation of sales and customer reports.

## Technologies Used

- **Node.js**
- **Express**
- **TypeScript**
- **SQL Server Express**
- **Dotenv** for configuration
- **Jest** for unit testing (to be implemented)

## Project Structure

```
wm-ventas-catalogo-api/
│
├── src/
│   ├── config/               # Application configuration
│   │   ├── database.ts
│   │   └── ...
│   ├── middlewares/          # Express middlewares
│   │   ├── errorHandler.ts
│   │   └── ...
│   ├── modules/              # Feature modules
│   │   ├── cliente/          # Cliente module
│   │   │   ├── controllers/
│   │   │   ├── interfaces/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── routes.ts
│   │   ├── healthCheck/      # Health check module
│   │   │   ├── controllers/
│   │   │   └── routes.ts
│   │   └── ...               # Other modules
│   ├── db/                   # Database scripts and migrations
│   │   ├── scripts/
│   │   │   ├── schema.sql
│   │   │   └── procedures.sql
│   │   └── ...
│   ├── utils/                # Utility functions and helpers
│   ├── types/                # Global TypeScript types
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Server startup
│   ├── routes.ts             # Main route definitions
│   └── index.ts              # Application entry point
│
├── tests/                    # Tests directory
│   ├── unit/
│   
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## Installation

```bash
# Clone the repository
git clone https://github.com/coca3x/wm-ventas-catalogo-api.git
cd wm-ventas-catalogo-api

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Configuration

This project supports multiple environments through different `.env` files:

- `.env.dev` - Development environment
- `.env.stage` - Staging environment
- `.env.production` - Production environment

To use a specific environment:

```bash
# Development
npm run dev          # Uses .env.dev

# Staging
npm run dev:stage    # Uses .env.stage

# Production build and start
npm run build
npm run start        # Uses .env.production
```

## Scripts

```bash

# Compile TypeScript
npm run build

# Start the compiled application
npm start

# Run tests (when implemented)
npm run test
```

## Configuration

This project requires a `.env` file to function properly. Example of necessary variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=1433
DB_USER=username
DB_PASSWORD=password
DB_NAME=DBname
NODE_ENV=development
```

## License

For academic or testing purposes only.

---

## Author

Eduardo Xuyá - FullStack Developer
