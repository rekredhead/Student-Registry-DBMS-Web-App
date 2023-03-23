const table         = document.getElementById("table-el");
const studentIdEl   = document.getElementById("student-id");
const firstNameEl   = document.getElementById("first-name");
const lastNameEl    = document.getElementById("last-name");
const dobEl         = document.getElementById("date-of-birth");
const phoneNumEl    = document.getElementById("phone-number");

const addBtn    = document.getElementById("add-button");
const updateBtn = document.getElementById("update-button");
const deleteBtn = document.getElementById("delete-button");
const searchBtn = document.getElementById("search-button");
const resetBtn  = document.getElementById("reset-button");
const clearBtn  = document.getElementById("clear-button");

const hasNumbersOnly = (value) => /^[0-9]*$/.test(value);
const hasLettersOnly = (value) => /[a-z]/gi.test(value);
const removeSpaces = (value) => value.replaceAll(" ", "");

const toggleSideBar = () => {
    const column1 = document.querySelector('.column-1');
    const buttonBar = document.querySelector('.button-bar');
    
    if (column1.style.display !== 'none') {
        column1.style.display = 'none';
        buttonBar.style.left = '5em';
        table.style.marginLeft = '6em';
    } else {
        column1.style.display = 'flex';
        buttonBar.style.left = '15em';
        table.style.marginLeft = '18em';
    }
}
document.getElementById('navbar-toggle-btn').addEventListener('click', toggleSideBar);

// Input Validation
const isStudentIdValid = () => {
    const studentId = removeSpaces(studentIdEl.value);
    if (!hasNumbersOnly(studentId)) {
        alert("Please enter numbers for your student ID");
        return false;
    }
    return true;
}
const isFirstNameValid = () => {
    const firstName = removeSpaces(firstNameEl.value);
    if (firstName === "") {
        alert("Please enter your first name");
        return false;
    } else if (!hasLettersOnly(firstName)) {
        alert("Please enter letters for your first name");
        return false;
    }
    return true;
}
const isLastNameValid = () => {
    const lastName = removeSpaces(lastNameEl.value);
    if (lastName === "") {
        alert("Please enter your last name");
        return false;
    } else if (!hasLettersOnly(lastName)) {
        alert("Please enter letters for your last name");
        return false;
    }
    return true;
}
const isDobValid = () => {
    const dob = dobEl.value;
    if (dob === "") {
        alert("Please enter your date of birth");
        return false;
    }

    const userAge = (Date.now() - Date.parse(dobEl.value)) / 31104000000;
    if (userAge < 5) {
        alert("Please enter your correct age");
        return false;
    }
    return true;
}
const isPhoneNumValid = () => {
    const phoneNum = removeSpaces(phoneNumEl.value);
    if (phoneNum === "") {
        alert("Please enter your phone number");
        return false;
    } else if (!hasNumbersOnly(phoneNum) && phoneNum.length !== 10) {
        alert("Please enter a 10-digit number");
        return false;
    }
    return true;
}
const inputsToValidate = [
    isStudentIdValid, isFirstNameValid, isLastNameValid,
    isDobValid, isPhoneNumValid
];
const isDataValid = (index) => {
    for (let i = 0; i < index; i++) {
        if (!inputsToValidate[i]()) return false;
    }
    return true;
}
document.querySelectorAll('input').forEach((item, index) => {
    item.addEventListener('focus', () => {
        if (!isDataValid(index)) {
            item.blur();
        }
    })
});

