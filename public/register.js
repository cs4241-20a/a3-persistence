//for strecahable background img
$(document).ready(function() {
  $(".header").height($(window).height());
});

const regForm = document.getElementById("regForm");
let username = regForm.elements.username.value;
let password = regForm.elements.password.value;
let confirm_password = regForm.elements.confirm.value;

function validatePassword() {
  if (password != confirm_password) {
    confirm_password.setCustomValidity("Passwords don't match");
  } else {
    confirm_password.setCustomValidity("");
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

//Sign the user up and register them in the database collection "a3users"
regForm.addEventListener("submit", event => {
  username = regForm.elements.username.value;
  password = regForm.elements.password.value;
  confirm_password = regForm.elements.confirm.value;

  //send username and password to database
  fetch("/register", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
});
