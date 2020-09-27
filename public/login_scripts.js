const login = function( e ) {
  e.preventDefault();

  const username = document.querySelector("#username"),
     password = document.querySelector("#password"),
     json = { username: username.value, password: password.value},
     body = JSON.stringify(json);

  if(username.value.toString().trim() === '' || password.value.toString().trim() === ''){
    alert("Please enter a valid username and password");
    return false;
  }

  console.log(body)
  fetch('/login', {
    method:'POST',
    body: body,
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if(response.ok){
      window.location.href = "index.html"
    } else {
      throw new Error('Network response was not ok');
    }
  });
  return false
};

const logout = function (e) {
  fetch("/logout")
}

window.onload = function() {
  logout();
  const button = document.querySelector('button')
  button.onclick = login;

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

}
