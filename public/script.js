// client-side js, loaded by index.html
// run by the browser each time the page is loaded

let username = "test";
let numRows = 1;

// define variables that reference elements on our page
//const loginForm = document.getElementById("login")
const form = document.getElementById("inputForm");
const submitButton = document.getElementById("submit");
const nameForm = document.getElementById("name");
const levelForm = document.getElementById("level");
const table = document.querySelector("table");
const loginButton = document.getElementById("loginButton");
// checkboxes
const mon = document.getElementById("mon"),
  tue = document.getElementById("tue"),
  wed = document.getElementById("wed"),
  thu = document.getElementById("thu"),
  fri = document.getElementById("fri");

// fetch this user's saved info
 fetch("/classes")
   .then(response => response.json()) // parse the JSON from the server
   .then(classes => {console.log("username =", username)});



// Submit
submitButton.onclick = function() {
  console.log("test")
  console.log("username = ", username);
  let days = getChecked();

  // console.log("Test Info:");
  // console.log("Class name:", nameForm.value);
  // console.log("Course Level:", levelForm.value);
  // console.log("Days:", days);


  // make POST request with form data
  fetch("/add", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      name: nameForm.value,
      level: levelForm.value,
      days: days
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      //console.log("json.id:", json._id);
      appendClass(json, json._id);
    });
};

// Create an array of all checked items
function getChecked() {
  let days = [];
  if (mon.checked === true) {
    days.push("M");
  }
  if (tue.checked === true) {
    days.push("T");
  }
  if (wed.checked === true) {
    days.push("W");
  }
  if (thu.checked === true) {
    days.push("Th");
  }
  if (fri.checked === true) {
    days.push("F");
  }
  return days;
}

function appendClass(json, id) {
  console.log("Adding row");
  const newRow = table.insertRow(numRows);
  let cell1 = newRow.insertCell(0);
  let cell2 = newRow.insertCell(1);
  let cell3 = newRow.insertCell(2);
  cell1.innerText = json.name;
  cell2.innerText = json.level;
  cell3.innerText = json.days;
  numRows++;

  console.log("id =", id);
  newRow.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newRow.remove();
        numRows--;
      });
  };
}

window.onload = function() {
  console.log(username);
};
