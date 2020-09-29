// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
var dreamsList = document.getElementById("dreams");
var dreamsForm = document.querySelector("form");
var updateList = document.getElementById("update-list");
var loginForm = document.getElementById("loginForm");
var currentUser = null;


function newPage() {
  dreamsList = document.getElementById("dreams");
  dreamsForm = document.querySelector("form");
  updateList = document.getElementById("update-list");

  fetchAllTasks();
  addButton();
  
  fetch("/getCookie")
  .then(response => response.json)
  .then(json =>{
    console.log(json)
  })
}

function loadLoginPg() {
  loginForm = document.getElementById("loginForm");

  // listen for the form to be submitted and add a new dream when it is
  loginForm.addEventListener("submit", event => {
    console.log("trying to login");
    // stop our form submission from refreshing the page
    event.preventDefault();

    currentUser = loginForm.elements.username.value;
    console.log(currentUser);

    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username: currentUser }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      window.location = response.url;
      //currentUser = response.username;
      //console.log("currentUser:",currentUser)
    });
  });
}

//window.onload(newPage())

// a helper function that creates a list item for a given dream
function appendNewDream(item, id) {
  const statusOptions = ["Not Started", "Started", "Finished"];
  var selectList = document.createElement("select");
  //selectList.id= index;
  for (var i = 0; i < statusOptions.length; i++) {
    var option = document.createElement("option");
    option.value = statusOptions[i];
    option.text = statusOptions[i];
    if (item.status === statusOptions[i]) {
      option.selected = "selected";
    }
    selectList.appendChild(option);
  }

  selectList.onchange = function() {
    var currentStatus = selectList.options[selectList.selectedIndex].text;
    console.log("changed status");
    fetch("update", {
      method: "POST",
      body: JSON.stringify({ id, status: currentStatus }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json)
      .then(json => {
        console.log("updated", json);
      });
  };

  const newListItem = document.createElement("li");
  newListItem.innerText = item.dream;
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = " delete task ";

  deleteBtn.onclick = function() {
    fetch("remove", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json)
      .then(json => {
        newListItem.remove();
      });
  };
  dreamsList.appendChild(newListItem);
  newListItem.appendChild(deleteBtn);
  newListItem.appendChild(selectList);
}

// // fetch the initial list of dreams
function fetchAllTasks() {
  fetch("/tasks")
    .then(response => response.json()) // parse the JSON from the server
    .then(dreams => {
      // remove the loading text
      dreamsList.firstElementChild.remove();
      console.log("got dreams");
      console.log(dreams);
      // iterate through every dream and add it to our page
      for (var i = 0; i < dreams.length; i++) {
        appendNewDream(dreams[i], dreams[i]._id);
      }
      // dreams.forEach(appendNewDream);
      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    });
}

function addButton() {
  // listen for the form to be submitted and add a new dream when it is
  dreamsForm.addEventListener("submit", event => {
    // stop our form submission from refreshing the page
    event.preventDefault();
    console.log("attempting to add");

    fetch("add", {
      method: "POST",
      body: JSON.stringify({
        dream: dreamsForm.elements.dream.value,
        status: dreamsForm.elements.status.value,
        username: currentUser
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        appendNewDream(json, json._id);
      });
  });
}
