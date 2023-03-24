require('dotenv').config();

const PORT = process.env.PORT;
export default {
    PORT,
    DOMAIN: `http://localhost:${PORT}`,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD
}