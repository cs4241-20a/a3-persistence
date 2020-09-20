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
      return  response.text()
    })
    .then( function( nick ) {
    })

    return false;
}

window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit;
}
