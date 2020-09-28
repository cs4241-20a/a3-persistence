// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const patronsForm = document.getElementById("patronForm");
const loginForm = document.getElementById("loginForm");

// listen for the form to be submitted and add a new dream when it is


loginForm.addEventListener("submit", event => {
  console.log("pleasenothere");
  const username = loginForm.elements.username.value;
  const password = loginForm.elements.password.value;
  event.preventDefault();
  fetch("/login", {
    method: "POST",
    body: JSON.stringify({
      username: loginForm.elements.username.value,
      password: loginForm.elements.password.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json === null) {
        fetch("/addUser", {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(window.location.replace("mainpage.html"));
      } else if (json.password === password) {
        window.location.replace("mainpage.html");
      } else {
        window.alert("Incorrect Password");
      }
    });
});
patronsForm.addEventListener("submit", event2 => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  console.log("HI2");
  fetch("/add", {
    method: "POST",
    body: JSON.stringify({
      firstName: patronsForm.elements.fname.value,
      lastName: patronsForm.elements.lname.value,
      age: patronsForm.elements.age.value,
      state: patronsForm.elements.state.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      addPatron(json);
    });
  // reset form
  patronsForm.reset();
  patronsForm.elements.fname.focus();
});

/*function appendTable(){
  fetch("/all",{
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => addPatron(response))
}*/

function addPatron(patrons) {
  var numAccessed = 1;
  let tableStart = 1;
  let initTable = document.getElementById("patrons");
  let rowCount = initTable.rows.length;
  for (var i = tableStart; i < rowCount; i++) {
    initTable.deleteRow(tableStart);
  }
  for (let patron in patrons) {
    let table = document.getElementById("patrons");
    let row = table.insertRow(numAccessed);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    cell0.innerHTML = patrons[patron].firstName;
    cell1.innerHTML = patrons[patron].lastName;
    cell2.innerHTML = patrons[patron].age;
    cell3.innerHTML = patrons[patron].state;
    cell4.innerHTML = "X";
    cell4.onclick = function() {
      fetch("/delete", {
        method: "POST",
        body: JSON.stringify({ id: patrons[patron]._id }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          table.deleteRow(this.parentNode.rowIndex);
        });
    };
    numAccessed++;
  }
}
