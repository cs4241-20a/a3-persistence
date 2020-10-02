// client-side js, loaded by index.html
// run by the browser each time the page is loaded

//for strecahable background img
$(document).ready(function() {
  $(".header").height($(window).height());
});

// define variables that reference elements on our page
const taskList = document.getElementById("tasks");
const taskForm = document.querySelector("form");
let username = null;
window.onload = function() {
    username = window.location.search.split('=')[1]
    document.getElementById.innerText(username);
  }

// fetch the given user's tasks
  fetch("/tasks", {
    method: "POST",
    body: JSON.stringify({ username: username }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())

// Creates a list item for each task
//each list item contains an edit and delete button
function appendNewTask(task, id) {
  //create all list elements, including buttons for editing and deleting
  const newListItem = document.createElement("li");
  var deleteButton = document.createElement("button");
  var editButton = document.createElement("button");
  deleteButton.innerText = "X";
  editButton.innerText = "EDIT";

  //set the task textnode to the user input and append buttons
  let taskText = document.createTextNode(task);
  newListItem.appendChild(taskText);
  newListItem.appendChild(deleteButton);
  newListItem.appendChild(editButton);

  //deletes the text on the client and database
  deleteButton.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => newListItem.remove());
  };

  //edits the text and updates the database
  editButton.onclick = function() {
    var text;
    var editTask = prompt("Edit your task below.");

    fetch("/update", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        //delete text from list item
        taskText.remove();

        //assign a new text node
        taskText = document.createTextNode(editTask);

        //insert the list item before the buttons to maintain style
        newListItem.insertBefore(taskText, deleteButton);
      });
  };

  //append the new task to the task list
  taskList.appendChild(newListItem);
}


// listen for the form to be submitted and add a new task when it is
taskForm.addEventListener("submit", event => {
  // stop form submission from refreshing the page
  event.preventDefault();

  // get task value and add it to the list
  let newTask = taskForm.elements.task.value;

  fetch("/add", {
    method: "POST",
    //send username of whoever is logged in as well!!
    body: JSON.stringify({ task: newTask, username: username }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => appendNewTask(json.task, json._id));

  // reset form
  taskForm.reset();
  taskForm.elements.task.focus();
});



