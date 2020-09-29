// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
var newUser = "";

// const loginForm = document.getElementById("loginregister");
// const loginButton = document.getElementById("login");
// const signupButton = document.getElementById("signup");

// function for getting the checked radio button
function displayRadioValue() {
  var ele = document.getElementsByName("priority");

  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) return ele[i].value;
  }
}

// define variables that reference elements on our page

// const dreamsList = document.getElementById("dreams");
// reference to the list of tasks and refer to the form
const tasksList = document.getElementById("tasks");
const tasksForm = document.getElementById("todoform");

function updateTable(json) {
  const tableBody = document.getElementById("taskBody");
  let update = tableBody.insertRow(-1);

  let date = update.insertCell(0);
  let yourtask = update.insertCell(1);
  let priority = update.insertCell(2);
  let advice = update.insertCell(3);
  let remove = update.insertCell(4);
  let edit = update.insertCell(5);

  date.contentEditable = "true";
  yourtask.contentEditable = "true";
  priority.contentEditable = "true";
  advice.contentEditable = "true";

  var deleteButton = document.createElement("Button");
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener("click", function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id: json._id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        update.remove();
      });
  });

  var updateButton = document.createElement("Button");
  updateButton.innerHTML = "Update";
  updateButton.addEventListener("click", function() {
    fetch("/update", {
      method: "POST",
      body: JSON.stringify({ id: json._id, object: json }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        update.remove();
        updateTable(json);
      });
  });

  date.innerHTML = json.date;
  yourtask.innerHTML = json.yourtask;
  priority.innerHTML = json.priority;
  advice.innerHTML = json.message;
  remove.appendChild(deleteButton);
  edit.appendChild(updateButton);
}

// a helper function that creates a list item for a given dream
function appendNewTask(task) {
  const newListItem = updateTable(task);

  tasksList.appendChild(newListItem);
}

// fetch the initial list of tasks
fetch("/task")
  .then(response => response.json()) // parse the JSON from the server
  .then(tasks => {
    // remove the loading text
    tasksList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    tasks.forEach(appendNewTask);
  });
// listen for the form to be submitted and add a new dream when it is
tasksForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const input1 = document.querySelector("#yourtask"),
    input2 = document.querySelector("#taskduedate"),
    input3 = displayRadioValue(),
    json1 = {
      account,
      yourtask: input1.value,
      date: input2.value,
      priority: input3
    };

  // send information from the form to the server
  fetch("/add", {
    method: "POST",
    body: JSON.stringify(json1),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      appendNewTask(json);
    });

  // reset form
  tasksForm.reset();
  tasksForm.elements.yourtask.focus();
});

var users = [];
var meetings = [];
var account = "guest";

// const meetingList = document.getElementById("meetings");
const login = document.getElementById("login");
// const error = document.getElementById("error");

function addUser(user, pass, id) {
  const newUser = document.createElement("li");
  newUser.innerText = user + " " + pass;

  users.push({
    user: user,
    pass: pass,
    id: id
  });
}

function giveAdvice(newtask) {
  if (newtask["priority"] === "med_priority") {
      newtask["priority"] = "Medium";
      newtask["message"] =
        "Finish your high priority tasks first and then get to this!";
    }
    if (newtask["priority"] === "high_priority") {
      newtask["priority"] = "High";
      newtask["message"] = "Finish this task first!";
    }
    if (newtask["priority"] === "low_priority") {
      newtask["priority"] = "Low";
      newtask["message"] =
        "Make sure you finish this task but also take out some time for yourself :D";
    }
}
login.addEventListener("click", event => {
  event.preventDefault();

  let newUser = document.getElementById("loginregister").elements[0].value;
  let newPass = document.getElementById("loginregister").elements[1].value;

  let createAccount = true;

  users.forEach(user => {
    if (user.user.localeCompare(newUser) === 0) {
      createAccount = false;
      if (user.pass.localeCompare(newPass) === 0) {
        account = newUser;
        localStorage.setItem("account", newUser);
        alert("Successfully logged in!");
      } else {
        alert("Incorrect Username or Password");
      }
    }
  });

  if (createAccount) {
    fetch("/adduser", {
      method: "POST",
      body: JSON.stringify({ user: newUser, pass: newPass }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        addUser(json.user, json.pass, json._id);
        account = json.user;
        localStorage.setItem("account", newUser);
        alert("Successfully logged in!");
      });

    fetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ account: newUser }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        Array.from(json).forEach(task => appendNewTask(task));
      });
  }

  login.reset();
  login.elements.username.focus();
});
