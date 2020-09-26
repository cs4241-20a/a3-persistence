const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const makeinput = document.querySelector( '#vehiclemake' ),
          modelinput = document.querySelector( '#vehiclemodel' ),
          yearinput = document.querySelector( '#vehicleyear' ),
          table = document.querySelector( '#resultsTable'),
          json = { vehiclemake: makeinput.value , vehiclemodel: modelinput.value , vehicleyear: yearinput.value , vehicleage: (new Date().getFullYear() - yearinput.value)}

    //check if inputs are empty
    if(makeinput.value == "" || modelinput.value == "" || yearinput == "") {
      console.log("empty input!!!");
      return;
    }

    //make sure year is valid (number between when first car was made and this year)
    if (isNaN(yearinput.value) || 1879 > parseInt(yearinput.value) || parseInt(yearinput.value) > new Date().getFullYear()) {
      console.log("invalid year!!");
      return;
    }

    console.log(json)
    fetch( '/submit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    })
    .then( response => response.json() )
    .then( json => {
      updateTable(table, json)
    })

    // clear inputs
    makeinput.value = "";
    modelinput.value = "";
    yearinput.value = "";

    return false
  }

const logout = function( e ) {
    e.preventDefault()

    fetch( '/logout', {
      method: 'GET'
    })
    .then( () => {
      window.location.href="/"
    })

    return false;
  }

const startEdit = function( table, row, id) {
    const makeinput = document.querySelector( '#vehiclemake' ),
          modelinput = document.querySelector( '#vehiclemodel' ),
          yearinput = document.querySelector( '#vehicleyear' ),
          button = document.querySelector( '#submitButton' );
    
    makeinput.value = row.cells[0].innerHTML;
    modelinput.value = row.cells[1].innerHTML;
    yearinput.value = row.cells[2].innerHTML;

    button.onclick = function() {edit( makeinput, modelinput, yearinput, table, id, button)}

    return false;
  }

const edit = function ( makeinput, modelinput, yearinput, table, id, button) {

    //set button back to submit no matter what
    button.onclick = submit

    //check if inputs are empty
    if(makeinput.value == "" || modelinput.value == "" || yearinput.value == "") {
      console.log("empty input!!!");
      return;
    }

    //make sure year is valid (number between when first car was made and this year)
    if (isNaN(yearinput.value) || 1879 > parseInt(yearinput.value) || parseInt(yearinput.value) > new Date().getFullYear()) {
      console.log("invalid year!!");
      return;
    }

    const json = { _id: id, vehiclemake: makeinput.value , vehiclemodel: modelinput.value , vehicleyear: yearinput.value , vehicleage: (new Date().getFullYear() - yearinput.value) }
    //console.log(json)

    fetch( '/edit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    })
    .then( response => response.json() )
    .then (array => {
      //wipe current table displayed and replace with updated table
      var numRows = table.rows.length
      for(var i = 1; i < numRows; i++) {
        table.deleteRow(1);
      }

      console.log(array)

      array.forEach(element => updateTable(table, element))
    })

    return false;
  }

const del = function( table, id ) {
    
    json = { _id: id }
    console.log(json)

    fetch( '/delete', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify( json )
    })
    // want the entire array (in json format) as response
    .then (response => {
      console.log(response)
      return response.json() 
    })
    .then (array => {
      //wipe current table displayed and replace with updated table
      var numRows = table.rows.length
      for(var i = 1; i < numRows; i++) {
        table.deleteRow(1);
      }

      array.forEach(element => updateTable(table, element))
    })

    //set submit button back to normal status just in case you delete something while editing
    const button = document.querySelector( '#submitButton' );
    button.onclick = submit

    return false;
  }

const updateTable = function(table, data) {
    var tbody = table.getElementsByTagName('tbody')[0]
    var row = tbody.insertRow(-1);
    var make = row.insertCell(0);
    var model = row.insertCell(1);
    var year = row.insertCell(2);
    var age = row.insertCell(3);
    var btnCell = row.insertCell(4);

    make.innerHTML = data.vehiclemake;
    model.innerHTML = data.vehiclemodel;
    year.innerHTML = data.vehicleyear;
    age.innerHTML = data.vehicleage;

    var editBtn = document.createElement('button');
    editBtn.id = "editButton";
    editBtn.className += "mui-btn mui-btn--raised mui-btn--primary";
    editBtn.innerHTML = '<span class="google-icon"><span class="material-icons">create</span>Edit</span>'
    editBtn.onclick = function() {startEdit(table, row, data._id)}
    btnCell.appendChild(editBtn);

    var delBtn = document.createElement('button');
    delBtn.id = "deleteButton";
    delBtn.className += "mui-btn mui-btn--raised mui-btn--danger";
    delBtn.innerHTML = '<span class="google-icon"><span class="material-icons">delete_outline</span>Delete</span>'
    delBtn.onclick = function() {del(table, data._id)}
    btnCell.appendChild(delBtn);
  }

window.onload = function() {
    const button = document.querySelector( '#submitButton' )
    button.onclick = submit

    const logoutButton = document.querySelector( '#logoutButton' )
    logoutButton.onclick = logout

    const table = document.querySelector( '#resultsTable' )
    fetch( '/appdata', {
      method:'GET'
    })
    .then( response => response.json() )
    .then( array => {
      //console.log(array)
      array.forEach(element => updateTable(table, element))
    })
  }
