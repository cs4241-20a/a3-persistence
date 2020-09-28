// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!");
var bID = 0;

//send data to server
const submit = function(e) {
  console.log("start submit");
  // prevent default form action
  e.preventDefault();

  //Valid input?
  if (!validateInput()) {
    return false;
  }

  //const input = document.forms["inputForm"].getElementsByTagName("input");
  const input = document.querySelector("myinput");
  const gettask = document.querySelector("#youtask").value;
  const getdue = document.querySelector("#duedate").value;
  
  // current date
  // adjust 0 before single digit date
  let date_ob = new Date();
  let cdate =
    date_ob.getMonth() + "/" + date_ob.getDate() + "/" + date_ob.getFullYear();
  const mdate = cdate;
  const json = { gettask, getdue, mdate };

  const body = JSON.stringify(json);

  fetch("/add", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(function(response) {
      addRows(response);
    });

  return false;
};

/*
//Delete a row of task form the table and server
function deleteRows(e) {
  console.log("start delete row");
  const tableBody = document.getElementById("taskItems");
  console.log(tableBody);
  let len = tableBody.length;
  console.log(len);
  
  /*let toDelete = document.getElementsByClassName("Completed");
  
  let len = toDelete.length;

  for (let i = 0; i < len; i++) {
    //get index of combleted rows, (is 2 down from stated)
    let dIndex = toDelete[0].rowIndex - 2;
    let jsonDelete = { delete: 1, i: dIndex };
    const body = JSON.stringify(jsonDelete); // send info to json server
    //var row = btn.parentNode.parentNode;
    //row.parentNode.removeChild(row);

    //Send and log the delete post to server
    fetch("/delete", {
      method: "POST",
      body,
      header:{
        'Content-Type': 'application/json'
      }
    }).then(response => console.json())
    .then(json => {
      toDelete[0].remove(); //delete row in HTML.
    })
  }
}
  */

    
    
  

//Handles the click action
const handleButton = function(e) {
  e.preventDefault();
  console.log("handle button");
  console.log(e);
  //console.log(e.target.tagName);
  //submit(e);
  //Ignores if you click on anything but a button
  if (e.target.tagName === "BUTTON") {
    //Route the button press to the correct function
    if (e.target.id === "myinput") {
      console.log("myinput: submit");
      submit(e);
    } 
    /*else if (e.target.id === "deleteb") {
      console.log("deleteb: delete row");
      //deleteRows(e);
    }*/
  }
  return false;
};

//Takes a json object and adds it to the table as a row
function addRows(jsonEntry) {
  console.log("addrows", jsonEntry);
  //Find the table
  const tableBody = document.getElementById("TaskBody");
  //Insert a new cell and row
  let row = tableBody.insertRow(-1);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  //let cell4 = row.insertCell(3);

  //Fill those cells with server info.
  cell1.innerHTML = jsonEntry.gettask;
  cell2.innerHTML = jsonEntry.getdue;
  cell3.innerHTML = jsonEntry.mdate;
}

//Validates the input
function validateInput() {
  console.log("validateInput");
  const inputTask = document.getElementById("youtask").value;
  console.log(inputTask);
  // change.....

  const inputdd = document.getElementById("duedate").value;
  console.log(inputdd); // confirm if date?

  return true;
}

window.onload = function() {
  const submitbutton = document.getElementById("myinput");
  submitbutton.addEventListener("click", handleButton, false);

  //const deletebutton = document.getElementById("deleteb");
  //deletebutton.addEventListener("click", handleButton, false);
};
