
// define variables that reference elements on our page
const FishTable = document.getElementById("table1");
const Form = document.querySelector("form");

function clearFishTable(){
var FishTable = document.getElementById("table1"); 
for(var i = FishTable.rows.length - 1; i > 0; i--)
{
    FishTable.deleteRow(i);
}
  
}


// helper function to get current day 
  var curday = function(sp){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();

    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    return (mm+sp+dd+sp+yyyy);
    };
// a helper function that adds entries to the table
function addEntryToTable(json){
      // Create an empty <tr> element and add it to the 1st position of the table:
      var row = document.getElementById("table1").insertRow(1);
      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);

      // Add some text to the new cells:
      cell1.innerHTML = json.anglername;
      cell2.innerHTML = json.fishtype;
      cell3.innerHTML = json.lineclass;
      cell4.innerHTML = json.fishweight;
      cell5.innerHTML = json.date;
}

//fetch the initial list of dreams
fetch("/load")
  .then(response => response.json()) // parse the JSON from the server
  .then(entries => {
    console.log(entries)
  console.log("on load")
    entries.forEach(e => addEntryToTable(e));
  });


function sort_w(){
  var checkBox = document.getElementById("myCheck");
  var text = document.getElementById("text");
  if (checkBox.checked == true){
    fetch("/load")
  .then(response => response.json()) // parse the JSON from the server
  .then(entries => {
    console.log(entries)
    clearFishTable();
    entries = entries.sort((a, b) => parseFloat(a.fishweight) - parseFloat(b.fishweight))
    entries.forEach(e => addEntryToTable(e));
  });
  } else {
    fetch("/load")
  .then(response => response.json()) // parse the JSON from the server
  .then(entries => {
    console.log(entries)
    clearFishTable();
    entries.forEach(e => addEntryToTable(e));
  });
    
    
  }
  
}


const logOut = function(event){
  
  event.preventDefault();
  fetch('/logout')
  .then(response =>{
    console.log("logged out")
    window.location.href= "https://jcybul-a3-persistence.glitch.me/login"
  })
}

// submit the new entry to the server and get the response to load on the table 
const submit = function(event){

      event.preventDefault();
      
     let newEntry = {
                  fishtype: document.querySelector('#fishtype').value,
                  fishweight: document.querySelector('#fishweight').value,
                  lineclass: document.querySelector('#line').value,
                  date: curday('/')
                 }
     
       if(newEntry.fishtype === "" || newEntry.fishweight === "" || newEntry.lineclass === ""){
      window.alert('All of the fields must be filled');
        return false;
  }
        if(!parseInt(newEntry.fishweight) || !parseInt(newEntry.lineclass)){
          window.alert('Weight and line class fields must be numbers');
      return false;
  }
  
      let body = JSON.stringify(newEntry);
      console.log(body)
      fetch('/add',{
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
        })
      .then(response => response.json())
      .then(json =>{
        console.log(json);
        console.log("in here");
        addEntryToTable(json);
      })       

      // reset form
    };

// delete all data recorded 
const deleteall = function(event){
var r = confirm(" Are you sure you want to continue?\nAll your data will be deleted");
  if (r == true){
  fetch('/deleteAll',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
        })
  }
}

 window.onload = function() {
    const button = document.getElementById( 'submitBtn' )
    const delButton = document.getElementById('deleteButton')
    const logout = document.getElementById('logOut');
    delButton.onclick = deleteall;
    button.onclick = submit
 }