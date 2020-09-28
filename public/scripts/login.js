

function verifyUser(username, password){
    fetch('/verify', {
        method:'POST',
        body:JSON.stringify({
            username: username,
            password: password
        }),
        headers : {
            "Content-Type":"application/json"
        }
    }).then( response => response.json())
        .then( json => {
            console.log(json);
            let newUrl = "/views/index.html?username="+json.result.username
            if (json.responseCode == 0){
                // created new account
                window.location.replace(newUrl+"&newUser=true")
            }
            else if (json.responseCode == -1){
                // incorrect username or password
                document.getElementById("fail").innerHTML
                     = "Incorrect Username and Password combo";
            }
            else if (json.responseCode == 1){
                // correct user name and password
                window.location.replace(newUrl+"&newUser=false")
            }
        })
}


window.onload = function(){
    let userForm = document.getElementById("username");
    let passForm = document.getElementById("password");

    let button = document.getElementById("submit");
    button.onclick = function(){
        verifyUser(userForm.value, passForm.value);
    }
    let gitButton = document.getElementById("gitButton");
    gitButton.onclick = function(){
        window.location.replace("/auth/github");
    }
}