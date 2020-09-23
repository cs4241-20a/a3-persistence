const submit = function( e ) {
    // prevent default form action from being carried out
   e.preventDefault()

    const username = document.querySelector( '#username' ).value;
    const pass = document.querySelector( '#password' ).value;
    json = { username: username,
              password: pass};
    body = JSON.stringify( json );

    fetch( '/login', {
      method:'POST',
      body : body,
      headers:{
          "Content-Type": "application/json"
      }
    })
    .then(function(response){
      console.log(response)
      if (response.redirected == true){
        window.open(response.url, "_self")
      } else {
        return  response.json()
      }
      
    })
    .then( function( json ) {
      let errmsg = document.getElementById('errormsg');
      if (json.error == 'password'){
        errmsg.innerText = "Password Incorrect"
      } else { //username not found
        errmsg.innerText = "Username not found"
      }
    })

    return false;
}

window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit;
}
