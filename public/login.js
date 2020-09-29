// client-side js, loaded by index.html
// run by the browser each time the page is loaded


// define variables that reference elements on our page
const login = document.querySelector("form");

 // listen for the form to be submitted and add a new dream when it is
login.addEventListener("submit", event => {
    event.preventDefault();
    fetch("/login", {
      method:'POST',
      body:JSON.stringify({"username":login.elements.email.value, "password":login.elements.password.value}),
      headers:{
      "Content-Type":"application/json"
      }
    })
})