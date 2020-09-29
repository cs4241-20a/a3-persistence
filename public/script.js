// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const roster = document.getElementById("players");
const playerForm = document.getElementById("playerForm");
const table = document.getElementById("table");
const coachElement = document.getElementById("coach");
const teamSize = document.getElementById("size");

const addPlayer = (player) => {
  let row = table.insertRow(-1);
  
  let cell0 = row.insertCell(0);
  cell0.className = "number";
  cell0.innerHTML = player.number;
  
  let cell1 = row.insertCell(1);
  cell1.className = "firstName";
  cell1.innerHTML = player.firstName;
  
  let cell2 = row.insertCell(2);
  cell2.className = "lastName";
  cell2.innerHTML = player.lastName;
  
  let cell3 = row.insertCell(3);
  cell3.className = "experience";
  cell3.innerHTML = player.experience;
  
  let cell4 = row.insertCell(4);
  
  let deleteBtn = document.createElement('input');
  deleteBtn.type = "button";
  deleteBtn.value = "Remove";
  deleteBtn.className = "deleteButton";
  deleteBtn.onclick = function(){
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({id: player._id}),
      headers: {"Content-Type": "application/json"}
    })
    .then( response => response.json())
    .then( json => {
      table.deleteRow(row.rowIndex);
      getRoster();
    })
  };
  
  let editBtn = document.createElement('input');
  editBtn.type = "button";
  editBtn.value = "Edit";
  editBtn.className = "editButton";
  editBtn.onclick = function(){
    if( editBtn.value === "Edit"){
      row.contentEditable = true;
      editBtn.value = "Submit";
    } else if( editBtn.value === "Submit"){
      row.contentEditable = false;
      editBtn.value = "Edit";
      
      let newPlayer = editPlayer(player._id, cell0.innerText, cell1.innerText, cell2.innerText, cell3.innerText);
    }
  };
  cell4.appenedChild(editBtn);
  cell4.appendChild(deleteBtn);
  
};

const submit = function (e) {
  e.preventDefault();
  
  let number = playerForm.elements.number.value;
  let firstName = playerForm.elements.firstName.value;
  let lastName = playerForm.elements.lastName.value;
  let experience = playerForm.elements.experience.value;
  
  fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number, firstName, lastName, experience }),
  })
  .then((response) => response.json())
  .then( json => {
    addPlayer(json);
    getRoster();
  })
  
  playerForm.reset();
  playerForm.elements.name.focus();
}; 

const getRoster = () => {
  fetch("/results", {
    method: "GET",
    headers: {"coach": coachElement.innerText}
  })
  .then( response => response.json() )
  .then( json => {
    listPlayers(json);
  })
};

const editPlayer = (id, number, firstName, lastName, experience) => {
  fetch('/update', {
    method: "POST",
    body: JSON.stringify({id, number, firstName, lastName, experience}),
    headers: {"Content-Type": "application/json"}
  })
  .then( response => response.json())
  .then( json => {
    getRoster();
    return json;
  })
}; 

const listPlayers = (data) => {
  let numRows = table.rows.length-1;
  for( let i = 0; i < numRows; i++) {
    table.deleteRow(1);
  }
  for( let j = 0; j < data.length; j++ ){
    addPlayer(data[j]);
  }
  teamSize.innerHTML = data.length;
};

const login = (e) => {
  e.preventDefault();
  
  let coach = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({coach, password}),
  })
  .then(async function (response) {
    if( response.status === 200) {
      let json = await response.json();
      let username = json.username;
      document.getElementById("loginPage").hidden = true;
      document.getElementById("mainPage").hidden = false;
      coach.innerText = username;
      getRoster();
    } else {
      window.alert("incorrect username/password");
    }
  })
};

const createUser = (e) => {
  e.preventDefault();
  
  let coach = document.getElementById("newUsername").value;
  let password = document.getElementById("newPassword").value;
  
  fetch('/newAccount', {
    method: "POST",
    body: JSON.stringinfy({coach, password}),
    headers: { "Content-Type": "application/json"}
  })
  .then( function(response) {
    if(response.ok) {
      window.alert("created account :) - please log in with your new credentials now")
    } else {
      window.alert("error - new account has not been created :(")
    }
  })
}

window.onload = function() {
  const loginButton = document.getElementById("login");
  loginButton.onclick = login;
  const submitButton = document.getElementById("submitPlayer");
  submitButton.onclick = submit;
  const createButton = document.getElementById("create");
  createButton.onclick = createUser;
};
