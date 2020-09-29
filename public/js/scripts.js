// Add some Javascript code here, to run on the front end.

const submit = function( e ) {
// prevent default form action from being carried out
	e.preventDefault()
	
	/*
	const description = document.querySelector( '#description' ),
	weight = document.querySelector( '#weight' ),
	deliv_date = document.querySelector( '#deliv_date' ),
	*/
	
	var newpackage = {
		description: document.querySelector( '#description' ).value,
		weight: Math.abs(document.querySelector( '#weight' ).value),
		deliv_date: Math.abs(document.querySelector( '#deliv_date' ).value),
		price: Math.abs(document.querySelector( '#weight' ).value) + 20*(1/(1 + Math.abs(document.querySelector( '#deliv_date' ).value)))
	} 
	
const description = document.querySelector( '#description' ),
          weight = document.querySelector( '#weight' ),
          deliv_date = document.querySelector( '#deliv_date' ),
          table = document.querySelector( '#package_table'),
          json = { description: description.value , weight: weight.value , deliv_date: deliv_date.value , price: Math.abs(document.querySelector( '#weight' ).value) + 20*(1/(1 + Math.abs(document.querySelector( '#deliv_date' ).value)))}
  
  //Check for no input
  if(newpackage.description.value == "" || newpackage.weight.value == "" || newpackage.deliv_date.value == "") {
      console.log("No input for required field");
      return;
  }
  
  console.log(json)
	/*
	json = { yourname: input.value },
	body = JSON.stringify( json )
	*/
	/**const body = JSON.stringify( newpackage )
	console.log(body);
	var new_row = table.insertRow(1);
	var new_desc = new_row.insertCell(0);
	var new_weight = new_row.insertCell(1);
	var new_days = new_row.insertCell(2);
	var new_cost = new_row.insertCell(3);
	
	new_desc.innerHTML = newpackage.description;
	new_weight.innerHTML = newpackage.weight;
	new_days.innerHTML = newpackage.deliv_date;
	new_cost.innerHTML = "$" + newpackage.price.toFixed(2);
	**/
	
  fetch('/submit', {
    method: 'POST',
    body:JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json() )
  .then(json => {
    results(table, json);
  })

	return false
	
}

const results = function(table, newpackage) {
  
  var new_row = table.insertRow(-1);
	var new_desc = new_row.insertCell(0);
	var new_weight = new_row.insertCell(1);
	var new_days = new_row.insertCell(2);
	var new_cost = new_row.insertCell(3);
  var editCell = new_row.insertCell(4);
  var deleteCell = new_row.insertCell(5);
 
  
  new_desc.innerHTML = newpackage.description;
	new_weight.innerHTML = newpackage.weight;
	new_days.innerHTML = newpackage.deliv_date;
	new_cost.innerHTML = "$" + newpackage.price.toFixed(2);
  

    var editBtn = document.createElement('button');
    editBtn.id = "editButton";
    editBtn.onclick = function() {modify(table, new_row, newpackage._id)}
    editCell.appendChild(editBtn);

    var delBtn = document.createElement('button');
    delBtn.id = "deleteButton";
    delBtn.onclick = function() {remove(table, newpackage._id)}
    deleteCell.appendChild(delBtn);
  }

const modify = function( table, row, id) {
    const description = document.querySelector( '#description' ),
          weight = document.querySelector( '#weight' ),
          deliv_date = document.querySelector( '#deliv_date' ),
          button = document.querySelector( '#submitButton' );
    
    description.value = row.cells[0].innerHTML;
    weight.value = row.cells[1].innerHTML;
    deliv_date.value = row.cells[2].innerHTML;

    button.onclick = function() {edit( description, weight, deliv_date, table, id, button)}

    return false;
  }

const edit = function ( description, weight, deliv_date, table, id, button) {

    
    button.onclick = submit

    
    if(description.value == "" || weight.value == "" || deliv_date.value == "") {
      console.log("Required field empty");
      return;
    }

    const json = { _id: id, descrition: description.value , weight: weight.value , deliv_date: deliv_date.value , price: Math.abs(weight) + 20*(1/(1 + Math.abs(deliv_date)))}
   

    fetch( '/edit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    })
    .then( response => response.json() )
    .then (array => {
      for(var i = 1; i < table.rows.length; i++) {
        table.deleteRow(1);
      }

      console.log(array)

      array.forEach(element => results(table, element))
    })

    return false;
  }

const remove = function( table, id ) {
    
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
      for(var i = 1; i < table.rows.length; i++) {
        table.deleteRow(1);
      }

      array.forEach(element => results(table, element))
    })

    const button = document.querySelector( '#submitButton' );
    button.onclick = submit

    return false;
  }


window.onload = function() {
	const button = document.getElementById( 'submitButton' )
	button.onclick = submit
  
  const table = document.querySelector( '#package_table' )
    fetch( '/appdata', {
      method:'GET'
    })
    .then( response => response.json() )
}

console.log("Welcome to assignment 2!")