// Fetching database data from the server ('localhost:3000/fetchData') as js objects and store each object value in the webpage table
// Will be called in Add, Update, Delete and Reset buttons as well to avoid having to refresh the webpage every time
let loadHTMLTable = async() => {
    // Fetching the Database object from the server and store them as Javascript object
    const response = await fetch('http://localhost:3000/fetchData');
    const tableData = await response.json();
    
    if (tableData.length === 0) {
        // Basically if there is no data on the database - show the message on the Webpage table itself
        let template = "<tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th><th>Phone Number</th></tr>" + 
                        "<tr><td colspan='5'>NO DATA AVAILABLE</td></tr>";
        table.innerHTML = template;
        return;
    }
    
    table.innerHTML = "<tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th><th>Phone Number</th></tr>";
    // Display database values in the Table
    for (let i=0; i < tableData.length; i++) {
        let template = `
                        <tr>
                            <td>${tableData[i].student_id}</td>
                            <td>${tableData[i].first_name}</td>
                            <td>${tableData[i].last_name}</td>
                            <td>${tableData[i].DOB}</td>
                            <td>${tableData[i].phone}</td>
                        </tr>`;
        table.innerHTML += template;
    }
};
loadHTMLTable();

// Clear all data from the input boxes when clear-button is clicked
clearBtn.addEventListener("click", () => {
    studentIdEl.value = "";
    firstNameEl.value = "";
    firstNameEl.value = "";
    dobEl.value = "";
    phoneNumEl.value = "";
});

let rows = table.getElementsByTagName("tr"); // Table rows

// Return background color of all the rows to default when any part of the webpage is double-clicked
document.body.addEventListener("dblclick", () => {
    for (let i=1; i<rows.length; i++) {
        rows[i].style.backgroundColor = null;
    }
});

// Text in Input Boxes will change when a table row is double-clicked
table.addEventListener("click", () => {
    for (i=1; i < rows.length; i++) {
        let currentRow = table.rows[i]; // Content in current row (tr)
        let createClickHandler = (row) => {
            return () => {
                // Store each HTML data from the column of the clicked row into variables
                let idCell = row.getElementsByTagName("td")[0];
                let fnameCell = row.getElementsByTagName("td")[1];
                let lnameCell = row.getElementsByTagName("td")[2];
                let dobCell = row.getElementsByTagName("td")[3];
                let phoneCell = row.getElementsByTagName("td")[4];

                // Change inner text in the input boxes to the 'values' in the table row clicked
                studentIdEl.value = idCell.innerHTML;
                firstNameEl.value = fnameCell.innerHTML;
                firstNameEl.value = lnameCell.innerHTML;
                dobEl.value = dobCell.innerHTML;
                phoneNumEl.value = phoneCell.innerHTML;
            };
        };
        currentRow.ondblclick = createClickHandler(currentRow);
    }
});

// Add-function - send data as an object to the database
addBtn.addEventListener("click", () => {
    let dataPackage = {};

    // Values in text boxes - exclude 'id' - incrementing column
    let textBoxFname = firstNameEl.value;
    let textBoxLname = firstNameEl.value
    let textBoxDob = dobEl.value;
    let textBoxPhone = phoneNumEl.value;

    let emptyBox = ["", " "]; // Empty Boxes

    // If all boxes except the 'id' box are empty, alert an error message
    if (emptyBox.includes(textBoxFname) || emptyBox.includes(textBoxLname) || emptyBox.includes(textBoxDob) || emptyBox.includes(textBoxPhone)) {
        alert("Please fill in ALL the boxes");
        return;
    }

    if (!check_valid_inputs()) return;

    // Store each input value in the object
    dataPackage['first_name'] = textBoxFname;
    dataPackage['last_name'] = textBoxLname;
    dataPackage['dob'] = textBoxDob;
    dataPackage['phone'] = textBoxPhone;
    
    // Post/send the object as a json object to 'localhost:3000/sendData' server
    fetch('http://localhost:3000/sendData', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(dataPackage)
    });

    loadHTMLTable();
});

// Send request to server to update a record by it's ID
updateBtn.addEventListener("click", () => {
    if (are_inputs_empty()) {
        alert("Select a row\nEdit the data in the boxes\nDo not edit the ID unless it is preferred");
        return;
    }

    if (!check_valid_inputs()) return;

    let updatePackage = {};
    let textBoxId = studentIdEl.value;
    let textBoxFname = firstNameEl.value;
    let textBoxLname = firstNameEl.value
    let textBoxDob = dobEl.value;
    let textBoxPhone = phoneNumEl.value;

    // Add all input values in the object
    updatePackage['student_id'] = textBoxId;
    updatePackage['first_name'] = textBoxFname;
    updatePackage['last_name'] = textBoxLname;
    updatePackage['dob'] = textBoxDob;
    updatePackage['phone'] = textBoxPhone;
    
    // Send the data to the below server url as a json object
    fetch('http://localhost:3000/updateRecord', {
        headers: { 'Content-type':'application/json' },
        method: 'PUT',
        body: JSON.stringify(updatePackage)
    });

    loadHTMLTable();
});

