// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const crimesList = document.getElementById("crimes");
const crimesForm = document.querySelector("form");
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");
const cTable = document.getElementById("cTab");

// a helper function that creates a list item for a given dream
function buildTable(data) {
  let new_tbody = document.createElement('tbody');
  for(let i = 0; i < data.length; i++) {
    var newRow   = new_tbody.insertRow();
    
    // Insert a cell in the row at index 0
    newRow.insertCell(0).innerHTML = data[i].country;
    newRow.insertCell(1).innerHTML = data[i].year;
    newRow.insertCell(2).innerHTML = data[i].description;
    console.log(data[i]);
    //newRow.insertCell(3).innerHTML = data[i].country;
    //newRow.insertCell(4).innerHTML = data[i].country;
    
    // Append a text node to the cell
    //var newText  = document.createTextNode('New row');
    //newCell.appendChild(newText);
    
  }
  //document.getElementById("cTab").tBodies[0].innerHTML = new_tbody.innerHTML;
  //old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
  //const newListItem = document.createElement("li");
  //newListItem.innerText = data;
  //crimesList.appendChild(newListItem);
}

function appendNewCrime(dream) {
  const newListItem = document.createElement("li");
  const remButton = document.createElement("button");
  remButton.textContent = "Remove";
  const updButton = document.createElement("button");
  updButton.textContent="Update";
  newListItem.innerText = dream.country + " " + dream.year + " " + dream.description;
  console.log("Added");
  
  remButton.onclick = function() {
    fetch("/remove", {
      method: "POST",
      body: {"id" : dream._id},
      headers: {
         'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    })
  };
 /* updButton.onclick = function() {
    fetch("/update", {
      method: "POST",
      body: {
        "_id" : dream._id,
      }
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newListItem.remove();
      });
  };*/
  
  newListItem.appendChild(remButton);
  newListItem.appendChild(updButton);
  crimesList.appendChild(newListItem);
}

function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
}
// fetch the initial list of dreams
fetch("/crimes")
  .then(response => response.json()) // parse the JSON from the server
  .then(crimes => {
  var arr = Object.values(crimes);
  //buildTable(arr);
    // remove the loading text
    console.log(crimes)
    crimesList.firstElementChild.remove();
  arr.forEach(appendNewCrime);
  //for(let i = 0; i < crimes.length; i++) {
   // appendNewDream(crimes[i]);
  //}
    console.log("Given: ", crimes)
    // iterate through every dream and add it to our page
    //crimes.forEach(appendNewDream);
    //buildTable(crimes);
    // listen for the form to be submitted and add a new dream when it is
    
  });
