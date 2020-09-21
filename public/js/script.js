"use strict";

//Get all items for a user
function getAllItems(uid) {
    ;
}

function editField() {
    ;
}

function deleteItem() {
    ;
}

//Add one json object to the table as the last row
function addTableEntry(jsonData) {
    //Find the table
    const tableBody = document.getElementById("mealBody");
    //Insert a new row and then new cells
    let row = tableBody.insertRow(-1);

    let [hours, minutes] = jsonData.time.split(":");
    time = ((hours > 12)? hours-12 : hours) + ":" + minutes + " " + ((hours >= 12)? 'PM' : 'AM');

   row.insertCell(0).innerHTML = time + "<button class=\"edit\">?</button>";
   row.insertCell(1).innerHTML = jsonData.food + "<button class=\"edit\">?</button>";
   row.insertCell(2).innerHTML = jsonData.calories + "<button class=\"edit\">?</button>";
   row.insertCell(3).innerHTML = jsonData.meal + "<button class=\"edit\">?</button>";
   row.insertCell(4).innerHTML = "<button class=\"delete\">Delete?</button>";
}

//Submits form data to the server
function submitFormData(e) {
    e.preventDefault();
    let data = {};
    
    let fields = document.getElementsByClassName("entry");
    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];
        data[element.id] = element.value;
    }

    let radios = document.getElementsByName("meal");
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            data["meal"] = radios[i].value;
        }
    }

    fetch('/submit', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"}
    })
    .then(response => response.json())
    .then(function(data) {
        console.log(data);
        addTableEntry(data);
    });
}

window.onload = function() {
    //getAllItems(uid);
    document.getElementById("submit").addEventListener("click", submitFormData, false);
    //document.addEventListener("click", handleButton, false);
}

console.log("Loaded JS")
