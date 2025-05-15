# Backend - Sales and Catalog Management System

This repository contains the backend code for the **Sales and Catalog Management System** project. The backend is developed using **Node.js**, **Express**, and **TypeScript** for improved robustness and scalability.

## Main Features

- RESTful API for managing products, clients, discounts, and sales.
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
- **MySQL / SQL Server Express**
- **Dotenv** for configuration
- **Jest** for unit testing

## Releases

Current Version 0.0.1

```
      Date            Team            Version
      2025/05/15      Xuya            2.0.4
```

## Installation

```bash
# Clone the repository
git clone https://github.com/coca3x/wm-ventas-catalogo-api.git
cd wm-ventas-catalogo-api

# Install dependencies
npm install
```

## Scripts

```bash
# Start the server in development mode
npm run dev

# Compile TypeScript
npm run build

# Run tests
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
DB_NAME=VentasCatalogo
```

## Testing

```bash
# Run unit tests
npm run test
```

## Project Structure

```
wm-ventas-catalogo-api/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── database/
│   ├── middlewares/
│   └── utils/
├── tests/
├── .env
├── tsconfig.json
├── package.json
└── README.md
```

## License

For academic or testing purposes only.

---

## Author

Eduardo Xuyá - FullStack Developer
