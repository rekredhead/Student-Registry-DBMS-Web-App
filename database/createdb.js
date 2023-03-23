// Create connection to the MySQL database - creates new database if it doesn't exist
const mysql = require('mysql');
const dbName = 'studentdb';
const tableName = 'studentrecords';

// Create connection without the database
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kenichi12345',
    port: 3306
});

// Program only seemed to work when all the 'connection' related methods are inside the .connect() method
connection.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected...");

    // Create the database if it doesn't exist
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
        if (err) throw err;
    });

    // Reset the connection but add the database name - important if database was just created
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'kenichi12345',
        database: dbName
    });

    // Create the table if it doesn't exist in the database
    let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (student_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, ` + 
    "first_name VARCHAR(200), last_name VARCHAR(200), DOB DATE, phone VARCHAR(200))";

    connection.query(createTableQuery, (err) => {
        if (err) throw err;
    });
});

module.exports = connection;