
const login = function( e ) {
    e.preventDefault();

    console.log("test")
    fetch( '/login/github', {
        method: 'GET',
        mode: 'no-cors',
    } )
    
    return false;
}

window.onload = function() {
    const button = document.querySelector( '#loginButton' )
    button.onclick = login
  }