// Send request to server to delete the record by it's ID
deleteBtn.addEventListener("click", () => {
    let textBoxId = studentIdEl.value;

    if (textBoxId === "" || textBoxId === " ") {
        alert("Please enter an ID or select a row");
        return;
    }
    if (isNaN(textBoxId)) {
        alert("ID must be a number");
        return;
    }

    fetch('http://localhost:3000/deleteRecord', {
        headers: { 'Content-type': 'application/json' },
        method: 'DELETE',
        body: JSON.stringify({ 'student_id':textBoxId })
    });

    loadHTMLTable();
});

searchBtn.addEventListener("click", () => {
    /* When search button is clicked
    - If all input boxes are empty => display a warning to enter data
    - If input box text matches any data in the table, highlight the table rows
    - If none of the data matches, display a notice that No Data was Found
    */
    // Values in text boxes
    let textBoxId = studentIdEl.value;
    let textBoxFname = firstNameEl.value;
    let textBoxLname = firstNameEl.value
    let textBoxDob = dobEl.value;
    let textBoxPhone = phoneNumEl.value;

    // If all boxes are empty, display the alert message and don't run any further codes
    if (are_inputs_empty()) {
        alert("Please fill in at least one box!");
        return;
    }

    if (!check_valid_inputs()) return;

    // Checking row-by-row if the input data matches the row data - highlights the row if it matches
    let rowsLength = rows.length;
    let is_data_found = false;
    for (i=1; i < rowsLength; i++) {
        let currentRow = table.rows[i]; // Content in current row (tr)
        currentRow.style.backgroundColor = null; // Remove the previous highlighted row

        // Store each HTML data from the column of the clicked row into variables
        let idCell = currentRow.getElementsByTagName("td")[0];
        let fnameCell = currentRow.getElementsByTagName("td")[1];
        let lnameCell = currentRow.getElementsByTagName("td")[2];
        let dobCell = currentRow.getElementsByTagName("td")[3];
        let phoneCell = currentRow.getElementsByTagName("td")[4];

        // Store the text of the table row in variables
        let rowId = idCell.innerHTML;
        let rowFname = fnameCell.innerHTML;
        let rowLname = lnameCell.innerHTML;
        let rowDob = dobCell.innerHTML;
        let rowPhone = phoneCell.innerHTML;
        
        // If any of the columns of the current row matches, change the background color of the current row
        // Claim the data is found as true if they match
        if (textBoxId === rowId) {
            currentRow.style.backgroundColor='orange';
            is_data_found = true;
        } else if (textBoxFname === rowFname) {
            currentRow.style.backgroundColor='orange';
            is_data_found = true;
        } else if (textBoxLname === rowLname) {
            currentRow.style.backgroundColor='orange';
            is_data_found = true;
        } else if (textBoxDob === rowDob) {
            currentRow.style.backgroundColor='orange';
            is_data_found = true;
        } else if (textBoxPhone === rowPhone) {
            currentRow.style.backgroundColor='orange';
            is_data_found = true;
        }

        // When the last row is reached and no data has matched so far - claim that 'no data was found'
        if (i === (rowsLength-1) && !is_data_found) {
            alert("Data not found");
        }
    }
});

// Send request to server to delete all data from the database table
resetBtn.addEventListener("click", () => {
    fetch('http://localhost:3000/resetData', {
        headers: { 'Content-type': 'application/json'},
        method: 'DELETE'
    });

    loadHTMLTable();
});

