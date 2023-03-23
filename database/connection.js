const mysql = require('mysql');
const dbName = 'studentdb';
require('./createdb');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kenichi12345',
    database: dbName,
    port: 3306
});

module.exports = connection;