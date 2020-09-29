const signInForm = document.querySelector("form");
//const path = require('path')


signInForm.addEventListener("submit", event => {
  
  event.preventDefault()
  
  var x = JSON.stringify({ user:signInForm.elements.user.value })
  console.log(x)
  console.log("Checked? " + signInForm.elements.check.checked)

  fetch("/signin", {
    method: "POST",
    body: JSON.stringify({ user: signInForm.elements.user.value, 
                          password: signInForm.elements.password.value,
                         check: signInForm.elements.check.checked }),
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log(json.value)
      if(json.value == true)
        window.location = 'https://a3-nikhil-chintada.glitch.me/signin'
      else if (json.value == false) {
        var display = document.getElementById("errorText")
        display.innerHTML = "Wrong Password! Try Again."
      }
      else {
        var display = document.getElementById("errorText")
        display.innerHTML = "User does not exist. Make a new account!"
      }
    })
}) 