//client script

let tableData;

const loadTable = function(jsonData) {
  console.log(jsonData);
  let table = document.getElementById("resultTableBody");
  tableData = jsonData;
  table.innerHTML = "";
  for (var i = 0; i < jsonData.length; i++) {
    let tr = table.insertRow(-1);
    let route = tr.insertCell(-1);
    let time = tr.insertCell(-1);
    let distance = tr.insertCell(-1);
    let fitness = tr.insertCell(-1);
    route.textContent = jsonData[i].route;
    time.textContent = jsonData[i].time;
    distance.textContent = jsonData[i].distance;
    fitness.textContent = jsonData[i].fitness;
  }
};

const refreshInput = function() {
  inputRoute = document.querySelector("#inputRoute");
  inputTime = document.querySelector("#inputTime");
  inputDistance = document.querySelector("#inputDistance");
};

const sendAndRecieve = function(action) {
  console.log(action);
  const json = {
      route: inputRoute.value,
      time: inputTime.value,
      distance: inputDistance.value,
      fitness: inputTime.value * inputDistance.value
    },
    body = JSON.stringify(json);

  fetch(action, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body
  })
    .then(response => response.json())
    .then(jsonData => loadTable(jsonData));
};

let inputRoute = document.querySelector("#inputRoute");
let inputTime = document.querySelector("#inputTime");
let inputDistance = document.querySelector("#inputDistance");

const clear = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  
  inputRoute = document.querySelector("#inputRoute");
  inputTime = document.querySelector("#inputTime");
  inputDistance = document.querySelector("#inputDistance");
  inputRoute.value="";
  inputTime.value="";
  inputDistance.value="";
  
  return false;
};

const logout = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  window.location.replace("/logout")
  
  return false;
};

const add = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  refreshInput();

  //sanitize inputs here
  if (inputRoute.value === "") {
    alert("Please input a route");
    return false;
  }
  if (tableData.some(row => row.route === inputRoute.value)) {
    alert("Can't have duplicate route names");
    return false;
  }
  if (inputTime.value === "") {
    alert("Please input a time in minutes");
    return false;
  }
  if (inputDistance.value === "") {
    alert("Please input a distance in miles");
    return false;
  }

  sendAndRecieve("/add");

  return false;
};

const update = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  refreshInput();

  //sanitize inputs here

  if (inputRoute.value === "") {
    alert("Please input the route");
    return false;
  }
  if (!tableData.some(row => row.route === inputRoute.value)) {
    alert("That route does not exist");
    return false;
  }
  if (inputTime.value === "") {
    alert("Please input the time in minutes");
    return false;
  }
  if (inputDistance.value === "") {
    alert("Please input the distance in miles");
    return false;
  }

  sendAndRecieve("/update");

  return false;
};

const del = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  refreshInput();

  //sanitize inputs here

  var inputRoute = document.querySelector("#inputRoute");
  var inputTime = document.querySelector("#inputTime");
  var inputDistance = document.querySelector("#inputDistance");
  if (inputRoute.value === "") {
    alert("Please input the route");
    return false;
  }
  if (!tableData.some(row => row.route === inputRoute.value)) {
    alert("That route does not exist");
    return false;
  }

  sendAndRecieve("/delete");

  return false;
};

const load = function() {
  fetch("/load", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => loadTable(json)); //load when recieve data
};

const loadedLog = function() {
  console.log("window loaded");
};

window.onload = function() {
  load();
  const addButton = document.getElementById("add-button");
  const updatebutton = document.getElementById("update-button");
  const delButton = document.getElementById("delete-button");
  const clearButton = document.getElementById("clear-button");
  const logoutButton = document.getElementById("logout-button");
  addButton.onclick = add;
  updatebutton.onclick = update;
  delButton.onclick = del;
  clearButton.onclick = clear;
  logoutButton.onclick = logout;
};
