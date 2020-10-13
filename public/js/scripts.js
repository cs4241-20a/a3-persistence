const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const descriptioninput = document.querySelector( '#description' ),
          weightinput = document.querySelector( '#weight' ),
          delivdateinput = document.querySelector( '#delivdate' ),
          table = document.querySelector( '#resultsTable'),
          json = { description: descriptioninput.value , weight: weightinput.value , delivdate: delivdateinput.value , price: (weightinput.value * delivdateinput.value)}

    //ensure fields not empty
    if(descriptioninput.value == "" || weightinput.value == "" || delivdateinput == "") {
      console.log("empty fields");
      return;
    }

    //ensure weight and date valid
    if (isNaN(delivdateinput.value) || isNaN(weightinput.value) || 1 > parseInt(delivdateinput.value) || 1 > parseInt(weightinput.value)) {
      console.log("weight and/or date invalid");
      return;
    }

    console.log(json) //debug
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
    descriptioninput.value = "";
    weightinput.value = "";
    delivdateinput.value = "";

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
  console.log('start edit')
    const descriptioninput = document.querySelector( '#description' ),
          weightinput = document.querySelector( '#weight' ),
          delivdateinput = document.querySelector( '#delivdate' ),
          button = document.querySelector( '#submitButton' );
    
    descriptioninput.value = row.cells[0].innerHTML;
    weightinput.value = row.cells[1].innerHTML;
    delivdateinput.value = row.cells[2].innerHTML;

    button.onclick = function() {edit( descriptioninput, weightinput, delivdateinput, table, id, button)}

    return false;
  }

const edit = function ( descriptioninput, weightinput, delivdateinput, table, id, button) {
    console.log('edit function')
    //reset submit button
    button.onclick = submit

    //check if inputs are empty
    if(descriptioninput.value == "" || weightinput.value == "" || delivdateinput.value == "") {
      console.log("empty fields");
      return;
    }
  
    //ensure weight and date valid
    if (isNaN(delivdateinput.value) || isNaN(weightinput.value) || 1 > parseInt(delivdateinput.value) || 1 > parseInt(weightinput.value)) {
      console.log("weight and/or date invalid");
      return;
    }

    const json = { _id: id, description: descriptioninput.value , weight: weightinput.value , delivdate: delivdateinput.value , price: (weightinput.value * delivdateinput.value)}
    console.log(json)

    fetch( '/edit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    })
    .then( response => response.json() )
    .then (array => {
      
      var numRows = table.rows.length
      for(var i = 1; i < numRows; i++) {
        table.deleteRow(1);
      }

      console.log(array)

      array.forEach(element => updateTable(table, element))
    })

      // clear inputs
    descriptioninput.value = "";
    weightinput.value = "";
    delivdateinput.value = "";
  
    return false;
  }

const del = function( table, id ) {
    
    const json = { _id: id }
    console.log(json)

    fetch( '/delete', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify( json )
    })
    
    .then (response => {
      console.log(response)
      return response.json() 
    })
    .then (array => {
      //Reload table
      var numRows = table.rows.length
      for(var i = 1; i < numRows; i++) {
        table.deleteRow(1);
      }

      array.forEach(element => updateTable(table, element))
    })


    const button = document.querySelector( '#submitButton' );
    button.onclick = submit

    return false;
  }

//Load each element into the table
const updateTable = function(table, data) {
    var tbody = table.getElementsByTagName('tbody')[0]
    var row = tbody.insertRow(-1);
    var descriptionCell = row.insertCell(0);
    var weightCell = row.insertCell(1);
    var delivdateCell = row.insertCell(2);
    var priceCell = row.insertCell(3);
    var editCell = row.insertCell(4);
    var delCell = row.insertCell(5);

    descriptionCell.innerHTML = data.description;
    weightCell.innerHTML = data.weight;
    delivdateCell.innerHTML = data.delivdate;
    priceCell.innerHTML = data.price;

    var editBtn = document.createElement('button');
    editBtn.id = "editButton";
    editBtn.innerHTML = 'Edit'
    editBtn.onclick = function() {startEdit(table, row, data._id)}
    editCell.appendChild(editBtn);

    var delBtn = document.createElement('button');
    delBtn.id = "deleteButton";
    delBtn.innerHTML = 'Delete'
    delBtn.onclick = function() {del(table, data._id)}
    delCell.appendChild(delBtn);
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
      console.log(array)
      array.forEach(element => updateTable(table, element))
    })
  }
