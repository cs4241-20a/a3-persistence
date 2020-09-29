form = document.getElementById("login_form")
button = document.getElementById("login_btn")
username = document.getElementById("name")
password = document.getElementById("pass")
box = document.getElementById("box")

button.onclick = function(e) {

    e.preventDefault()

    fetch( '/login', {
        method:'POST',
        body:JSON.stringify({
            'username':username.value,
            'password':password.value,
            'auth':box.checked
        }),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then( response => response.json())
    .then( json => {
        switch (json.message){
            case "new":
                alert("New Player!")
                window.location.replace("/games")
                break
            case "existed":
                alert("Old Player!")
                window.location.replace("/games")
                break
            case "wrong password":
                alert("Wrong Password! Try Again!")
                break
            case "liar":
                alert("NO YOU ARE NOT ADMIN XD")
                break
            case "admin":
                alert("Entering Admin Page")
                window.location.replace("/admin")
                break
            default:
                alert("Error Happened")
                break
        }
    })
        
}