

const login = function( e ) {
  e.preventDefault()
  const emailField = document.querySelector('#emailInput');
  const passwordField = document.querySelector('#passwordInput');
  
  var email = emailField.value;
  var password = passwordField.value;
  console.log("Login attempted with: " + email + " " + password);
  
  var data = {
    email: emailField.value,
    password: passwordField.value
  };
  
  fetch( '/login/account', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( data )
  }).then(function(response){
    window.location.href = '/mylists.html';
    console.log(response.username)
  })
   //window.location.href = '/mylists.html';
     //console.log(response.header)
   //});
}

const loginWithGitHub = function( e ) {
  e.preventDefault()
  window.location.href = '/login/github';
  //fetch("/login/github")
  
}


window.onload = function() {
    const githubButton = document.getElementById( 'githubLogin' );
    const submitButton = document.getElementById( 'submitLogin' );
    submitButton.onclick = login;
    githubButton.onclick = loginWithGitHub;

  }

