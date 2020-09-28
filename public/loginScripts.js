
// Function that request for the user to be logged in with their inputted credentials
const login = function(e) {
  // prevent default form action from being carried out
  e.preventDefault()

  // Gets all the user inputs fpr userName and password
  const input = document.querySelector('#userName');
  const input2 = document.querySelector('#password');


  // alert the user that they need to specify both a username and a password
  if(input.value.toString().trim() == '' || input2.value.toString().trim() == ''){
    alert("Please input both a username and a password.");
    return false;
  }

  // create a json object with all the inputted data
  const json = {userName: input.value, password: input2.value},
  body = JSON.stringify(json)

  // send the data to the server, on a successful login, redirect to the main todo page
  // if not, alert the user that their password was wrong
  // if a user is already signed in, redirect to that signed in account
  fetch('/login', {
    method:'POST',
    body: body,
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(async function(response) {
        if (response.status === 200) {
           window.location.href = "index.html"
         }
         else if (response.status == 206) {
           await alert("You are already signed in. Redirecting you to the signed in account.")
           window.location.href = await "index.html"
         }
         else {
           alert("Password is incorect, please try again.")
         }
       })

  return false;
}

//Function that requets the user to be logged out
function logout(){
    fetch("/logout")
}

// Process what needs to be added / run whenever this page loads
window.onload = function() {

  // log the user out when this page is loaded to prevent issues
  logout()

  // onClickListener for the login button
  const loginBtn = document.getElementById('loginBtn')
  loginBtn.onclick = login

  // reset the input fields on reload
  document.getElementById("userName").value = "";
  document.getElementById("password").value = "";

  //reload the page on backpress so that it signs you out on entering this screen
  window.addEventListener( "pageshow", function (e) {
    var wasBackPressed = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
    if (wasBackPressed) {
        window.location.reload();
    }
  });
}
