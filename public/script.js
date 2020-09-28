// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");

const loginForm = document.getElementById("loginForm");

// listen for the form to be submitted and add a new dream when it is

loginForm.addEventListener("submit", event => {
  console.log("pleasenothere");
  const username = loginForm.elements.username.value;
  const password = loginForm.elements.password.value;
  event.preventDefault();
  fetch("/login", {
    method: "POST",
    body: JSON.stringify({
      username: loginForm.elements.username.value,
      password: loginForm.elements.password.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json === null) {
        fetch("/addUser", {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(window.location.replace("mainpage.html"));
      } else if (json.password === password) {
        window.location.replace("mainpage.html");
      } else {
        window.alert("Incorrect Password");
      }
    });
});

