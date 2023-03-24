const mysql = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, DB_TABLE_NAME } = require('../config');

let connectionWithoutDB = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT
});

connectionWithoutDB.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected...");

    const createDBQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
    connectionWithoutDB.query(createDBQuery, (err) => {
        if (err) throw err;
    });
    
    connectionWithoutDB.changeUser({database: DB_NAME}, (err) => {
        if (err) throw err;
    }); // Add database to connection

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${DB_TABLE_NAME} (
            student_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            first_name VARCHAR(20),
            last_name VARCHAR(20),
            DOB DATE,
            phone VARCHAR(10)
        )`;
    connectionWithoutDB.query(createTableQuery, (err) => {
        if (err) throw err;
    });
});

module.exports = connectionWithoutDB;