const tasksForm = document.getElementById("form");
const button = document.getElementById("submit-button");

function createUser(){
    let username =  document.getElementById("username").value;
    let password = document.getElementById("password").value;
    alert('New user ' + username + ' sucessfully created.')
    window.location.href  = "/index.html"
}

if (button){
    button.addEventListener("click", (e) => {
       e.preventDefault();

        let username = tasksForm.username.value;
        let password = tasksForm.password.value;

        if (username !== null && password !== null){
            alert("Successfully logged in.")
            window.location = "index.html"
        }
    })
}