const express = require('express');
const { DB_TABLE_NAME } = require('./config');
const connection = require('./database/connection');

const router = express.Router();
router.use('/', express.static('./client-side')); // Host main page in domain URL

router.get('/records', (req, res) => {
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

router.post('/newRecord', (req, res) => {
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

router.put('/updatedRecord', (req, res) => {
    const studentID = req.body.student_id;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const phoneNumber = req.body.phone;
    const dateOfBirth = req.body.dob;

    const updateQuery = `
        UPDATE ${DB_TABLE_NAME} SET
            first_name='${firstName}',
            last_name='${lastName}',
            DOB='${dateOfBirth}',
            phone='${phoneNumber}'
        WHERE student_id=${studentID}`;
    
    connection.query(updateQuery, (err) => {
        if (err) throw err;
        console.log(`Student ${studentID} updated`);
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

router.delete('/deleteAllRecords', (req, res) => {
    const hasUserConfirmedToResetTable = req.body.confirmation;
    const deleteAllRecordsQuery = `DELETE FROM ${DB_TABLE_NAME}`;

    if (hasUserConfirmedToResetTable !== 'Yes, Reset') return;

    connection.query(deleteAllRecordsQuery, (err) => {
        if (err) throw err;
        console.log("Deleted all records");
        res.status(200).send("ok");
    });
});

// If user open unavailable URI
router.all('*', (req, res) => {
    res.status(404).send("<h1>Resource not found</h1>")
});

module.exports = router;