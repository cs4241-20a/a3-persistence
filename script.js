var users = [];
//var meetings = [];
var account = "guest"

//const meetingList = document.getElementById("meetings");
const login = document.querySelector("form");
const error = document.getElementById("error");
const github = document.getElementById("github");

function addUser(user, pass, id) {
  const newUser = document.createElement("li");
  newUser.innerText = user + " " + pass;
  
  users.push({
    "user": user,
    "pass": pass,
    "id": id
  });
}

login.addEventListener("submit", event => {
  event.preventDefault();

  let newUser = login.elements.username.value;
  let newPass = login.elements.password.value;
  
  let createAccount = true;
  
  users.forEach(user => {
    if(user.user.localeCompare(newUser) === 0) {
      createAccount = false;
      if(user.pass.localeCompare(newPass) === 0) {
        account = newUser;
        localStorage.setItem("account", newUser);
        document.location.href = "/schedule.html";
      }
      else {
        error.innerHTML = "<span class='label label-danger'>ERROR: Wrong Password for this Username</span>";
      }
    }
  })

  if(createAccount) {
    
    fetch("/add", {
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
        document.location.href = "/schedule.html";
      });
    
  }

  login.reset();
  login.elements.username.focus();
});

github.onclick = function() {
  localStorage.setItem("account", "github");
  document.location.href = `https://github.com/login/oauth/authorize?client_id=bbe908208af155698563`;
}

window.onload = function() {
  
  fetch("/users")
    .then(res => res.json())
    .then(json => {
      Array.from(json).forEach(user => addUser(user.user, user.pass, user._id))
    })
  
}