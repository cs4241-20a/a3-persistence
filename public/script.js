  
// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewDream(dream, price, department, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = department + ": " + dream + " $" + price;

  
  newListItem.onclick = function() {
    fetch('/delete',{
        method: 'POST',
        body: JSON.stringify({id}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then(response => response.json())
    .then(json => {
      newListItem.remove()
    })
  }
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
      let newPrice = dreamsForm.elements.price.value;
      let newDept = dreamsForm.elements.department.value;

      fetch('/add',{
        method: 'POST',
        body: JSON.stringify({dream: newDream, price: newPrice, department: newDept}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(json => {
         appendNewDream(json.dream, json.price, json.department, json._id);
      })
      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    });