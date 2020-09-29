// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");
//const resultsBtn = document.getElementById("results");

// a helper function that creates a list item for a given task
//have a task per specific users
function appendNewDream(dream, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  //const ul = document.getElementById("list");
  dreamsList.appendChild(newListItem);

  var Delbutton = document.createElement("button");
  Delbutton.setAttribute("class", "button-small");
  Delbutton.innerHTML = "Delete";
  newListItem.appendChild(Delbutton);
  dreamsList.appendChild(newListItem);

 Delbutton.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log("deleted");
        newListItem.remove();
      });
  };

  var UpdateButton = document.createElement("button");
  UpdateButton.setAttribute("class", "updateBtn");
  UpdateButton.innerHTML = "Update";
  newListItem.appendChild(UpdateButton);
  dreamsList.appendChild(newListItem);

  //do something with update here
  UpdateButton.onclick = function() {
    const newItem = prompt("Update your to-do item here:");
    fetch("/update", {
      method: "POST",
      body: JSON.stringify({ id, dreams: newItem }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newListItem.remove();

        appendNewDream(newItem, id);

        //console.log("updated");
      });
  };

  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dream
fetch("/dreams")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    dreamsList.firstElementChild.remove();

    // iterate through every task and add it to our page
    dreams.forEach(appendNewDream);
  });

// listen for the form to be submitted and add a new taskwhen it is
dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get task value and add it to the list
  let __newDream = document.querySelector("#dream").value;
  //let newDream = dreamsForm.elements[0].value;

  fetch("/add", {
    method: "POST",
    body: JSON.stringify({ dreams: __newDream }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      appendNewDream(json.dreams, json._id);
    });
    // reset form
    dreamsForm.reset();
    //dreamsForm.elements.dreams.focus();
  });



