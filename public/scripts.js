// Processes the JSON from the server and fills in the body of the HTML table
const processJSON = (json) => {
  const tasks = document.getElementById("tasks");
  tasks.innerHTML = "";
  json.forEach((task) => {
    tasks.innerHTML += `
    <tr>
      <td><textarea autocorrect="off" autocapitalize="off" spellcheck="false" contenteditable id="c-${task._id}">${
        task.courseName}</textarea>
      </td>
      <td><textarea autocorrect="off" autocapitalize="off" spellcheck="false" contenteditable id="t-${task._id}">${
        task.task}</textarea>
      </td>
      <td> <input class="tableInput" type='date' value=${task.dueDate} id="d-${task._id}">
      </td>
      <td><select class="tableInput" id="e-${task._id}">
          <option value="1" ${
            task.effort == "1" ? "selected" : null
          }>1</option>
          <option value="2" ${
            task.effort == "2" ? "selected" : null
          }>2</option>
          <option value="3" ${
            task.effort == "3" ? "selected" : null
          }>3</option>
          <option value="4" ${
            task.effort == "4" ? "selected" : null
          }>4</option>
          <option value="5" ${
            task.effort == "5" ? "selected" : null
          }>5</option>
        </select></td>
      <td>${
        task.priority
      }</td>
      <td><button class="deleteBtn" id="dlt-${task._id}">
        Delete</button> <br/>
        <button class="updateBtn" id="update-${task._id}">
          Update</button>
      </td>
    </tr>
    `;
  });
}

// Submit function to add new entries into the db
const submit = function(e) {
  e.preventDefault()
  checkLoggedIn()

  // Gets all the user inputs
  const input = document.querySelector('#courseName');
  const input2 = document.querySelector('#task');
  const input3 = document.querySelector('#dueDate');
  const input4 = document.querySelector('#effort');

  // alert the user tnat they need to specify all the data before adding a task
  if(input.value.toString().trim() == '' || input2.value.toString().trim() == '' || input3.value.toString().trim() == '' || input4.value.toString().trim() == '' ){
    alert("Please fill in all the fields before adding a new task");
    return false;
  }

  // create a json object with all the inputted data
  const json = {courseName: input.value, task : input2.value, dueDate : input3.value, effort : input4.value},
  body = JSON.stringify(json)

  // send the data to the server and then process all the data returned
  fetch('/add', {
    method:'POST',
    body: body,
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(json => processJSON(json));

  // clear the input values now that we have added the inputs to the table
  document.getElementById("courseName").value = "";
  document.getElementById("task").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("effort").value = "1";

  return false;
}

// Update function requests the server to update an entry in the DB
const updateTask = function (e) {
  e.preventDefault();
  checkLoggedIn()

  // get all the info for the table row being updated. Remove the leading "update-" from the id
  const id = e.target.getAttribute("id").substring(7),
        courseName =  document.querySelector(`#c-${id}`),
        task =  document.querySelector(`#t-${id}`),
        dueDate =  document.querySelector(`#d-${id}`),
        effort =  document.querySelector(`#e-${id}`)

  // create a json object with all the inputted data
  const json = {id, courseName: courseName.value, task: task.value, dueDate: dueDate.value, effort: effort.value},
  body = JSON.stringify(json);

  // send the data to the server and then process all the data returned
  fetch("/update", {
    method: "POST",
    body: body,
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(json => processJSON(json));

  return false;
}

// Delete function that requests the server to delete an etry from the DB based of the ID of teh entry
const deleteTask = function (e) {
  e.preventDefault();
  checkLoggedIn()

  // get the ID by removing the leading "dlt-"
  const id = e.target.getAttribute("id").substring(4);

  // create a json object with the id
  const json = {id},
  body = JSON.stringify(json);

  // send the data to the server and then process all the data returned
  fetch("/delete", {
    method: "POST",
    body: body,
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(json => processJSON(json));

  return false;
}

// Logout function request the user to be logged out and returns
// user to the login screen based on the response status code
const logout = function (e) {
  e.preventDefault();
  fetch("/logout")
  .then(function(response){
    if (response.status === 200){
        window.location.href = "/"
    }
  })
}

// CheckLoggedIn function that requests if a user is signed in
// If not, a 403 error will redirect the user to the login page
function checkLoggedIn(){
  fetch("/loggedIn")
  .then(function(response){
    if (response.status === 500) {
       window.location.href = "/"
     }
     else{
       return false
     }
  })
}

// Function that sets the tag for which user is logged in and if its a github user or not
const setUserName = (json) => {
  if(json.githubUser == true){
    document.getElementById("userTag").innerHTML = "Github User: " + json.user;
  }
  else {
    document.getElementById("userTag").innerHTML = "User: " + json.user;
  }
}

// Process what needs to be added / run whenever this page loads
window.onload = function() {
  // make sure the user is actually logged in and can view this page
  checkLoggedIn()

  // set the user tag
  fetch('/getUser')
    .then(response => response.json())
    .then(json => setUserName(json));

  // get all the tasks for the logged in the user and populate the table
  fetch('/appData')
    .then(response => response.json())
    .then(json => processJSON(json));

  // onClickListener for the add button
  const addBtn = document.getElementById('addBtn')
  addBtn.onclick = submit;

  // onClickListener for the logout button
  const logoutBtn = document.getElementById('logoutBtn')
  logoutBtn.onclick = logout;

  // onClickListeners to add the delete functionality to all the delete buttons
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList[0] == "deleteBtn") {
      deleteTask(e);
    }
  });

  // onClickListeners to add the update functionality to all the update buttons
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList[0] == "updateBtn") {
      updateTask(e);
    }
  });

  // reload the page on backpress so that it checks if you are still signed in
  window.addEventListener( "pageshow", function (e) {
    const wasBackPressed = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
    if (wasBackPressed) {
        window.location.reload();
    }
  });
}
