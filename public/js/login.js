const login = function(e) {
  
  e.preventDefault()
  
  const username = document.querySelector("#usr")
  const password = document.querySelector("#pwrd")
  
  if(username.value.toString().trim() == '' || password.value.toString().trim() == ''){
   alert("Please input both your username and password");
   return false;
 }
  
  let json = { 
    username: username.value,
    password: password.value
  }
  
  fetch( '/login', {
    method:'POST',
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( response => {
    if(response.status === 200) {
      window.location.href = "/"
    }
    else if(response.status === 206) {
      alert("You are already signed in. Redirecting you to the signed in account.")
      window.location.href = "/public/teamSheet.html"
    }
    else {
      alert("Incorrect Password, please try again.")
    }
  })
 return false
}


window.onload = function() {
  
  const loginButton = document.querySelector( "#loginButton" )
  loginButton.onclick = login
  
}