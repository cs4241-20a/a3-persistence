// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

let appData;
let editData;

const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault();

    const name = document.querySelector('#input-name');
    const data = { 
        yourname: name.value 
    };

    fetch('/submit', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function logResponse (response) {
        // do something with the reponse 
        console.log(response);
    })

    return false;
}

const addRun = function (e) {
    e.preventDefault();

    const name = document.querySelector('#input-name').value;
    const location = document.querySelector('#input-location').value;
    const distance = document.querySelector('#input-distance').value;
    const time = document.querySelector('#input-time').value;

    const body = {
        name: name,
        location: location,
        distance: distance,
        time: time,
    };

    fetch('/addRun', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function handleAddRunResponse(response) {
        if (response.status === 200) {  // OK
            console.log(`Successfully added run ${JSON.stringify(body)}`);
            loadData();  // Refresh the tables
            clearForm();  // Empty the text fields
        } else {
            console.error(`Failed to add run ${JSON.stringify(body)};
            Error: ${response.message}`);
            debugger;
        }
    });
}

const deleteRun = function (id, deleteIndex) {
    fetch ('/deleteRun', {
        method: 'POST',
        body: JSON.stringify({id: id}),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function handleDeleteRunResponse(response) {
        if (response.status === 200) {  // OK
            console.log(`Successfully deleted run ${deleteIndex}.`);
            loadData();
        } else {
            console.error(`Failed to delete run ${deleteIndex}.
            Error: ${response.message}`);
        }
    })
}

const editRuns = function () {
    runsToSend = retrieveRuns();

    fetch('/editRuns', {
        method: 'POST',
        body: JSON.stringify(runsToSend)
    }).then(function handleEditRunsResponse(response) {
        if (response.status === 200) {  // OK
            console.log(`Successfully edited runs to ${JSON.stringify(runsToSend)}`);
            loadData();  // Refresh the tables
        } else {
            console.error(`Failed to edit runs to ${JSON.stringify(runsToSend)}
            Error: ${response.message}`);
        }
    });
}

const retrieveRuns = function () {
    const edit_table = document.querySelector('#edit-runs-table');
    let runsArray = [];
    // Iterate one fewer times than the number of rows (header)
    for(let i = 0; i < edit_table.rows.length - 1; i++) {
        let rowRun = {
            name: document.querySelector(`#input-name-edit-${i}`).value,
            location: document.querySelector(`#input-location-edit-${i}`).value,
            distance: document.querySelector(`#input-distance-edit-${i}`).value,
            time: document.querySelector(`#input-time-edit-${i}`).value,
        };
        runsArray.push(rowRun);
    }
    return runsArray;
}

const clearForm = function () {
    document.querySelector('#input-name').value = '';
    document.querySelector('#input-location').value = '';
    document.querySelector('#input-distance').value = '';
    document.querySelector('#input-time').value = '';
}

const clearTable = function (table) {
    let numRows = table.rows.length;
    for(let i = 1; i < numRows; i++) {
        // Repeatedly delete the row under the header
        table.deleteRow(1);
    }
}

const fillTable = function (table, data) {
    clearTable(table);
    let totalDistance = 0;
    for(let i = 0; i < data.length; i++) {
        let row = table.insertRow();
        row.insertCell().innerHTML = data[i].name;
        row.insertCell().innerHTML = data[i].location;
        row.insertCell().innerHTML = data[i].distance;
        row.insertCell().innerHTML = data[i].time;
        row.insertCell().innerHTML = data[i].distance * 60 / data[i].time;
        row.insertCell().innerHTML = `<button
        class="delete-button" 
        type="button" 
        onclick="deleteRun('${data[i]._id}', ${i})">
            X
        </button>`
        row.insertCell().innerHTML = `<button
        class="delete-button"
        type="button"
        onclick="prepareEdit(${i + 1}, '${data[i]._id}')">
            Edit
        </button>`;

        // Check for valid data before adding
        if (data[i].distance && parseInt(data[i].distance)){
            // Not sure why it's a string sometimes
            totalDistance += parseInt(data[i].distance);
        }
    }
    document.querySelector('#total-distance').innerHTML = totalDistance;
    document.querySelector('#num-marathons').innerHTML = totalDistance / 26.2;
}

const loadData = function () {
    fetch('/getRuns', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(function( parsedData ){
        appData = parsedData;  // Is this necessary?
        const table = document.querySelector('#runs-table');
        fillTable(table, parsedData);
    
        const edit_table = document.querySelector('#edit-runs-table');
        fillEditTable(edit_table, parsedData);
    });
}

const prepareEdit = function(index, id) {
    const table = document.querySelector('#runs-table');
    revertEdit();

    let tempData = {};
    tempData.index = index;
    tempData.id = id;
    tempData.name = table.rows[index].cells[0].innerText;
    tempData.location = table.rows[index].cells[1].innerText;
    tempData.distance = table.rows[index].cells[2].innerText;
    tempData.time = table.rows[index].cells[3].innerText;
    editData = tempData;

    table.rows[index].cells[0].innerHTML = `<input type="text" id="input-name-edit-${index}" value="${tempData.name}"/>`;
    table.rows[index].cells[1].innerHTML = `<input type="text" id="input-location-edit-${index}" value="${tempData.location}"/>`;
    table.rows[index].cells[2].innerHTML = `<input type="number" id="input-distance-edit-${index}" value="${tempData.distance}"/>`;
    table.rows[index].cells[3].innerHTML = `<input type="number" id="input-time-edit-${index}" value="${tempData.time}"/>`;
    table.rows[index].cells[5].innerHTML = `
    <button class="delete-button" type="button">
        Submit
    </button>`
    table.rows[index].cells[6].innerHTML = `
    <button class="delete-button" type="button" onclick="revertEdit()">
        Cancel
    </button>`;
}

const revertEdit = function() {
    if( !editData ){
        return;
    }
    const table = document.querySelector('#runs-table');
    let index = editData.index;
    let id = editData.id;
    table.rows[index].cells[0].innerHTML = editData.name;
    table.rows[index].cells[1].innerHTML = editData.location;
    table.rows[index].cells[2].innerHTML = editData.distance;
    table.rows[index].cells[3].innerHTML = editData.time;
    table.rows[index].cells[5].innerHTML = `
    <button class="delete-button" type="button" onclick="deleteRun('${id}', ${index - 1})">
        X
    </button>`;
    table.rows[index].cells[6].innerHTML = `
    <button class="delete-button" type="button" onclick="prepareEdit(${index}, '${id}')">
        Edit
    </button>`;
    editData = null;
}

const getInputString = function(field, index, value) {
    return `
    <input 
        type="text" 
        id="input-${field}-${index}" 
        value="${value}"
    />`;
}

window.onload = function () {
    document.querySelector('#form-submit').onclick = addRun;
    document.querySelector('#submit-edits').onclick = editRuns;
    loadData();
}


// ===========
const fillEditTable = function (table, data) {
    clearTable(table);
    for(let i = 0; i < data.length; i++) {
        let row = table.insertRow();
        row.insertCell().innerHTML = `<input type="text" id="input-name-edit-${i}" value="${data[i].name}"/>`;
        row.insertCell().innerHTML = `<input type="text" id="input-location-edit-${i}" value="${data[i].location}"/>`;
        row.insertCell().innerHTML = `<input type="number" id="input-distance-edit-${i}" value="${data[i].distance}"/>`;
        row.insertCell().innerHTML = `<input type="number" id="input-time-edit-${i}" value="${data[i].time}"/>`;
        row.insertCell().innerHTML = data[i].distance * 60 / data[i].time;
        row.insertCell().innerHTML = `<button class="delete-button" type="button" onclick="deleteRun('${data[i]._id}', ${i})">X</button>`;
    }
}