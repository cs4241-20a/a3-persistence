// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
console.log("loaded");
fetch("/dreams", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    console.log(dreams);
    console.log(dreams.length);
    for (let i = 0; i < dreams.length; i++) {
      appendNewDream(dreams[i].dream, dreams[i]._id);
    }
  });

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewDream(dream, id) {
  const newListItem = document.createElement("li");
  let task = dream;
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");

  let span = "                                      ";
  editButton.innerHTML = "Edit";
  deleteButton.innerHTML = "X";

  newListItem.innerText = task + span;
  newListItem.appendChild(editButton);
  newListItem.appendChild(deleteButton);

  deleteButton.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
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
    let txt = "";
    var person = prompt("Enter your update");

    txt = person;

    if (txt === "" || person == null) {
      console.log("not a valid change");
    } else {
      fetch("/update", {
        method: "POST",
        body: JSON.stringify({ id, txt }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          newListItem.innerHTML = txt + span;
          newListItem.appendChild(editButton);
          newListItem.appendChild(deleteButton);
        });
    }
  };

  dreamsList.appendChild(newListItem);
}

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
