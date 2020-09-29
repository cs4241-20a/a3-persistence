//LOGIN INFORMATION
const userField = document.querySelector("#username");
const passField = document.querySelector("#password");

document.getElementById("login-button").addEventListener("click", function() {
  const username = userField.value;
  const password = passField.value;
  console.log("Username: " + username + " Password: " + password);
  userField.value = "";
  passField.value = "";

  //Talk to server
  fetch("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
  .then(users => {
    console.log(users)
    if(users.length == 0){
      window.alert("Username or password is incorrect.")
    }
    else{
      window.location.href = "/index.html";
    }
  })
});

document.getElementById("create-button").addEventListener("click", function() {
  const username = userField.value;
  const password = passField.value;
  fetch("/create", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
  window.location.href = "/index.html";
});