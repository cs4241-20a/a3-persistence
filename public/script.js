const tasksList = document.getElementById("tasks");
const tasksForm = document.querySelector("form");

// a helper function that creates a list item for a given tasks
function appendNewTask(tasks, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = tasks.name;

  newListItem.onclick = function(){
    fetch( '/delete', {
      method:'POST',
      body: JSON.stringify({ _id:tasks._id }), 
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then( response => response.json() )
    .then( json => {
      newListItem.remove()
     })
  }
  tasksList.appendChild(newListItem);
}

// fetch the initial list of tasks
fetch("/tasks")
  .then(response => response.json())
  .then(tasks => {
    tasksList.firstElementChild.remove() // removes loading
    tasks.forEach(appendNewTask);
});

// listen for the form to be submitted and add a new tasks when it is
tasksForm.addEventListener("submit", event => {
  event.preventDefault();

  let newTask = tasksForm.elements.tasks.value;

  fetch('/add', {
    method:'POST',
    body: JSON.stringify({ name:newTask }),
    headers:{
      'Content-Type':'application/json'
    }
  })
  .then( response => response.json() )
  .then( json => {
    appendNewTask( json.tasks, json._id  );
   })

  tasksForm.reset();
  tasksForm.elements.tasks.focus();
})
