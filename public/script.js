// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.getElementById("new-entry");
const changeForm = document.getElementById("edit-entry");

// a helper function that creates a list item for a given dream
function appendNewDream(dream, id ) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
  
  newListItem.onclick = function(){
    fetch('/delete', {
    method:'POST',
    body:JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( json => {
    newListItem.remove()
  })
    
  }
}

window.onload = function(){
  populateList();
}

function populateList(){
  dreamsList.innerHTML = "";
  fetch('/pop',{
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json'
        }
        })
  .then(response => response.json())
  .then(json => {
    for(var i=0; i< json.length; i++){
    appendNewDream(json[i].dream,json[i]._id)
    }
  })
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
   
})*/
dreamsForm.addEventListener("submit", event => {
   // stop our form submission from refreshing the page
   event.preventDefault();
  
  //get dream value and add it to the list
   let newDream = dreamsForm.elements.dream.value;
  
  fetch('/add', {
    method:'POST',
    body:JSON.stringify({dream:newDream }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json() )
  .then( json => {
    populateList()
  })
  
  //reset form
  dreamsForm.reset();
  dreamsForm.elements.dream.focus();
  
   
});

changeForm.addEventListener("submit", event => {
  event.preventDefault();
  
  let Old = changeForm.elements.current.value;
  let Updated = changeForm.elements.new.value;
  
  fetch('/edit', {
    method: 'POST',
    body:JSON.stringify({old: Old, new: Updated}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json() )
  .then(json => {
    populateList();
  })
  
  
  //reset form
  changeForm.reset();
})
