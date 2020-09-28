// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");

const loginForm = document.getElementById("login");

if(loginForm){
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
    let username = loginForm.elements.username.value;
    let password = loginForm.elements.password.value;
      console.log(username);
      console.log(password);
    fetch("/login", {
       method: "POST", 
       body: JSON.stringify({username, password}),
       headers: {
          "Content-Type": "application/json"
        }
    }).then(response => response.json())
      .then(json => {
        console.log(json)
      });
    window.location.href = "https://a3-saniya-syeda.glitch.me/login"
  }
)};


// a helper function that creates a list item for a given dream
function appendNewDream(dream, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  newListItem.contentEditable = "true";
  
  newListItem.ondblclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(json => {
      newListItem.remove()
    });
  };
  
  newListItem.addEventListener('input', function (evt){
    evt.preventDefault();
    dream = newListItem.innerText
    fetch("/modify", {
      method: "POST",
      body: JSON.stringify({ dream, id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
  });

    dreamsList.appendChild(newListItem);

}

// // fetch the initial list of dreams
// fetch("/dreams")
//   .then(response => response.json()) // parse the JSON from the server
//   .then(dreams => {
//     // remove the loading text

//     // iterate through every dream and add it to our page
//     dreams.forEach(appendNewDream);
//   });

// listen for the form to be submitted and add a new dream when it is

const dreamsForm = document.querySelector("form");
dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  if(dreamsForm.elements.dream){
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
  }
});


