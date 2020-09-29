
const login = e => {
    e.preventDefault()

    const name = document.querySelector('#userName');
    const pass = document.querySelector('#password');

    if(name.value.toString().trim() == '' || pass.value.toString().trim() === '') {
        alert("Please enter both a username and password.")
        return false
    }

    const json = {userName: name.value, password: pass.value},
    body = JSON.stringify(json)

    fetch('/login', {
        method:'POST',
        body,
        headers: {
            "Content-Type":"application/json"
        }
    })
    .then((res) =>{
        if(res.status === 200) {
            window.location.href = "index.html"
        }
        else if (res.status === 206) {
            alert("Already signed in. Redirecting")
            window.location.href = "index.html"
        }
        else {
            alert("Password incorrect, please try again")
        }

    })
}

window.onload = () => {
    const loginBtn = document.getElementById('loginBtn')
    loginBtn.onclick = login

    document.getElementById("userName").value = "";
    document.getElementById("password").value = "";
    // logout on back press
     window.addEventListener( "pageshow", function (e) {
    var wasBackPressed = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
    if (wasBackPressed) {
        window.location.reload();
    }
  });

}