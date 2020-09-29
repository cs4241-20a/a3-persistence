// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// require middleware
const playersList = document.getElementById("players");
const playerForm = document.getElementById("playerForm");
const adminElement = document.getElementById("admin");
const table = document.getElementById("playerTable");
const players = document.getElementById("size");
const avgCost = document.getElementById("avgcost");

// add rows in table to fetch players' data
function add(player) {
  let row = table.insertRow(-1);

  // incert cell
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  cell5.className = "buttonColumn";

  let btn = document.createElement('input');
  btn.type = "button";
  btn.value = "Remove";
  btn.className = "deleteButton";
  btn.onclick = function(){
    fetch("/delete", {
      method:"POST",
      body:JSON.stringify({id: player._id}),
      headers: {
      "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      table.deleteRow(row.rowIndex);
      fetch("/results", {
    method:"GET",
    headers: {
      "admin": adminElement.innerText
    }
  })
  .then( response => response.json() )
  .then( json => {
    showTable(json);
  })
    })
  };
  let btn2 = document.createElement('input');
  btn2.type = "button";
  btn2.value = "Edit";
  btn2.className = "editButton";
  btn2.onclick = function(){
    if(btn2.value === "Edit"){
      row.contentEditable = true;
      btn2.value = "Submit";
      cell1.style.border = "3px dotted black";
      cell2.style.border = "3px dotted black";
      cell3.style.border = "3px dotted black";
      cell4.style.border = "3px dotted black";
      
    }
    else if(btn2.value === "Submit"){
      row.contentEditable = false;
      btn2.value = "Edit";
      cell1.style.border = "";
      cell2.style.border = "";
      cell3.style.border = "";
      cell4.style.border = "";
      
      
      let newPlayer = update(player._id, cell1.innerText, 
                    cell2.innerText, cell3.innerText, cell4.innerText);
    }
  }
  cell5.appendChild(btn2);
  cell5.appendChild(btn);
  let cost_per_hour = (parseFloat(player.cost))/(parseFloat(player.hour));
  // Add some text to the new cells:
  cell1.innerHTML = player.name;
  cell2.innerHTML = player.game;
  cell3.innerHTML = player.cost;
  cell4.innerHTML = player.hour;
  
//   var obj = {costperhour: cost_per_hour};
//   var input = JSON.stringify(obj);
//     // the last input calculate for the cost/hour value after converting the string to int
//   cell6.innerHTML = input.costperhour;

}

function submitForm(e) {
  e.preventDefault();

  // get dream value and add it to the list
  let name = playerForm.elements.name.value;
  let game = playerForm.elements.game.value;
  let cost = playerForm.elements.cost.value;
  let hour = playerForm.elements.hour.value;

  fetch("/add", {
    method:"POST",
    body:JSON.stringify({ "admin": adminElement.innerText,
      name, game, cost, hour }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( response => response.json() )
  .then( json => {
    add(json);
    fetch("/results", {
    method:"GET",
    headers: {
      "admin": adminElement.innerText
    }
  })
  .then( response => response.json() )
  .then( json => {
    showTable(json);
  })
  })
  // reset form
  playerForm.reset();
  playerForm.elements.name.focus();
};



function update(id, name, game, cost, hour){
    fetch("/edit", {
    method:"POST",
    body:JSON.stringify({id, 
      "admin": adminElement.innerText,
      name, game, cost, hour}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( response => response.json() )
  .then( json => {
    fetch("/results", {
    method:"GET",
    headers: {
      "admin": adminElement.innerText
    }
  })
  .then( response => response.json() )
  .then( json => {
    showTable(json);
  })
    return json;
  })
}

function showTable(json){
  let avgcost = 0;
  let numRows = table.rows.length-1;
  // delete rows
  for(let i=0; i<numRows; i++){
    table.deleteRow(1);
  }
  // then display all information from the database
  for(let j=0; j<json.length; j++) {
    add(json[j]);
    avgcost += Number(json[j].cost);
  }
  players.innerHTML = json.length;
  avgcost= avgcost/ json.length;
  let final = (Math.round(avgcost * 1000) / 1000);
  avgCost.innerHTML = final;
}

function login(e) {
    e.preventDefault();

    let admin = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch('/login', {
      method: "POST",
      body: JSON.stringify({admin, password}),
      headers: {
        "Content-Type":"application/json"
      }
    })
    .then(async function(response) {
      if (response.status === 200) {
        let json = await response.json();
        let username = json.username;
        document.title = "your favorite game";
        document.getElementById("loginPage").hidden = true;
        document.getElementById("body").hidden = false;
        adminElement.innerText = username;
        fetch("/results", {
    method:"GET",
    headers: {
      "admin": adminElement.innerText
    }
  })
  .then( response => response.json() )
  .then( json => {
    showTable(json);
  })
      } 
      else {
        window.alert("Incorrect username or password");
      }
    });
}

function createAccount(e) {
    e.preventDefault();

    let admin = document.getElementById("newUsername").value;
    let password = document.getElementById("newPassword").value;
    
    fetch('/newaccount', {
      method: "POST",
      body: JSON.stringify({admin, password}),
      headers: {
        "Content-Type":"application/json"
      }
    })
    .then(function(response) {
      if (response.ok) {
        window.alert("Successfully create account");
      } else {
        window.alert("Error!");
      }
    })
}

window.onload = function(){
  const loginButton = document.getElementById("login");
  loginButton.onclick = login;
  const createButton = document.getElementById("create");
  createButton.onclick = createAccount;
  const submitButton = document.getElementById("submitplayer");
  submitButton.onclick = submitForm;
  // login.onlick = login
}