// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")


const login = function(e) {
    e.preventDefault();

    let username = document.getElementById('username');
    let password = document.getElementById('password');

    const jsonObject = {
        username: username.value,
        password: password.value,
    }, body = JSON.stringify(jsonObject)
    
    if (username.value === '' || password.value == '') {
        window.alert("ERROR: Must Enter Username and Password!")
    
    } else {
        //window.alert("YO")
        fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body 
        })
        .then(function(response) {
            if (response.status === 200) {
                window.location.href="/main.html"
            
            } else {
                window.alert("Incorrect Username or Password!")
            }
        })
    }
    
    return false;
}


const signUp = function(e) {

    e.preventDefault();

    let username = document.getElementById('username')
    let password = document.getElementById('password')

    const jsonObject = {
        username: username.value,
        password: password.value,
    }, body = JSON.stringify(jsonObject)

    if (username.value === '1' || password.value == '1') {
        window.alert("ERROR: Must Enter Username and Password!")
    
    } else {
        fetch('/signUp', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body 
        })
        .then(function(response) {
            if (response.status === 200) {
                window.location.href="/main.html"
            
            } else {
                window.alert("Username Taken!")
            }
        })
    }
    
    return false;
}

window.onload = function() {
    const loginButton = document.getElementById('login');
    loginButton.onclick = login;

    const signupButton = document.getElementById('signUp');
    signupButton.onclick = signUp;


}