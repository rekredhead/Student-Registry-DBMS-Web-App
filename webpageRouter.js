const express = require('express');
const { DB_TABLE_NAME } = require('./config');
const connection = require('./database/connection');

const router = express.Router();
router.use('/', express.static('./client-side')); // Host main page in domain URL

// Change API URIs for this file and frontend script.js as well at the end
// Add response status codes
// Send error responses to frontend and make script.js display those errors to user (eg: Phone Number already exists)

// /studentData
router.get('/fetchData', (req, res) => {
    const fetchDataQuery = `
        SELECT
            student_id,
            first_name,
            last_name,
            DATE_FORMAT(DOB, "%Y-%m-%d") DOB,
            phone
        FROM ${DB_TABLE_NAME}`;

    connection.query(fetchDataQuery, (err, data) => {
        if (err) throw err;
        res.status(200).send(data);
    });
});

// /newStudentData
router.post('/sendData', (req, res) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const phoneNumber = req.body.phone;
    const dateOfBirth = req.body.dob;

    const insertDataQuery = `
        INSERT INTO ${DB_TABLE_NAME} (
            first_name,
            last_name,
            DOB,
            phone
        ) VALUES (
            '${firstName}',
            '${lastName}',
            '${dateOfBirth}',
            '${phoneNumber}'
        )`;
    
    connection.query(insertDataQuery, (err, data) => {
        if (err) throw err;
        console.log(`Student ${data.insertId} Added`);
        res.status(200).send("ok");
    });
});

router.delete('/resetData', (req, res) => {
    const deleteAllRecordsQuery = `DELETE FROM ${DB_TABLE_NAME}`;
    connection.query(deleteAllRecordsQuery, (err) => {
        if (err) throw err;
        console.log("Deleted all records");
        res.status(200).send("ok");
    });
});

router.delete('/deleteRecord', (req, res) => {
    const studentId = req.body.student_id;
    const deleteRecordQuery = `
        DELETE FROM ${DB_TABLE_NAME}
        WHERE student_id = ${studentId}`;

    connection.query(deleteRecordQuery, (err) => {
        if (err) throw err;
        console.log(`Student ${studentId} deleted`);
        res.status(200).send("ok");
    });
});

// Update data record of a specific record identified by it's id
router.put('/updateRecord', (request, response) => {
    // Converting the requested data from the client to valid SQL data types
    let studID = JSON.parse(request.body.student_id);
    let fnameVal = JSON.stringify(request.body.first_name);
    let lnameVal = JSON.stringify(request.body.last_name);
    let phoneVal = JSON.stringify(request.body.phone);
    let dobVal = convertToDate(request.body.dob);

    // Query to update the record
    let updateQuery = `UPDATE ${DB_TABLE_NAME} SET ` +
        `first_name=${fnameVal}, last_name=${lnameVal}, DOB=${dobVal}, phone=${phoneVal} ` +
        `WHERE student_id=${studID}`;
    
    connection.query(updateQuery, (err) => {
        if (err) throw err;
    });
});

// Display the message if user enters unavailable url
router.all('*', (request, result) => {
    result.status(404).send("<h1>Resource not found</h1>")
});

convertToDate = (dateString) => {
    // Collect date type string in the form "DD-MM-YYYY" and returns it as "YYYY-MM-DD"
    let dateTimes = dateString.split("-");
    let formattedDate = `${dateTimes[2]}-${dateTimes[1]}-${dateTimes[0]}`;
    return JSON.stringify(formattedDate);
};

module.exports = router;