function getItems(username) {
    fetch('/data', {
        method: "POST",
        body: JSON.stringify({username: username}),
        headers: {"Content-Type":"application/json"}
    })
        .then(response => response.json())
        .then(function(data) {
            for (let i = 0; i < data.length; i++) {
                addTableEntry(data[i]);
            }
        })
}

//Edit a field using a prompt
function editField(e) {
    let textNode = e.target.parentElement.firstChild;
    let entryID = e.target.parentElement.parentElement.id;
    let newValue = window.prompt("Please enter the new value.", textNode.data);

    if (newValue == null) {
        return 0;
    }

    let data = {id: entryID};
    data[e.target.parentElement.className] = newValue;
    fetch('/update', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"}
    })
        .then(function(response) {
            if (response.ok) {
                textNode.data = newValue;
            }
        })
}

//Delete an item from the database and list
function deleteItem(e) {
    let row = e.target.parentElement.parentElement;
    fetch('/delete', {
        method: "POST",
        body: JSON.stringify({id: row.id}),
        headers: {"Content-Type":"application/json"}
    })
        .then(function(response) {
            if (response.ok) {
                row.remove();
            }
        })
}

//Add one json object to the table as the last row
function addTableEntry(jsonData) {
    //Find the table
    const tableBody = document.getElementById("taskBody");
    //Insert a new row and then new cells
    let row = tableBody.insertRow(-1);
    row.id = jsonData["_id"];

    let cell0 = row.insertCell(0);
    cell0.className = "priority";
    cell0.innerHTML = jsonData.priority + "<button title=\"Edit\" class=\"edit\">Edit</button>";

    let cell1 = row.insertCell(1);
    cell1.className = "class";
    cell1.innerHTML = jsonData.class + "<button title=\"Edit\" class=\"edit\">Edit</button>";

    let cell2 = row.insertCell(2);
    cell2.className = "taskname";
    cell2.innerHTML = jsonData.taskname + "<button title=\"Edit\" class=\"edit\">Edit</button>";

    let cell3 = row.insertCell(3);
    cell3.className = "hours";
    cell3.innerHTML = jsonData.hours + "<button title=\"Edit\" class=\"edit\">Edit</button>";

    row.insertCell(4).innerHTML = "<button title=\"Delete\" class=\"delete\">Delete</button>";
}

//Submits form data to the server
function submitFormData(e) {
    e.preventDefault();
    let data = {};
    data["username"] = username;

    let fields = document.getElementsByClassName("entry");
    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];
        if (element.value === "") {
            window.alert("All fields must be filled to create a new task.");
            return 0;
        } else {
            data[element.id] = element.value;
        }
    }


    fetch('/submit', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"}
    })
        .then(response => response.json())
        .then(function(data) {
            addTableEntry(data);
        });
}

//Tries to log in the user
function login(e) {
    e.preventDefault();

    let data = {};
    data["username"] = document.getElementById("username").value;
    data["password"] = document.getElementById("password").value;

    fetch('/login', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"}
    })
        .then(async function(response) {
            if (response.status === 200) {
                let json = await response.json();
                username = json.username;
                document.getElementById("loginPage").hidden = true;
                document.getElementById("mainPage").hidden = false;
                document.title = "Webware A3";
                getItems(username);
            } else {
                window.alert("Username and/or password are incorrect.");
            }
        });
}

//Creates a new account
function newAccount(e) {
    e.preventDefault();

    let data = {};
    data["username"] = document.getElementById("newUsername").value;
    data["password"] = document.getElementById("newPassword").value;

    fetch('/newuser', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"}
    })
        .then(function(response) {
            if (response.ok) {
                window.alert("New account created.");
            } else {
                window.alert("Account could not be created.");
            }
        })
}

//Handles edit button clicks and delete button clicks
function clickHandler(e) {
    if (e.target.tagName === "BUTTON") {
        if (e.target.className === "edit") {
            editField(e);
        } else if (e.target.className === "delete") {
            deleteItem(e);
        }
    }
}

window.onload = function() {
    document.getElementById("submit").addEventListener("click", submitFormData, false);
    document.getElementById("login").addEventListener("click", login, false);
    document.getElementById("create").addEventListener("click", newAccount, false);
    document.addEventListener("click", clickHandler, false);
}

let username = null;