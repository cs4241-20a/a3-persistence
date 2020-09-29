window.onload = function() {
  const loginBtn = document.querySelector('#login-btn')
 // loginBtn.onclick = login;

  fetch("/auth/github", {
    method: "GET"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json.user) {
        fetch("/getAll", {
          method: "POST",
          body: { user: json.user }
        })
          .then(function(response) {
            return response.json();
          })   
      }
    });
};