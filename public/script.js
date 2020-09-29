// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const submitButton = document.getElementById("submit-dream");
const logButton = document.getElementById("logout")
const userText = document.getElementById("userInput")

// a helper function that creates a list item for a given dream
function appendNewDream(dream, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  newListItem.onclick = function() {
    if(userText.value === ""){
      deleteItem(id);
      newListItem.remove();
    }
    else{
      editItem(id);
      newListItem.innerText = userText.value;
    }
  };
  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams
function getItems() {
  fetch("/items", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json()) // parse the JSON from the server
    .then(dreams => {
      // remove the loading text

      // iterate through every dream and add it to our page
      console.log("Items in database:");
      console.log(dreams);
      //dreams.forEach(appendNewDream("test", "test"));
      for (var i = 0; i < dreams.length; i++) {
        appendNewDream(dreams[i].dream, dreams[i]._id);
      }
    });
}

function editItem(id){
  
  let newEdit = userText.value;
  
  fetch("/edit", {
    method: "POST",
    body: JSON.stringify({ dream: newEdit, id }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {});
}

function deleteItem(id) {
  fetch("/delete", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {});
}

// listen for the form to be submitted and add a new dream when it is
submitButton.addEventListener("click", function(){
  // stop our form submission from refreshing the page
  event.preventDefault();

  let newDream = userText.value;
  let user = "testuser"; //this will be the user's username

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
  userText.value = "";
});

logButton.addEventListener("click", function(){
  event.preventDefault();
  fetch("/logout", {
    method: "POST",
    body: JSON.stringify({logout:userText.value}),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
  window.location.href = "/";
});

window.onload = function() {
  getItems();
};