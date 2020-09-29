// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsTable = document.getElementById("dreams2");
const yike = document.getElementById("dreams3");
const dreamsForm = document.getElementById("dreamsForm");
const loginForm = document.getElementById("loginForm");

//helper fucntion that creates a table row for a given dream
function appendNewDreamRow(dreamItem, id) {
  const newTableItem = document.createElement("tr");
  var cell1 = newTableItem.insertCell(0)
  var cell2 = newTableItem.insertCell(1)
  var cell3 = newTableItem.insertCell(2)
  var cell4 = newTableItem.insertCell(3)
  var cell5 = newTableItem.insertCell(4)
  cell1.innerText = dreamItem.dream;
  cell1.contentEditable = "true"
  cell2.innerText = dreamItem.scoops;
  cell3.innerText = dreamItem.sprinkles;
  cell4.innerText = 'DELETE'
  cell5.innerText = 'UPDATE'

  /* when a list item is clicked, delete that item from the db */
  cell4.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id:dreamItem._id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newTableItem.remove()
      });
  };
    
  
  cell5.onclick = function() {
    fetch("/update", {
      method: "POST",
      body: JSON.stringify({ id:dreamItem._id, dream:cell1.innerText}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        // newTableItem.remove()
        // appendNewDreamRow(json, json._id);
      });
  };
  
  dreamsTable.appendChild(newTableItem);
}

// fetch the initial list of dreams
fetch("/dreams", {
  method: "GET"
})
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
 
    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDreamRow);
  });
//   .catch(error => alert(error.message));


// listen for the form to be submitted and add a new dream when it is
dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  let newDream = dreamsForm.elements.dream.value;
  let numScoops = dreamsForm.elements.numScoops.value;
 
//   console.log( dreamsForm.elements.sprinkles.isChecked)
  // let sprinklesChoice = dreamsForm.elements.sprinkles.value;
  let sprinklesChoice
  if(dreamsForm.elements.sprinkles.checked){
    sprinklesChoice = 'yes'
  } else {
    sprinklesChoice = 'no'
  }
  
  fetch("/add", {
    method: "POST",
    body: JSON.stringify({ dream: newDream, scoops: numScoops, sprinkles: sprinklesChoice }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      appendNewDreamRow(json, json._id);
    });
  // reset form
  dreamsForm.reset();
  dreamsForm.elements.dream.focus();
});


// listen for the form to be submitted and add a new dream when it is
loginForm.addEventListener("submit", event => {
    // stop our form submission from refreshing the page
    event.preventDefault();
  
    // get dream value and add it to the list
    let userName = loginForm.elements.userName.value;
    let password = loginForm.elements.password.value;
    
    fetch("/add", {
      method: "GET",
      body: JSON.stringify({ userID: userName, password: password }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        appendNewDreamRow(json, json._id);
      });
    // reset form
    dreamsForm.reset();
    dreamsForm.elements.dream.focus();
  });


