// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("#dreamForm");

// a helper function that creates a list item for a given dream
function appendNewDream(dream, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream + " ";

  var delButton = document.createElement("button");
  delButton.innerText = "Delete";
  delButton.setAttribute("id", "Delete");
  delButton.setAttribute("class", "delete-button pure-button");
  newListItem.append(delButton);

  var editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.setAttribute("id", "Edit");
  editButton.setAttribute("class", "edit-button pure-button");
  newListItem.append(editButton);

  delButton.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ dream: dream }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newListItem.remove();
      });
  };

  editButton.onclick = function() {
    var newStr = prompt("Enter new text:", "New Text");
    if (newStr != null && newStr != undefined && newStr != "") {
      //send the string over
      var result = { oldText: dream, newText: newStr };
      fetch("/edit", {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json())
      .then( dreams =>{
        newListItem.innerText = newStr + " ";
        newListItem.append(delButton);
        newListItem.append(editButton);
      });
    }
  };

  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/dreams")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    dreamsList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  });

// listen for the form to be submitted and add a new dream when it is
dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  let newDream = dreamsForm.elements.dream.value;

  fetch("/add", {
    method: "POST",
    body: JSON.stringify({ dream: newDream }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      appendNewDream(json.dream, json._id);
    });

  // reset form
  dreamsForm.reset();
  dreamsForm.elements.dream.focus();
});
