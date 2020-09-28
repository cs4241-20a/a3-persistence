// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

var modifyFlag = false;
var saveID = null;
var username = null;

function generateBody(action, id) {
    const usernameInput = document.getElementById('username');
    let name = document.getElementById('name');
    let device = document.getElementById('device')
    let priceRating = document.getElementById('price');
    let batteryRating = document.getElementById('battery');
    let performanceRating = document.getElementById('performance');
    let feelRating = document.getElementById('device-feel');

    if (action == 1) {
        const jsonObject = {
            username: usernameInput.value,
            name: name.value,
            deviceName: device.value,
            priceRating: priceRating.value,
            batteryRating: batteryRating.value,
            performanceRating: performanceRating.value,
            feelRating: feelRating.value
        }, body = JSON.stringify(jsonObject)

        return body;
    
    } else {
        const jsonObject = {
            entryID: id,
            username: usernameInput.value,
            name: name.value,
            deviceName: device.value,
            priceRating: priceRating.value,
            batteryRating: batteryRating.value,
            performanceRating: performanceRating.value,
            feelRating: feelRating.value
        }, body = JSON.stringify(jsonObject)

        return body;
    }
}


function performFetch(name, body) {
    let table = document.getElementById('table');
    table.style.visibility = "visible";
    // fetching data from the input entries
    // POST used to send to server
    fetch(name, {
        // adding method type POST
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body // adding body of the input to send to server (is in JSON)
    })
        // response is from the server
        .then(function (response) { // once this async promise task completes then run this particular function
            // do something with the reponse 
            console.log(response)
            updateTable()
        })

    resetForm();
}


const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()
    
    body = generateBody(1, -1)

    performFetch('/submit', body)

    resetFlags();

    return false;
}

const save = function (e) {
    // prevent default form action from being carried out
    e.preventDefault()

    if (modifyFlag === false) {
        window.alert("Not Modifying Any Entries Right Now!");
        return false;
    }

    body = generateBody(2, saveID)

    resetFlags();

    performFetch('/save', body)

    return false;
}

const signOut = function(e) {

    e.preventDefault()

    window.location.href="/";

    resetFlags();
    
    return false;
}

function updateTable() {
    fetch('/reviews') // using fetch to GET the reviews array in server
        .then(response => response.json())
        .then(data => {
            console.log("Got Data from Server");
            console.log(data);

            createTable(data)

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function createTable(data) {
    let table = document.getElementById('table');
    let numOfRows = table.rows.length;

    // clearing all the rows before re-inserting
    for (let i = numOfRows - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    for (let i = 0; i < data.length; i++) {
        let row = table.insertRow(1);
        let usernameCol = row.insertCell(0);
        let nameCol = row.insertCell(1);
        let devicenameCol = row.insertCell(2);
        let priceCol = row.insertCell(3);
        let batteryCol = row.insertCell(4);
        let performanceCol = row.insertCell(5);
        let feelCol = row.insertCell(6);
        let overallCol = row.insertCell(7);
        let modifyCol = row.insertCell(8);
        let deleteCol = row.insertCell(9);

        let id = data[i]._id
        usernameCol.innerHTML = data[i].username;
        nameCol.innerHTML = data[i].name;
        devicenameCol.innerHTML = data[i].deviceName;
        priceCol.innerHTML = data[i].priceRating;
        batteryCol.innerHTML = data[i].batteryRating;
        performanceCol.innerHTML = data[i].performanceRating;
        feelCol.innerHTML = data[i].feelRating;
        overallCol.innerHTML = data[i].overallRating;

        let modifyID = "modify_" + i;
        let deleteID = "delete_" + i;
        modifyCol.innerHTML = '<button id="' + modifyID + '" onclick="modifyEntry(\'' + id + '\', \'' + i + '\');">modify</button>';
        deleteCol.innerHTML = '<button id="' + deleteID + '" onclick="deleteEntry(\'' + id + '\');">delete</button>';
    }
}

function modifyEntry(id, index) {
    let name = document.getElementById('name');
    let device = document.getElementById('device')
    let priceRating = document.getElementById('price');
    let batteryRating = document.getElementById('battery');
    let performanceRating = document.getElementById('performance');
    let feelRating = document.getElementById('device-feel');

    const jsonObject = {
        entryID: id
    }, body = JSON.stringify(jsonObject)


    fetch('/modify', {
        // adding method type POST
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body // adding body of the input to send to server (is in JSON)
    })
    .then(function(response) {
        if (response.status === 404) {
            window.alert("ERROR: Entry Not Found in DB! Refresh Page");
        
        } else {
            return response.json();
        }
    })
    .then(data => {
        name.value = data.name;
        device.value = data.deviceName;
        priceRating.value = getDropdownValue(data.priceRating);
        batteryRating.value = getDropdownValue(data.batteryRating);
        performanceRating.value = getDropdownValue(data.performanceRating);
        feelRating.value = getDropdownValue(data.feelRating);
    })

    modifyFlag = true;
    saveID = id;
}

function getDropdownValue(rating) {
    let value = "";
    if (rating === 1) {
        value = rating + " Star";
    
    } else {
        value = rating + " Stars";
    }

    return value
}

function deleteEntry(id) {
    const jsonObject = {
        entryID: id
    }, body = JSON.stringify(jsonObject)


    fetch('/deletion', {
        // adding method type POST
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body // adding body of the input to send to server (is in JSON)
    })
    .then(function(response) {
        if (response.status === 404) {
            window.alert("ERROR: Deletion Failed");
        
        } else {
            updateTable();
        }
    })

    resetFlags();
}

function resetForm() {
    const usernameInput = document.getElementById('username');
    let userName = usernameInput.value;
    //document.getElementById("formID").reset();
    document.getElementById("name").value = "";
    document.getElementById("device").value = "Apple iPhone 11 Pro Max";
    document.getElementById("price").value = "1 Star";
    document.getElementById("battery").value = "1 Star";
    document.getElementById("performance").value = "1 Star";
    document.getElementById("device-feel").value = "1 Star";
    usernameInput.value = userName;

}

function resetFlags() {
    modifyFlag = false;
    saveID = null;
}


window.onload = function () {
    const submitButton = document.getElementById('submit')
    submitButton.onclick = submit;

    const saveButton = document.getElementById('save')
    saveButton.onclick = save;

    const signOutButton = document.getElementById('signOut');
    signOutButton.onclick = signOut;

    const usernameInput = document.getElementById('username');

    fetch('/getUser') 
    .then(response => response.json())
    .then(data => {
        usernameInput.value = data.username;
    });

    fetch('/reviews')
    .then(response => response.json())
    .then(data => {
        if (data.length != 0) {
            //window.alert(data[0]._id)
            let table = document.getElementById('table');
            table.style.visibility = "visible";
                
        }

        createTable(data)

    }).catch((error) => {
        console.error('Error:', error);
    });

    resetForm();
}