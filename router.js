const express = require('express');
const Router = express.Router();
const connection = require('./database/connection');

const tableName = 'studentrecords';

// Basically means 'localhost:<port>/' returns the webpage from the 'client-side' folder
Router.use(express.static('./client-side'));

// 'localhost:<port>/fetchData' contains the data from the database
Router.get('/fetchData', (request, response) => {
    // In the date part of the query, 'YYYY-MM-DDT...' => 'DD-MM-YYYY'
    let fetchDataQuery = `SELECT student_id, first_name, last_name, DATE_FORMAT(DOB, "%Y-%m-%d") DOB, phone FROM ${tableName}`;
    connection.query(fetchDataQuery, (err, data) => {
        if (err) throw err;
        response.send(JSON.parse(JSON.stringify(data)));
    });
});

// Collecting requests (inserting data) from the server
Router.post('/sendData', (request, response) => {
    // Converting some of each item into a string before inserting them in the database
    let fnameVal = JSON.stringify(request.body.first_name);
    let lnameVal = JSON.stringify(request.body.last_name);
    let phoneVal = request.body.phone;
    let dobVal = convertToDate(request.body.dob);

    let insertDataQuery = `
                        INSERT INTO ${tableName} (first_name, last_name, DOB, phone) 
                        VALUES (${fnameVal}, ${lnameVal}, ${dobVal}, ${phoneVal})`;

    connection.query(insertDataQuery, (err) => {
        if (err) throw err;
    });
});

// Delete all data from the database table
Router.delete('/resetData', (request, response) => {
    connection.query(`DELETE FROM ${tableName}`, (err) => {
        if (err) throw err;
    });
});

// Delete data record of a specific record identified by it's id
Router.delete('/deleteRecord', (request, response) => {
    let studID = JSON.parse(request.body.student_id);
    connection.query(`DELETE FROM ${tableName} WHERE student_id = ${studID}`, (err) => {
        if (err) throw err;
    });
});

// Update data record of a specific record identified by it's id
Router.put('/updateRecord', (request, response) => {
    // Converting the requested data from the client to valid SQL data types
    let studID = JSON.parse(request.body.student_id);
    let fnameVal = JSON.stringify(request.body.first_name);
    let lnameVal = JSON.stringify(request.body.last_name);
    let phoneVal = JSON.stringify(request.body.phone);
    let dobVal = convertToDate(request.body.dob);

    // Query to update the record
    let updateQuery = `UPDATE ${tableName} SET ` +
        `first_name=${fnameVal}, last_name=${lnameVal}, DOB=${dobVal}, phone=${phoneVal} ` +
        `WHERE student_id=${studID}`;
    
    connection.query(updateQuery, (err) => {
        if (err) throw err;
    });
});

// Display the message if user enters unavailable url
Router.all('*', (request, result) => {
    result.status(404).send("<h1>Resource not found</h1>")
});

convertToDate = (dateString) => {
    // Collect date type string in the form "DD-MM-YYYY" and returns it as "YYYY-MM-DD"
    let dateTimes = dateString.split("-");
    let formattedDate = `${dateTimes[2]}-${dateTimes[1]}-${dateTimes[0]}`;
    return JSON.stringify(formattedDate);
};

module.exports = Router;