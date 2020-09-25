function submit(){
    let newPass = document.getElementById('password').value;
    body = JSON.stringify({password: newPass} );

    fetch( '/updatePassword', {
      method:'POST',
      body : body,
      headers:{
          "Content-Type": "application/json"
      }
    }).then(function(){
        fetch( '/logOut', {
            method:'POST'
          }).then(() => {
            window.open('/', "_self")
          })
    })
}


window.onload = function() {
    fetch( '/currentUser', {
        method:'GET'
    }).then(function(response){
        return response.json();
    }).then(function(json){
        let oldPass = document.getElementById('oldPass');
        oldPass.innerText = `Old password: ${json.pass}`;
    })
    const button = document.querySelector( 'button' );
    button.onclick = submit;
}
