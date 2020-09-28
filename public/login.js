const loginButton = document.getElementById("loginButton");

loginButton.onclick = function() {
  //console.log("login")
  const un = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/index", {
    method: "POST",
    body: JSON.stringify({
      username: un,
      password: password
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => {
    window.location = response.url
    
  });
};