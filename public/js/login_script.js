const submitChanges = function( e ) {
    const form = new FormData(document.getElementById('form'))
    let newUser = null;

    fetch( '/register', {
        method: 'POST',
        body: form
    })
        .then( response => response.json())
        .then( function(response) {
            console.log(response)
            if(response.isNewUser){
                window.alert("A new user has been created")
            }
            newUser = response.newUser;
        }).then(function () {
            fetch('/login', {
                method: 'POST',
                body: newUser
            }).then(response => {
              // window.location = respons
            })
    })

    return false
}

window.onload = function() {
    const button = document.querySelector( 'button' )
    button.onclick = submitChanges
}