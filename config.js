require('dotenv').config();

const PORT = process.env.PORT;
module.exports = {
    PORT,
    DOMAIN: `http://localhost:${PORT}`,
    DB_NAME: 'studentDB',
    DB_TABLE_NAME: 'studentRecords',
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD
}