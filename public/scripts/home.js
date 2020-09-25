window.onload = function () {
    let numUsers = document.getElementById('num-users');
  
    // get data from db about number of users
    fetch('/users/quantity').then(response => response.json()).then((numUsersObj) => {
      numUsers.innerText = `# fellow runners: ${numUsersObj.count}`;
    })
}