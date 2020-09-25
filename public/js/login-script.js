// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!")

function redirect() {
    let username = document.getElementById('username')
    let password = document.getElementById('password')

    const jsonObject = {
        username: username.value,
        password: password.value,
        signUp: false
    }, body = JSON.stringify(jsonObject)

    if (username.value === '' || password.value == '') {
        window.alert("ERROR: Must Enter Username and Password!")
    
    } else {
        fetch('/main', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body 
        })
        .then(function(response) {
            console.log(response.url)
            window.location.href = response.url + ".html";
        })
    }
    
}

function redirect2() {
    let username = document.getElementById('username')
    let password = document.getElementById('password')

    const jsonObject = {
        username: username.value,
        password: password.value,
        signUp: true
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
            if (response.status() === 200) {
                window.location.href = "/main.html";
            
            } else {
                window.alert("Username taken!")
            }
        })
    }
    
}