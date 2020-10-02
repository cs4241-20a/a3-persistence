//for strecahable background img
$(document).ready(function() {
  $(".header").height($(window).height());
});

//for login
const loginForm = document.getElementById("loginForm");
let username = "";
let  password = "";

//Log the user into their account
loginForm.addEventListener("login", event => {
    
  //get user's entered username and pass
  username = loginForm.elements.username.value;
  password = loginForm.elements.password.value;

  //perform login
  fetch("/login", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
    
});