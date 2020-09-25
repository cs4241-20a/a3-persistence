const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const username = document.querySelector( '#username' ).value;
    const pass = document.querySelector( '#password' ).value;
    json = { username: username,
              password: pass};
    body = JSON.stringify( json );

    fetch( '/register', {
      method:'POST',
      body : body,
      headers:{
          "Content-Type": "application/json"
      }
    })
    .then(function(response){
      console.log(response)
      return  response.json()
    })
    .then( function( json ) {
        console.log(json)
        if (json.code == 'found'){
            alert('This username already exists')
        } else {
            window.open('/dataPage', "_self")
        }
    })

    return false;
}

window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submit;
}
