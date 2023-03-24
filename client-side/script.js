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
const tableRows = table.getElementsByTagName("tr");

const hasNumbersOnly = (value) => /^[0-9]*$/.test(value);
const hasLettersOnly = (value) => /[a-z]/gi.test(value);
const isEmpty = (value) => /^$/g.test(value); // Was added to prevent search button event from alerting "Name must contain letters only" since the regex doesn't match with empty strings
const removeSpaces = (value) => value.replaceAll(" ", "");

const domain = window.location.origin;
const inputBoxes = [studentIdEl, firstNameEl, lastNameEl, dobEl, phoneNumEl];

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
    if (!isEmpty(firstName) && !hasLettersOnly(firstName)) {
        alert("Please enter letters for your first name");
        return false;
    }
    return true;
}
const isLastNameValid = () => {
    const lastName = removeSpaces(lastNameEl.value);
    if (!isEmpty(lastName) && !hasLettersOnly(lastName)) {
        alert("Please enter letters for your last name");
        return false;
    }
    return true;
}
const isDobValid = () => {
    const dob = dobEl.value;
    const userAge = (Date.now() - Date.parse(dob)) / 31104000000;
    if (userAge < 5) {
        alert("Please enter your correct age");
        return false;
    }
    return true;
}
const isPhoneNumValid = () => {
    const phoneNum = removeSpaces(phoneNumEl.value);
    if (!hasNumbersOnly(phoneNum) && phoneNum.length !== 10) {
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

// Page Interactions
const renderTable = async() => {
    const response = await fetch(`${domain}/records`);
    const tableData = await response.json();
    
    table.innerHTML = "\
        <tr>\
            <th>ID</th>\
            <th>First Name</th>\
            <th>Last Name</th>\
            <th>Date of Birth</th>\
            <th>Phone Number</th>\
        </tr>";

    // When database has no data
    if (tableData.length === 0) {
        table.innerHTML += "<tr><td colspan='5'>NO DATA AVAILABLE</td></tr>";
        return;
    }
    
    // Render table to show database data
    table.innerHTML += tableData.map(student => {
        return `
            <tr>
                <td>${student.student_id}</td>
                <td>${student.first_name}</td>
                <td>${student.last_name}</td>
                <td>${student.DOB}</td>
                <td>${student.phone}</td>
            </tr>`;
    }).join();
}
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
const clearInputBoxes = () => {
    document.querySelectorAll('input').forEach(item => {
        item.value = "";
    });
}
const setTableRowBGColorToDefault = () => {
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].style.backgroundColor = null;
    }
}
const setInputBoxTextToSelectedRowData = (e) => {
    const selectedRow = e.target.parentElement;
    
    try {
        selectedRow.querySelectorAll('td').forEach((item, index) => {
            inputBoxes[index].value = item.innerHTML;
        });
    } catch (e) {
        if (e.message === "inputBoxes[index] is undefined") {
            alert("Please only select rows present on the table");
        }
    }
}
const sendNewRecordToServer = async() => {
    const inputBoxesData = inputBoxes.map(item => item.value);

    for (let i = 1; i < inputBoxesData.length; i++) {
        const inputBoxData = removeSpaces(inputBoxesData[i]);
        if (inputBoxData === "") {
            alert("Please fill in all the inputs");
            return;
        }
    }

    if (!isDataValid(inputBoxesData.length)) return;

    let newDataPackage = {};
    newDataPackage['first_name'] = inputBoxesData[1];
    newDataPackage['last_name'] = inputBoxesData[2];
    newDataPackage['dob'] = inputBoxesData[3];
    newDataPackage['phone'] = inputBoxesData[4];
    
    const response = await fetch(`${domain}/newRecord`, {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(newDataPackage)
    });

    if (!response.ok) {
        alert("Failed to send request to server");
        return;
    }

    renderTable();
}
const sendUpdatedDataToServer = async() => {
    const inputBoxesData = inputBoxes.map(item => item.value);
    for (let i = 0; i < inputBoxesData.length; i++) {
        const inputBoxData = removeSpaces(inputBoxesData[i]);
        if (inputBoxData === "") {
            alert("Please be sure that all inputs are filled");
            return;
        }
    }

    if (!isDataValid(inputBoxesData.length)) return;

    let updateDataPackage = {};
    updateDataPackage['student_id'] = inputBoxesData[0];
    updateDataPackage['first_name'] = inputBoxesData[1];
    updateDataPackage['last_name'] = inputBoxesData[2];
    updateDataPackage['dob'] = inputBoxesData[3];
    updateDataPackage['phone'] = inputBoxesData[4];
    
    const response = await fetch(`${domain}/updatedRecord`, {
        headers: { 'Content-type':'application/json' },
        method: 'PUT',
        body: JSON.stringify(updateDataPackage)
    });

    if (!response.ok) {
        alert("Failed to send request to server");
        return;
    }

    renderTable();
}
const sendDeleteStudentRequestToServer = async() => {
    const student_id = removeSpaces(studentIdEl.value);

    if (student_id === "") {
        alert("Please enter an ID of the student or select a row");
        return;
    }
    if (!isDataValid(1)) return;

    const response = await fetch(`${domain}/deleteRecord`, {
        headers: { 'Content-type': 'application/json' },
        method: 'DELETE',
        body: JSON.stringify({ student_id })
    });

    if (!response.ok) {
        alert("Failed to send request to server");
        return;
    }

    renderTable();
}
const findDataInTable = () => {
    const inputBoxesData = inputBoxes.map(item => item.value.toLowerCase());
    let areAllInputsEmpty = true;

    for (let i = 0; i < inputBoxesData.length; i++) {
        const inputBoxData = removeSpaces(inputBoxesData[i]);
        if (inputBoxData !== "") {
            areAllInputsEmpty = false;
            break;
        }
    }

    if (areAllInputsEmpty) {
        alert("Please fill in at least one field");
        return;
    }
    if (!isDataValid(inputBoxesData.length)) return;

    const rowsLength = tableRows.length;
    let isDataFound = false;
    for (let i = 1; i < rowsLength; i++) {
        const selectedRow = table.rows[i];
        selectedRow.style.backgroundColor = null; // Remove the previous highlighted row

        selectedRow.querySelectorAll('td').forEach((item, index) => {
            if (inputBoxesData[index] == item.innerHTML.toLowerCase()) {
                selectedRow.style.backgroundColor = 'orange';
                isDataFound = true;
            }
        });
    }

    if (!isDataFound) {
        alert("Data Not Found");
    }
}
const sendDeleteAllRecordsRequestToServer = async() => {
    if (!confirm("Are you sure you want to delete ALL records")) return;
    
    const response = await fetch(`${domain}/deleteAllRecords`, {
        headers: { 'Content-type': 'application/json'},
        method: 'DELETE',
        body: JSON.stringify({confirmation: 'Yes, Reset'})
    });

    if (!response.ok) {
        alert("Failed to send request to server");
        return;
    }

    renderTable();
}

// Event Listeners
document.getElementById('navbar-toggle-btn').addEventListener('click', toggleSideBar);
clearBtn.addEventListener("click", clearInputBoxes);
document.body.addEventListener("dblclick", setTableRowBGColorToDefault);
table.addEventListener("dblclick", setInputBoxTextToSelectedRowData);
addBtn.addEventListener("click", sendNewRecordToServer);
updateBtn.addEventListener("click", sendUpdatedDataToServer);
deleteBtn.addEventListener("click", sendDeleteStudentRequestToServer);
searchBtn.addEventListener("click", findDataInTable);
resetBtn.addEventListener("click", sendDeleteAllRecordsRequestToServer);

renderTable();