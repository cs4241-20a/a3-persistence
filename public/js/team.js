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
  const table = document.querySelector('#players')

  if(nickname.value.toString().trim() == '' || prefFoot.value.toString().trim() == '' || position.value.toString().trim() == ''){
   alert("Please fill in all the fields before adding a new task");
   return false;
 }

  let json = {
    nick: nickname.value,
    foot: prefFoot.value,
    pos: position.value,
    dateAdded: (new Date().getDay()) + "/" + (new Date().getDate()) + "/" + (new Date().getFullYear())
  }

  let convert = JSON.stringify(json)

  //print inputted data to the console to see if it worked
  //playerData.push(convert)
  //console.log(playerData)

  fetch( '/submit', {
    method:'POST',
    body: convert,
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( response => response.json() )
  .then( responseWithid => {
    //console.log(responseWithid)
    updateTable(responseWithid, table)
  })
  .then( function( success ) {
    alert("Successfully added player!")
  })

  return false
}

const removePlayer = function(id, table) {
  
  let json = { 
    _id: id 
  }
  
  console.log(json)
  
  fetch( '/delete', {
    method:'POST',
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( deleteResponse => {
    //console.log(deleteResponse)
    return deleteResponse.json()
  })
  .then( playerArray => {
    
    let numRows = table.rows.length
    
    for(var i = 1; i < numRows; i++) {
      table.deleteRow(1)
    }
    
    playerArray.forEach(entry => { 
      updateTable(entry, table)
    })
    
  })
  
  return false;
}

const startEdit = function(table, row, id) {
  
  const nickname = document.querySelector('#nick')
  const prefFoot = document.querySelector('#foot')
  const position = document.querySelector('#pos')
  const submitButton = document.querySelector( '#addPlayer' )
  
  nickname.value = row.cells[0].innerHTML;
  prefFoot.value = row.cells[1].innerHTML;
  position.value = row.cells[2].innerHTML;
  
  console.log(nickname.value)
   console.log(prefFoot.value)
   console.log(position.value)
  
  submitButton.onclick  = function() {
    
    edit(nickname, prefFoot, position, table, id, submitButton)
    
    return false
  }
}

const edit = function(nickname, prefFoot, position, table, id, button) {
  
  button.onclick = addPlayer
  
  if(nickname.value.toString().trim() == '' || prefFoot.value.toString().trim() == '' || position.value.toString().trim() == ''){
   alert("Please fill in all the fields before editing a new task");
   return false;
  }
  
  let json = {
    nick: nickname.value,
    foot: prefFoot.value,
    pos: position.value,
    _id: id,
    dateAdded: (new Date().getDay()) + "/" + (new Date().getDate()) + "/" + (new Date().getFullYear())
  }
  
  console.log(JSON.stringify(json))
  
  fetch( '/edit', {
    method:'POST',
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( editResponse => {
    return editResponse.json()
  })
  .then( playerArray => {
    
    let numRows = table.rows.length
    
    for(var i = 1; i < numRows; i++) {
      table.deleteRow(1)
    }
    
    playerArray.forEach(entry => { 
      updateTable(entry, table)
    })
    
  })
  return false;
  
}

const updateTable = function(playerJSON, table) {

  let btable = table.getElementsByTagName("tbody")[0]
  let new_row = btable.insertRow(-1);
  let new_nick = new_row.insertCell(0);
  let new_foot = new_row.insertCell(1);
  let new_pos = new_row.insertCell(2);
  let new_date = new_row.insertCell(3);
  let new_edit = new_row.insertCell(4);
  let new_delete = new_row.insertCell(5);

  new_nick.innerHTML = playerJSON.nick;
  new_foot.innerHTML = playerJSON.foot;
  new_pos.innerHTML = playerJSON.pos;
  new_date.innerHTML = playerJSON.dateAdded;

  let editButton = document.createElement("button")
  editButton.id = "editButton"
  editButton.className += "mui-btn mui-btn--primary"
  new_edit.appendChild(editButton)
  editButton.onclick = function() {startEdit(table, new_row, playerJSON._id)}

  let deleteButton = document.createElement("button")
  deleteButton.id = "deleteButton"
  deleteButton.className += "mui-btn mui-btn--danger"
  new_delete.appendChild(deleteButton)
  deleteButton.onclick = function() { removePlayer(playerJSON._id, table) }
  
}

const logout = function(e) {
  
  e.preventDefault()
  
  fetch("/logout")
  .then(response => {
    if (response.status === 200){
        window.location.href = "/"
    }
  })
  
}

const isLoggedIn = function() {
  fetch("/isLoggedIn")
  .then(response => {
    if (response.status === 500) {
       window.location.href = "/"
     }
     else{
       return false
     }
  })
}

const setTag = function(jsonUsername) {
  document.getElementById("tag").innerHTML = jsonUsername.user;  
}

window.onload = function() {
  
  const submitButton = document.querySelector( '#addPlayer' )
  submitButton.onclick = addPlayer
  
  const logoutButton = document.querySelector( '#logoutButton')
  logoutButton.onclick = logout  
  
  const table = document.querySelector('#players')
  
  fetch("/getCurrentUser")
    .then(response => response.json())
    .then(json => {
    setTag(json)
  })
  
  fetch("/appdata", {
    method:'GET'
  })
  .then(response => {
    return response.json()
  })
  .then( playerData => {
    playerData.forEach(entry => { 
      updateTable(entry, table)
    })
  })
  
  
}
