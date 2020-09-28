// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm_add = document.getElementById("add-dream");
const dreamsForm_remove = document.getElementById("remove-dream");

// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
}


// listen for the form to be submitted and add a new dream when it is
dreamsForm_add.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  fetch('/add', {
    method: 'POST',
    body:JSON.stringify({dream:dreamsForm_add.elements.dream.value }),
    headers:{
      "Content-Type":"application/json"
    }
  })
  .then(response => response.json())
  .then(json => {
    appendNewDream( json.dream )
  })

  // reset form
  dreamsForm_add.reset();
  dreamsForm_add.elements.dream.focus();
});

//listen for the from to have a delete requenst
dreamsForm_remove.addEventListener('/delete', event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  fetch('/delete', {
    method: 'DELETE'
  })

})

// fetch the initial list of dreams
fetch("/dreams")
.then(response => response.json()) // parse the JSON from the server
.then(dreams => {
  // remove the loading text
  dreamsList.firstElementChild.remove();

  // iterate through every dream and add it to our page
  dreams.forEach(appendNewDream);
});