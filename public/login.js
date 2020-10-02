const loginForm = document.querySelector("form");
const createUserBtn = document.getElementById("create");
const username = document.getElementById("user");
const password = document.getElementById("pass");

// listener for the login button that checks user's
// credentials and brings them to their book list
loginForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // Creates a new JSON entry with the user and password
  // the user inputs
  const json = { username: username.value, password: password.value },
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
});

// listener for the create user button that
// takes the user created username and password
// and creates a new user account
createUserBtn.addEventListener("click", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // changes the label text and creates a new submit button
  const signUpBtn = document.createElement("button"),
    message = document.getElementById("message");

  loginForm.removeChild(document.getElementById("submit"));
  loginForm.appendChild(signUpBtn);
  signUpBtn.innerHTML = "Sign Up!";
  message.innerHTML = "Create User";

  // listener for the sign up button which
  // creates a new user
  signUpBtn.addEventListener("click", event => {
    // stop our form submission from refreshing the page
    event.preventDefault();

    // Creates a new JSON entry with the username
    // and password info
    const json = { username: username.value, password: password.value },
      body = JSON.stringify(json);

    fetch("/create", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
    window.location.href = "index.html";
  });
});
