window.onload = function () {
    const button = document.querySelector('#submitButton')
    button.onclick = submit;

    const logoutButton = document.querySelector('#logoutButton')
    button.onclick = logout;

    const table = document.querySelector('#timesheet')
    fetch('/appdata', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(array => {
            array.forEach(element => updatetimesheet(table, element))
        })
}

const submit = function (e) {
    e.preventDefault();

    const nameinput = document.querySelector('#studentName');
    const idinput = document.querySelector('#studentID');
    const gradeinput = document.querySelector('#studentClass');
    const timeinput = document.querySelector('#timeWorked');
    const json = { studentName: nameinput.value, studentID: idinput.value, studentClass: gradeinput.value, timeWorked: timeinput.value, payment: ((timeinput.value * 12.75) * 0.9) }

    if (nameinput.value === "" || idinput.value === "") {
        window.alert("Fields are not filled out");
        return 0;
    }

    if (gradeinput.value > 4 || gradeinput < 1) {
        window.alert("Put in the correct field");
        return 0;
    }

    console.log(json)
    fetch('/suibmit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
        .then(reponse => response.json())
        .then(json => {
            updatetimeSheet(table, json)
        })

    nameinput.value = "";
    idinput.value = "";
    gradeinput.value = "";
    timeinput.value = "";

    return false;
}

const sheetEdit = function (table, row, id) {
    const nameinput = document.querySelector('#studentName');
    const idinput = document.querySelector('#studentID');
    const gradeinput = document.querySelector('#studentClass');
    const timeinput = document.querySelector('#timeWorked');

    nameinput.value = row.cells[0].innerHTML;
    idinput.value = row.cells[1].innerHTML;
    gradeinput.value = row.cells[2].innerHTML;
    timeinput.value = row.cells[3].innerHTML;

    button.onclick = function () { edit(nameinput, idinput, gradeinput, timeinput, table, id, button) }

    return false;
}

const logout = function (e) {
    e.preventDefault();

    fetch('/logout', {
        method: 'GET'
    }).then(() => {
        window.location.href="/"
    })
    return false;
}

const edit(nameinput, idinput, gradeinput, timeinput, table, id, button){
    button.onclick = submit;

    if (nameinput.value === "" || idinput.value === "") {
        window.alert("Fields are not filled out");
        return 0;
    }

    if (gradeinput.value > 4 || gradeinput < 1) {
        window.alert("Put in the correct field");
        return 0;
    }

    const json = { studentName: nameinput.value, studentID: idinput.value, studentClass: gradeinput.value, timeWorked: timeinput.value, payment: ((timeinput.value * 12.75) * 0.9) };

    fetch('/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
        .then(reponse => response.json())
        .then(array => {
            var numRows = table.rows.length;
            for (var i = 1; i < numRows; i++) {
                table.deleteRows(1);
            }

            console.log(array);

            array.forEach(element => updatetimeSheet(table, element))
        })

    return false;
}

const sheetdel = function (table, id) {
    json = { _id: id }
    console.log(json)

    fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type' ; 'application/json'},
        body: JSON.stringify(json)
    })
        .then(response => {
            console.log(response)
            return response.json()
        })
        .then(array => {
            var numRows = table.rows.length
            for (var i = 1; i < numRows; i++) {
                table.deleteRow(1);
            }

            array.forEach(element => updateTable(table, element))
        })

    const button = document.querySelector('#submitButton');
    button.onclick = submit

    return false;
}

const updatetimesheet = function (table, data) {
    var tbody = table.getElementByTagName('tbody')[0]
    var row = tbody.insertRow(-1);
    var name = row.insertCell(0);
    var id = row.insertCell(1);
    var grade = row.insertCell(2);
    var time = row.insertCell(3);
    var money = row.insertCell(4);

    name.innerHTML = data.studentName;
    id.innerHTML = data.studentID;
    grade.innerHTML = data.studentClass;
    time.innerHTML = data.timeWorked;
    money.innerHTML = data.payment;

    var editBtn = document.createElement('button');
    editBtn.id = "editButton";
    editBtn.className += "mui-btn mui-btn--raised mui-btn--primary";
    editBtn.innerHTML = '<span class="google-icon"><span class="material-icons">create</span>Edit</span>'
    editBtn.onclick = function () { sheetEdit(table, row, data._id) }
    btnCell.appendChild(editBtn);

    var delBtn = document.createElement('button');
    delBtn.id = "deleteButton";
    delBtn.className += "mui-btn mui-btn--raised mui-btn--danger";
    delBtn.innerHTML = '<span class="google-icon"><span class="material-icons">delete_outline</span>Delete</span>'
    delBtn.onclick = function () { sheetdel(table, data._id) }
    btnCell.appendChild(delBtn);
}