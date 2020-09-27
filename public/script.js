// define variables that reference elements on our page
const tasksList = document.getElementById("tasks");
const taskForm = document.querySelector("form");
const addButton = document.getElementById("addtask");
var savingID = "";

// Update from db when open the web
updatingFromDB();


function appendNewTask(task, priority, starttime, id) {
  // Create elements for new task list item
  const newListItem = document.createElement("li");
  const time = document.createElement("SPAN");
  const dl = document.createElement("SPAN");
  const ed = document.createElement("SPAN");
  
  // Setting up each element to get appropriate style
  time.innerText = getDueTime(starttime,priority);
  time.className = "time";
  dl.innerText = "x";
  dl.className = "close";
  ed.innerText = "edit";
  ed.className = "edit";
  
  // Append span items to list item
  newListItem.innerText = task;
  newListItem.append(time);
  newListItem.append(ed);
  newListItem.append(dl);
  
  // Click on 'x' to delete task
  dl.onclick = function() {
    fetch( '/delete', {
      method: 'POST',
      body:JSON.stringify({ id }),
      headers: {
        'Content-type': 'application/json' 
      }
    })
    .then( response => response.JSON)
    .then( json => newListItem.remove())
  }
  
  // Click on 'edit' to edit task
  ed.addEventListener( "click", function(){
    // Changing the form
    taskForm.elements.task.value = task;
    taskForm.elements.priority.value = priority;
    taskForm.elements.starttime.value = starttime;
    taskForm.elements.task.focus();
    // Changing the button and save the id of the task
    savingID = id;
    addButton.innerText = "Save";
    addButton.className = "save";
  });
  
  // Append list item to the list
  tasksList.appendChild(newListItem);
}

function updatingFromDB(){
// fetch the initial list of tasks
fetch("/tasks")
  .then(response => response.json())
  .then(tasks => {
    //tasksList.firstElementChild.remove();
    while(tasksList.firstChild) tasksList.removeChild(tasksList.firstChild);
    // iterate through every task and add it to our page
    tasks.forEach(function(task){appendNewTask(task.task, task.priority,task.starttime, task._id)});
  });
}

// listen for the form to be submitted and add a new task
  addButton.addEventListener("click", event => {
  // stop our form submission from refreshing the page
    event.preventDefault();

    // get task value and add it to the list
    let task = taskForm.elements.task.value,
        priority = taskForm.elements.priority.value,
        starttime = taskForm.elements.starttime.value;

    if(addButton.className == "submit"){
    fetch( '/add', {
      method: 'POST',
      body:JSON.stringify({ task: task, priority: priority, starttime: starttime }),
      headers: {
        'Content-type': 'application/json' 
      }
    })
    .then( response => response.json())
    .then( json => {
      appendNewTask( json.task, json.priority, json.starttime, json._id);
    })
    }else if(addButton.className == "save"){
      fetch( '/update', {
      method: 'POST',
      body:JSON.stringify({ task: task, priority: priority, starttime: starttime, id: savingID }),
      headers: {
        'Content-type': 'application/json' 
      }
    })
    .then( function updating(){
        addButton.className = "submit",
        addButton.innerText = "Add",
        updatingFromDB()})
    }
    
    // reset form
    taskForm.reset();
    taskForm.elements.task.focus();
  });

function getDueTime(startTime, prio){
  var dueTime;
  // If time not entered assume start time at 12:00
    if (startTime === ""){
      startTime = "12:00";
    }
    
    // Adding time based on priority
    switch(parseInt(prio)){
      case 1: dueTime = addTime(startTime,30); break;
      case 2: dueTime = addTime(startTime,60); break;
      case 3: dueTime = addTime(startTime,120); break;
      default: dueTime = startTime; break;
    }
    
    // Add due time to the object
  var finalString = "Start Time " +  startTime + " " + "Due Time " + dueTime;
    return finalString
}
    // Function to transfer start time to int and add time
    // return a string of edited time
    function addTime(startTime, addMin){
      var hour = parseInt(startTime.substring(0,2));
      var min = parseInt(startTime.substring(3,5));
      if(addMin ===30){
        if(min > 30){
          min-=30;
          hour++;
        }else{
          min+=addMin;
        }
      }else if(addMin === 60){
        hour++;
      }else if(addMin === 120){
        hour+=2;
      }
      if(hour>24){
        hour = 0;
      }
      var minString, hourString;
      if(min<10){
        minString = "0" + min.toString();
      }else{
        minString = min.toString();
      }
      if(hour<10){
        hourString = "0" + hour.toString();
      }else{
        hourString = hour.toString();
      }
      return hourString.toString() + ":" + minString.toString();
    }