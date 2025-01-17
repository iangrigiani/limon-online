require('dotenv').config();

const config = {
    development: {
        type: 'sqlite',
        database: 'highscores.db'
    },
    production: {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: {
            rejectUnauthorized: true,
            ca: process.env.DB_CA_CERT
        }
    }
};

const environment = 'production';
module.exports = config[environment]; 