// Returns true if all the boxes are empty
are_inputs_empty = () => {
    let id = studentIdEl.value;
    let fname = firstNameEl.value;
    let lname = firstNameEl.value;
    let dob = dobEl.value;
    let phone = phoneNumEl.value;

    let emptyBox = ["", " "];

    return (emptyBox.includes(id) && emptyBox.includes(fname) && emptyBox.includes(lname) && 
    emptyBox.includes(dob) && emptyBox.includes(phone));
}

// Checks if the input boxes have valid inputs - alerts warning for each incorrect input
check_valid_inputs = () => {
    // If any of the data are invalid - return false
    let emptyBox = ["", " "];

    // If id not empty but is not a number - alert the user
    let id = studentIdEl.value;
    if (!emptyBox.includes(id)) {
        if (isNaN(id)) {
            alert("Student id must be a number");
            return false;
        }
    }

    let fname = firstNameEl.value;
    let lname = firstNameEl.value;
    if (fname.length > 20 || lname.length > 20) {
        alert ("First and Last names should be less 20 letters");
        return false;
    }
    
    let dob = dobEl.value;
    if (!emptyBox.includes(dob)) {
        let dobTimes = dob.split("-");
        if (dobTimes.length !== 3) {
            alert("Date Format: DD-MM-YYYY");
            return false;
        } else {
            let year = dobTimes[2];
            let month = dobTimes[1];
            let day = dobTimes[0];

            // Year(YYYY) cannot be empty
            if (!emptyBox.includes(year)) {
                // Must be a number
                if (!isNaN(year)) {
                    // Length of 4
                    if (year.length !== 4) {
                        alert("Invalid Date Year");
                        return false;
                    }
                } else {
                    alert("Year must be a number");
                    return false;
                }
            } else {
                alert("Empty Date Year");
                return false;
            }

            let numMonth;
            // Month(MM) cannot be empty
            if (!emptyBox.includes(month)) {
                // Must be a number
                if (!isNaN(month)) {
                    // Between 1 and 12
                    numMonth = parseInt(month);
                    if (!(numMonth >= 1 && numMonth <= 12)) {
                        alert("Invalid Date Month");
                        return false;
                    }
                } else {
                    alert("Month must be a number");
                    return false;
                }
            } else {
                alert("Empty Date Month");
                return false;
            }

            let numYear = parseInt(year);
            // Day(DD) cannot be empty
            if (!emptyBox.includes(day)) {
                // Must be a number
                if (!isNaN(day)) {
                    let numDay = parseInt(day);
                    
                    if (numDay >= 1) {
                        let months31 = [1, 3, 5, 7, 8, 10, 12];
                        let months30 = [4, 6, 9, 11];

                        if (months31.includes(numMonth)) {
                            // numDay limit is 31 for Jan, Mar, ...
                            if (!(numDay <= 31)) {
                                alert("Invalid Date Day: Month only has 31 days");
                                return false;
                            }
                        } else if (months30.includes(numMonth)) {
                            // numDay limit is 30 for Apr, June, ...
                            if (!(numDay <= 30)) {
                                alert("Invalid Date Day: Month only has 30 days");
                                return false;
                            }
                        } else if (numMonth === 2) {
                            // Feb has 28 days generally but has 29 days on leap year
                            let leapYear = numYear%4;
                            if (leapYear !== 0) {
                                // On non-leap year, days=28
                                if (!(numDay <= 28)) {
                                    alert("Invalid Date Day: Month only has 28 days");
                                    return false;
                                }
                            } else {
                                // On leap year, days=29
                                if (!(numDay <= 29)) {
                                    alert("Invalid Date Day: Month only has 29 days");
                                    return false;
                                }
                            }
                        }
                    } else {
                        alert("Invalid Date Day");
                        return false;
                    }
                } else {
                    alert("Day must be a number");
                    return false;
                }
            } else {
                alert("Empty Date Day");
                return false;
            }
        }
    }
    
    let phone = phoneNumEl.value;
    if (!emptyBox.includes(phone)) {
        if (isNaN(id) || phone.length !== 10) {
            alert ("Phone Number must be a number with 10 digits");
            return false;
        }
    }

    return true;
}