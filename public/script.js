// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
}

function redirect() {
    var privilege = document.getElementById('school-role').value;

    if(privilege == "Professor"){
        console.log(privilege);
        window.location = "./login.html";
    } else {
        window.location = "./student.html";
    }
}

function authLogged() {
  window.location = "./professor.html";
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
    const submit = function(e) {
      console.log("submitting");
      // stop our form submission from refreshing the page
      event.preventDefault();
      
      fetch("/add", {
        method:'POST',
        body:JSON.stringify({ dream:dreamsForm.elements.dream.value}),
        headers:{
          "Content-Type":"application/json"
        }
      })
      .then( response => response.json() )
      .then( json => {
        appendNewDream( json.dream );
      })

      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    };

    const remove = function(e){
      
      console.log("removing");
      
      // stop our form submission from refreshing the page
      event.preventDefault();
      
      fetch("/remove", {
        method:'delete',
        body:JSON.stringify({ dream:dreamsForm.elements.dream.value}),
        headers:{
          "Content-Type":"application/json"
        }
      })
      .then( response => response.json() )
      .then( dreams => {
        while( dreamsList.firstChild ){
          dreamsList.removeChild( dreamsList.firstChild );
        }
        
        // iterate through every dream and add it to our page
        dreams.forEach(appendNewDream);
      })

      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
      
    };

const modifty = function(e){
      
      console.log("modifying");
      
    };

window.onload = function() {
    var button = document.getElementById( 'delete-dream' );
    button.onclick = remove;
    button = document.getElementById( 'submit-dream' );
    button.onclick = submit;
    button = document.getElementById( 'mod-submit-dream' );
    button.onclick = modify;
  }