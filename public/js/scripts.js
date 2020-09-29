window.onload = function () {
    const button = document.querySelector('#submitButton')
    button.onclick = submit;

    const logoutBtn = document.querySelector('#logoutButton')
    logoutBtn.onclick = logout;

    const sheet = document.querySelector('#timesheet')
    fetch('/appdata', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(array => {
            array.forEach(element => updatetimesheet(sheet, element))
        })
}

const submit = function (e) {
    e.preventDefault()

    const nameinput = document.querySelector('#studentName'),
        idinput = document.querySelector('#studentID'),
        gradeinput = document.querySelector('#studentClass'),
        timeinput = document.querySelector('#timeWorked'),
        sheet = document.querySelector('#timesheet'),
        json = { studentName: nameinput.value, studentID: idinput.value, studentClass: gradeinput.value, timeWorked: timeinput.value, payment: ((timeinput.value * 12.75) * 0.9) }

    if (nameinput.value == "" || idinput.value == "") {
        console.log("Fields are not filled out");
        return;
    }
    if (gradeinput.value > 4 || gradeinput < 1) {
        window.alert("Put in the correct field");
        return 0;
    }
    console.log(json)
    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
        .then(response => response.json())
        .then(json => {
            updatetimesheet(sheet, json)
        })

    nameinput.value = "";
    idinput.value = "";
    gradeinput.value = "";
    timeinput.value = "";

    return false
}

const sheetEdit = function (sheet, row, id) {
    const nameinput = document.querySelector('#studentName');
    const idinput = document.querySelector('#studentID');
    const gradeinput = document.querySelector('#studentClass');
    const timeinput = document.querySelector('#timeWorked');
    const button = document.querySelector('#submitButton');

    nameinput.value = row.cells[0].innerHTML;
    idinput.value = row.cells[1].innerHTML;
    gradeinput.value = row.cells[2].innerHTML;
    timeinput.value = row.cells[3].innerHTML;

    button.onclick = function () { edit(nameinput, idinput, gradeinput, timeinput, sheet, id, button) }

    return false;
}

const logout = function (e) {
    e.preventDefault()

    fetch('/logout', {
        method: 'GET'
    })
        .then(() => {
            window.location.href = "/"
        })

    return false;
}


const edit = function(nameinput, idinput, gradeinput, timeinput, sheet, id, button){
    button.onclick = submit

    if (nameinput.value === "" || idinput.value === "") {
        window.alert("Fields are not filled out");
        return 0;
    }

    if (gradeinput.value > 4 || gradeinput < 1) {
        window.alert("Put in the correct field");
        return 0;
    }

    const json = { _id: id, studentName: nameinput.value, studentID: idinput.value, studentClass: gradeinput.value, timeWorked: timeinput.value, payment: ((timeinput.value * 12.75) * 0.9) };

    fetch('/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
        .then(response => response.json())
        .then(array => {
            var numRows = sheet.rows.length;
            for (var i = 1; i < numRows; i++) {
                sheet.deleteRows(1);
            }

            console.log(array);

            array.forEach(element => updatetimesheet(sheet, element))
        })

    return false;
}

const del = function (sheet, id) {
    json = { _id: id }
    console.log(json)

    fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(json)
    })
        .then(response => {
            console.log(response)
            return response.json()
        })
        .then(array => {
            var numRows = sheet.rows.length
            for (var i = 1; i < numRows; i++) {
                sheet.deleteRow(1);
            }

            array.forEach(element => updatetimesheet(sheet, element))
        })

    const button = document.querySelector('#submitButton');
    button.onclick = submit

    return false;
}

const updatetimesheet = function (sheet, data) {
    var tbody = sheet.getElementByTagName('tbody')[0]
    var row = tbody.insertRow(-1);
    var name = row.insertCell(0);
    var id = row.insertCell(1);
    var grade = row.insertCell(2);
    var time = row.insertCell(3);
    var money = row.insertCell(4);
    var btnCell = row.insertCell(5);

    name.innerHTML = data.studentName;
    id.innerHTML = data.studentID;
    grade.innerHTML = data.studentClass;
    time.innerHTML = data.timeWorked;
    money.innerHTML = data.payment;

    var editBtn = document.createElement('button');
    editBtn.id = "editButton";
    editBtn.className += "mui-btn mui-btn--raised mui-btn--primary";
    editBtn.onclick = function () { sheetEdit(sheet, row, data._id) }
    btnCell.appendChild(editBtn);

    var delBtn = document.createElement('button');
    delBtn.id = "deleteButton";
    delBtn.className += "mui-btn mui-btn--raised mui-btn--danger";
    delBtn.onclick = function () { del(sheet, data._id) }
    btnCell.appendChild(delBtn);
}