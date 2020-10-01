// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 3!")

const addPlayer = function( e ) {
  // prevent default form action from being carried out
  e.preventDefault()

  let playerData = []

  const username = document.querySelector('#usr')
  const password = document.querySelector('#pwrd')
  const nickname = document.querySelector('#nick')
  const prefFoot = document.querySelector('#foot')
  const position = document.querySelector('#pos')

  if(nickname.value.toString().trim() == '' || prefFoot.value.toString().trim() == '' || position.value.toString().trim() == ''){
   alert("Please fill in all the fields before adding a new task");
   return false;
 }

  json = {
    nick: nickname.value,
    foot: prefFoot.value,
    pos: position.value,
    dateAdded: (new Date().getDay()) + "/" + (new Date().getDate()) + "/" + (new Date().getFullYear())
  }

  convert = JSON.stringify(json)

  //print inputted data to the console to see if it worked
  playerData.push(convert)
  console.log(playerData)

  fetch( '/submit', {
    method:'POST',
    body: convert,
    header: {
      "Content-Type": "application/json"
    }
  })
  .then( response => response.json() )
  .then( response => {
    updateTable(json)
  })
  .then( function( success ) {
    console.log( success )
    alert("Successfully added player!")
  })

  return false
}


const updateTable = function(playerJSON) {

  var table = document.getElementById('players');
  var new_row = table.insertRow(1);
  var new_nick = new_row.insertCell(0);
  var new_foot = new_row.insertCell(1);
  var new_pos = new_row.insertCell(2);
  var new_date = new_row.insertCell(3);
  var new_edit = new_row.insertCell(4);
  var new_delete = new_row.insertCell(5);

  new_nick.innerHTML = playerJSON.nick;
  new_foot.innerHTML = playerJSON.foot;
  new_pos.innerHTML = playerJSON.pos;
  new_date.innerHTML = playerJSON.dateAdded;

  var editButton = document.createElement("button")
  editButton.id = "editButton"
  editButton.className += "mui-btn mui-btn--primary"
  //editButton.innerHTML = <span>Edit</span>
  new_edit.appendChild(editButton)

  var deleteButton = document.createElement("button")
  deleteButton.id = "deleteButton"
  deleteButton.className += "mui-btn mui-btn--danger"
  //editButton.innerHTML = <span>Edit</span>
  new_delete.appendChild(deleteButton)

}

window.onload = function() {
  const button = document.querySelector( '#addPlayer' )
  button.onclick = addPlayer
}


fetch("/index.html", {
  method: "POST",
  body: JSON.stringify({test:1}),
  headers:{
    "Content-Type":"application/json"
  }
})


/*
let playerList = []
let listOrder = {
  "nickname": 0,
  "Username": 1,
  "Password": 2,
  "Foot": 3,
  "Positon": 4,
  "dateJoined": 5,
}

function deleteItem(id) {

  let entry = document.getElementById(id)

  fetch( 'delete', {
    method:'POST',
    body: JSON.stringify({id: id})
  }).then( function( response) {
    if(response.status === 200) {
      alert("Successfully removed");
      entry.remove();
    }
    else {
      alert("Entry was not removed successfully, try again!")
    }
  })
}

function createUser() {
  let table = docuent.getElementById('players')
  fetch('/playerLink',{
    method:'POST'
  }).then( function(response) {
    return response.text();
}).then(function(text){
  JSON.parse(text).forEach(item =>{
    let row = table.insertRow(-1);
    let id = item.id;

    row.id = id;

    for(let key in listOrder) {
      let cell = row.insertCell(listOrder[key]);
      if( item[key] === -1) {
        cell.innerHTML = 'HIDDEN'
        cell.classList.add('hidden');
      }
      else {
        cell.innerHTML = item[key];
      }
    }

    let deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete User"
    deleteButton.onClick = (() => deleteItem(id));
    let buttonCell = row.insertCell(6);
    buttonCell.appendChild(deleteButton);
  });
})
}

createUser();
*/
