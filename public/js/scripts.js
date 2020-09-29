// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const memberTable = document.getElementById("membersB");
const Form = document.querySelector("form");

function clearTable() {
    var table = document.getElementById("membersB");
    for(var i = table.rows.length - 1; i > 0; i--){
      table.deleteRow(i);
    }
}

function addEntryToTable(jsonEntry) {
    //Find the table
    const tableBody = document.getElementById("membersB");
    //Insert a new row and then new cells
    let row = tableBody.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    //Fill those cells with the data gotten back from the server, this includes the new fields
    cell1.innerHTML = jsonEntry.nickname;
    cell2.innerHTML = jsonEntry.distance;
    cell3.innerHTML = jsonEntry.time;
    cell4.innerHTML = jsonEntry.date;
    cell5.innerHTML = jsonEntry.description;
}

// //fetch the initial form input
// fetch("/loadAll")
//   .then(response => response.json())
//   .then(entries => {
//     console.log(entries)
//   console.log("on load")
//     entries.forEach(e => addEntryToTable(e))
// });

//submit the new entry to the server and get the response to load on the table
const submit = function(event) {
  event.preventDefault();
  
  let entry = {
            nickname: document.querySelector( '#nickname').value,
            distance: document.querySelector( '#distance').value,
            time: document.querySelector( '#time').value,
            date: document.querySelector( '#date').value,
            description: document.querySelector( '#description').value
          }
  
  
  if(entry.nickname === ""|| entry.distance === "" || entry.time === "" || entry.date === ""){
        window.alert("All fields except for the description must be inputed");
        return false;
    }
  
  /*if(!parseDate(entry.dateofbirth)){
    window.alert("The date of birth must be in MM/DD/YYYY format");
    return false;
  }*/
  
  let body = JSON.stringify(entry);
  console.log(body)
  fetch('/add', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(json =>{
    console.log(json);
    //console.log("here");
    addEntryToTable(json);
  })
};


// const logOut = function(event){ 
//   event.preventDefault();
//   fetch('/logout')
//   .then(response =>{
//     console.log("logged out")
//     window.location.href= "
//   })
// }

const deleteAll = function(event){
  var r = confirm("Are you sure you want to delete everything?\nAll your data will be lost.");
  if(r == true){
    fetch('/deleteAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

window.onload = function() {
  const submB = document.getElementById('submitB')
  const delB = document.getElementById('deleteB')
  const logout = document.getElementById('logOut')
//  logout.onclick = logOut;
  delB.onclick = deleteAll;
  submB.onclick = submit;
}


// fetch the initial list of dreams
/*fetch("/dreams")
    .then(response => response.json()) // parse the JSON from the server
    .then(dreams => {
        // remove the loading text
        dreamsList.firstElementChild.remove();

        // iterate through every dream and add it to our page
        dreams.forEach(appendNewDream);

        // listen for the form to be submitted and add a new dream when it is
        dreamsForm.addEventListener("submit", event => {
            // stop our form submission from refreshing the page
            event.preventDefault();

            // get dream value and add it to the list
            let newDream = dreamsForm.elements.dream.value;
            dreams.push(newDream);
            appendNewDream(newDream);

            // reset form
            dreamsForm.reset();
            dreamsForm.elements.dream.focus();
        });
    });*/