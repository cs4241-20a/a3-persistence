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
    const notes = document.querySelector('#input-notes').value;

    const body = {
        name: name,
        location: location,
        distance: distance,
        time: time,
        notes: notes,
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

const editRun = function (id, index) {
    const table = document.querySelector('#runs-table');

    let runToSend = {};
    runToSend.name = document.querySelector('#input-name-edit').value;
    runToSend.location = document.querySelector('#input-location-edit').value;
    runToSend.distance = document.querySelector('#input-distance-edit').value;
    runToSend.time = document.querySelector('#input-time-edit').value;
    runToSend.notes = appData[index].notes;

    fetch('/editRun', {
        method: 'POST',
        body: JSON.stringify({run: runToSend, id: id}),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function handleEditRunResponse(response) {
        if (response.status === 200) {  // OK
            console.log(`Successfully edited run ${index} to ${JSON.stringify(runToSend)}`);
            revertEdit();
            loadData();  // Refresh the tables
        } else {
            console.error(`Failed to edit run ${index} to ${JSON.stringify(runToSend)}
            Error: ${response.message}`);
        }
    });
}

const clearForm = function () {
    document.querySelector('#input-name').value = '';
    document.querySelector('#input-location').value = '';
    document.querySelector('#input-distance').value = '';
    document.querySelector('#input-time').value = '';
    document.querySelector('#input-notes').value = '';
}

const clearTable = function (table) {
    let numRows = table.rows.length;
    for(let i = 1; i < numRows; i++) {
        // Repeatedly delete the row under the header
        table.deleteRow(1);
    }
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
    });
}

const fillTable = function (table, data) {
    clearTable(table);
    let totalDistance = 0;
    for(let i = 0; i < data.length; i++) {
        let row = table.insertRow();
        row.insertCell().innerHTML = `
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu-${i}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Actions
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <button class="dropdown-item" type="button" onclick="deleteRun('${data[i]._id}', ${i})">Delete</button>
                <button class="dropdown-item" type="button" onclick="prepareEdit(${i + 1}, '${data[i]._id}')">Edit</button>
                <button class="dropdown-item" type="button" onclick="alert(appData[${i}].notes ? appData[${i}].notes : 'No notes exist for this run')">View Notes</button>
                <button class="dropdown-item" type="button" onclick="editNotes(${i})">Edit Notes</button>
            </div>
        </div>`;
        row.insertCell().innerHTML = data[i].name;
        row.insertCell().innerHTML = data[i].location;
        row.insertCell().innerHTML = data[i].distance;
        row.insertCell().innerHTML = data[i].time;
        row.insertCell().innerHTML = (data[i].distance * 60 / data[i].time).toFixed(2);

        // Check for valid data before adding
        if (data[i].distance && parseInt(data[i].distance)){
            // Not sure why it's a string sometimes
            totalDistance += parseInt(data[i].distance);
        }
    }
    document.querySelector('#total-distance').innerHTML = totalDistance;
    document.querySelector('#num-marathons').innerHTML = (totalDistance / 26.2).toFixed(2);
}

const prepareEdit = function(index, id) {
    const table = document.querySelector('#runs-table');
    revertEdit();

    let tempData = {};
    tempData.index = index;
    tempData.id = id;
    tempData.name = table.rows[index].cells[1].innerText;
    tempData.location = table.rows[index].cells[2].innerText;
    tempData.distance = table.rows[index].cells[3].innerText;
    tempData.time = table.rows[index].cells[4].innerText;
    editData = tempData;

    table.rows[index].cells[0].innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu-${index}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Actions
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item" type="button" onclick="editRun('${id}', ${index})">Submit</button>
            <button class="dropdown-item" type="button" onclick="revertEdit()">Cancel</button>
        </div>
    </div>`;
    table.rows[index].cells[1].innerHTML = `<input class="form-control" type="text" id="input-name-edit" value="${tempData.name}" placeholder="${tempData.name}"/>`;
    table.rows[index].cells[2].innerHTML = `<input class="form-control" type="text" id="input-location-edit" value="${tempData.location}" placeholder="${tempData.location}"/>`;
    table.rows[index].cells[3].innerHTML = `<input class="form-control" type="number" id="input-distance-edit" value="${tempData.distance}" placeholder="${tempData.distance}"/>`;
    table.rows[index].cells[4].innerHTML = `<input class="form-control" type="number" id="input-time-edit" value="${tempData.time}" placeholder="${tempData.time}"/>`;
}

const revertEdit = function() {
    if( !editData ){
        return;
    }
    const table = document.querySelector('#runs-table');
    let index = editData.index;
    let id = editData.id;
    table.rows[index].cells[0].innerHTML = `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu-${index}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Actions
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item" type="button" onclick="deleteRun('${id}', ${index})">Delete</button>
            <button class="dropdown-item" type="button" onclick="prepareEdit(${index}, '${id}')">Edit</button>
        </div>
    </div>`;
    table.rows[index].cells[1].innerHTML = editData.name;
    table.rows[index].cells[2].innerHTML = editData.location;
    table.rows[index].cells[3].innerHTML = editData.distance;
    table.rows[index].cells[4].innerHTML = editData.time;
    editData = null;
}

const editNotes = function(index) {
    let newNotes = prompt("Edit Run Notes", appData[index].notes ? appData[index].notes : "");
    if(newNotes) {
        let runToSend = {}
        runToSend.name = appData[index].name;
        runToSend.location = appData[index].location;
        runToSend.distance = appData[index].distance;
        runToSend.time = appData[index].time;
        runToSend.notes = newNotes;
        
        fetch('/editRun', {
            method: 'POST',
            body: JSON.stringify({run: runToSend, id: appData[index]._id}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function handleEditRunResponse(response) {
            if (response.status === 200) {  // OK
                console.log(`Successfully edited run ${index} to ${JSON.stringify(runToSend)}`);
                revertEdit();
                loadData();  // Refresh the tables
            } else {
                console.error(`Failed to edit run ${index} to ${JSON.stringify(runToSend)}
                Error: ${response.message}`);
            }
        });
    }
}

window.onload = function () {
    document.querySelector('#form-submit').onclick = addRun;
    loadData();
}
