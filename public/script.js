// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const taskList = document.getElementById("task");
const taskForm = document.querySelector("form");

// a helper function that creates a list item for a given task
function appendNewTask(task, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = task;

  //create a delete button
  var button = document.createElement("button");
  button.setAttribute("class", "button-small");
  button.innerHTML = "Delete";
  newListItem.appendChild(button);
  taskList.appendChild(newListItem);

  button.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log("deleted");
        newListItem.remove();
      });
  };

  
  //create an update button
  var button2 = document.createElement("button");
  button2.setAttribute("class", "button-small");
  button2.innerHTML = "Edit";
  newListItem.appendChild(button2);
  taskList.appendChild(newListItem);

  button2.onclick = function() {
    const newTask = prompt("What would you like to change the task to?")
    fetch("/update", {
      method: "POST",
      body: JSON.stringify({ id, task: newTask}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
      
        newListItem.remove();
      
        appendNewTask(newTask, id)
        
        console.log("updated");
      });
  };

  taskList.appendChild(newListItem);
}

// not necessary for current implementation

/*fetch("/task")
  .then(response => response.json()) // parse the JSON from the server
  .then(tasks => {
    // remove the loading text
    taskList.firstElementChild.remove();

    // iterate through every task and add it to our page
    tasks.forEach(appendNewTask);
  });*/

// listen for the form to be submitted and add a new taskwhen it is
taskForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get task value and add it to the list
  let newTask = taskForm.elements.task.value;

  fetch("/add", {
    method: "POST",
    body: JSON.stringify({ task: newTask }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      appendNewTask(json.task, json._id);
    });

  // reset form
  taskForm.reset();
  taskForm.elements.task.focus();
});
