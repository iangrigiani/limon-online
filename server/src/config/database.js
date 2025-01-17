require('dotenv').config();

const config = {
    development: {
        type: process.env.DB_TYPE || 'sqlite',
        database: process.env.DB_NAME || 'highscores.db'
    },
    production: {
        type: process.env.DB_TYPE || 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_CA_CERT ? {
            rejectUnauthorized: true,
            ca: process.env.DB_CA_CERT
        } : false
    }
};

const environment = process.env.NODE_ENV || 'development';
console.log(`Current environment: ${environment}`);
console.log(`Database type: ${config[environment].type}`);

module.exports = config[environment]; 