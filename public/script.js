// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm_add = document.getElementById("add-dream");
const dreamsForm_change = document.getElementById("change-dream");
const loginForm = document.getElementById('login');

// a helper function that creates a list item for a given dream
function appendNewDream(dream, id) {
  const newListItem = document.createElement("li");
  newListItem.id = id
  newListItem.onclick = function () {
    fetch('/delete', {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        newListItem.remove()
      })
  }
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
}

// listen for the form to be submitted and add a new dream when it is
dreamsForm_add.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  fetch('/add', {
    method: 'POST',
    body: JSON.stringify({ dream: dreamsForm_add.elements.dream.value }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log('responds dream:' + json.dream)
      if (json.dream === 'already exists') {
        console.log('Element already exists')
        alert("You already have this dream");
      } else {
        appendNewDream(json.dream, json._id)
      }
    })

  // reset form
  dreamsForm_add.reset();
  dreamsForm_add.elements.dream.focus();
});

// listen for the form to be submitted and add a new dream when it is
dreamsForm_change.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  fetch('/change', {
    method: 'PUT',
    body: JSON.stringify({
      id: dreamsForm_change.elements.old_dream.value,
      name: dreamsForm_change.elements.new_dream.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json()
      .then(json => {

      }))

  // reset form
  dreamsForm_change.reset();
  dreamsForm_change.elements.old_dream.focus();
});


// fetch the initial list of dreams
fetch("/dreams")
  .then(response => response.json())
  // parse the JSON from the server
  .then(data => {
    console.log("Data: " + data)
    paresedData = JSON.parse(data)

    // remove the loading text
    dreamsList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    paresedData.forEach(element => {
      appendNewDream(element.dream, element._id)
    });
  });

function getInputsByValue(value) {
  var allInputs = document.getElementsByTagName("dreams");
  var results = [];
  for (var x = 0; x < allInputs.length; x++)
    if (allInputs[x].value == value) {
      console.log(allInputs[x])
      return (allInputs[x].id);
    } else {
      console.log('test')
    }
}