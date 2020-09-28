const tasksForm = document.getElementById("form");
const button = document.getElementById("submit-button");

let username =  document.getElementById("username").value;
let password = document.getElementById("password").value;

function createUser(){
    alert('New user ' + username + ' sucessfully created.')
    window.location.href  = "/index.html"
}

if (button){
    button.addEventListener("click", (e) => {
       e.preventDefault();
   })
}