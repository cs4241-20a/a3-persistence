var users = [];
var objects = []; //meetings
var account = "guest"

//const taskList = document.getElementById("tasks");
const login = document.querySelector("form");
//const error = document.getElementById("error");

function addUser(user, pass, id) {
  const newUser = document.createElement("li");
  newUser.innerText = user + " " + pass;
  
  users.push({
    "user": user,
    "pass": pass,
    "_id": id
  });
}

login.addEventListener("submit", event => {
  event.preventDefault();
  console.log("clicked")
  let newUser = login.elements.username.value;//login.elements.username.value;
  let newPass = login.elements.password.value;//login.elements.password.value;
  
  let createAccount = true;
  
  users.forEach(user => {
    if(user.user.localeCompare(newUser) === 0) {
      createAccount = false;
      if(user.pass.localeCompare(newPass) === 0) {
        account = newUser;
        localStorage.setItem("account", newUser);
        document.location.href = "/index.html";
        alert("Successfully logged in!")
      }
      else {
        alert("Incorrect Password for this  Username");
      }
    }
  })

  if(createAccount) {
    console.log("reached Fetch")
    fetch("/addUser", {
      method: "POST",
      body: JSON.stringify({ user: newUser, pass: newPass }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        addUser(json.user, json.pass, json._id);
        account = json.user;
        localStorage.setItem("account", newUser);
        document.location.href = "/index.html";
      });
    
  }
  login.reset();
  login.elements.username.focus();
});

window.onload = function() {
  
  fetch("/users")
    .then(res => res.json())
    .then(json => {
      Array.from(json).forEach(user => addUser(user.user, user.pass, user._id))
    })
  
    fetch("/tasks", {
    method: "POST",
    body: JSON.stringify({account}),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(json => {
      Array.from(json).forEach(task => add(task._id, task.user, task.yourtask, task.priority, task.creationdate))
    })
  
}