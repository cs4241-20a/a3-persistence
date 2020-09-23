const tasksList = document.getElementById("tasks");
const tasksForm = document.querySelector("form");


// a helper function that creates a list item for a given tasks
function appendNewtasks(tasks) {
  const newListItem = document.createElement("li");
  newListItem.innerText = tasks;
  tasksList.appendChild(newListItem);
}

// fetch the initial list of tasks
fetch("/tasks")
  .then(response => response.json()) 
  .then(tasks => {
    tasksList.firstElementChild.remove();
    tasks.forEach(appendNewtasks);
});

// listen for the form to be submitted and add a new tasks when it is
tasksForm.addEventListener("submit", event => {
  event.preventDefault();
  
  fetch('/add', {
    method:'POST',
    body: JSON.stringify({ tasks:tasksForm.elements.tasks.value }),
    headers:{
      "Content-Type":"application/json"
    }
  })
  .then( response => response.json() )
  .then( json => {
    appendNewtasks( json.tasks );
   })

  tasksForm.reset();
  tasksForm.elements.tasks.focus();
})
