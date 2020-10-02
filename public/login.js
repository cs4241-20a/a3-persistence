const loginForm = document.querySelector("form");
const newUserButton = document.getElementById("signup");
const username = document.getElementById("user");
const password = document.getElementById("pass");

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  
  const json = { username: username.value, 
             password: password.value },
    body = JSON.stringify(json);
  
  fetch("/login", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(user => {
      if (user.length == 0) {
        window.alert("Username or password is incorrect");
      } else {
        window.location.href = "index.html";
      }
    });
})

newUserButton.addEventListener("click", event => {
  event.preventDefault();
  const signUpButton = document.createElement("button");
  
  
  loginForm.removeChild(document.getElementById('submit'))
  loginForm.appendChild(signUpButton)
  signUpButton.innerHTML = 'Sign Up!'
  
  signUpButton.addEventListener('click', event => {
    // stop our form submission from refreshing the page
    event.preventDefault();
    // Creates a new JSON entry with the username
    // and password info
    const username = document.getElementById("user"),
      password = document.getElementById("pass"),
      json = { username: username.value, password: password.value },
      body = JSON.stringify(json);
    fetch("/create", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      window.location.href = "index.html"
  });
})

