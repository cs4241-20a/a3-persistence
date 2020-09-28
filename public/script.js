// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// function for getting the checked radio button
function displayChoiceVal() {
  var ele = document.getElementsByName("priority");

  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) return ele[i].value;
  }
}

//  var pencil = document.getElementById("edit");
// pencil.addEventListener("click", function(){
//   console.log("edit button clicked")
// });
    
//      var save = document.getElementById("save");
// save.addEventListener("click", function(){
//   console.log("save button clicked")
// });
// define variables that reference elements on our page

// const dreamsList = document.getElementById("dreams");
// reference to the list of tasks and refer to the form
const tasksList = document.getElementById("tasks");
const tasksForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewTask(task) {
  const newListItem = document.createElement("li");
  newListItem.contentEditable = true;
  const modifyButton = document.createElement("button");
 // modifyButton.setImageAttributes()
    modifyButton.innerHTML = "Save";
  newListItem.innerText =
    "TASK: " +
    String(task.yourtask) +
    "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "PRIORITY: " +
    String(task.priority) +
    "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "CREATION DATE: " +
    String(task.creationdate) +
    "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
    "DUE DATE: " +
    String(task.duedate);
  
  newListItem.ondblclick = function() {
    fetch("/delete", {
    method: "POST",
    body: JSON.stringify({id: task._id}),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      newListItem.remove()
    });
  }
  
  modifyButton.onclick = function updateTask(yourtask, priority, creationdate, duedate) {
    fetch("/update", {
    method: "POST",
    body: JSON.stringify({id: task._id, yourtask, priority, creationdate, duedate}),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      getRoster();
      return json;
    });
  }

  function login(e) {
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch('/login', {
      method: "POST",
      body: JSON.stringify({username, password}),
      headers: {
        "Content-Type":"application/json"
      }
    })
    .then(async function(response) {
      if (response.status === 200) {
        let json = await response.json();
        let username = json.username;
        getRoster();
      } 
      else {
        window.alert("Incorrect username or password");
      }
    });
}
  
  function getRoster(){
  fetch("/results", {
    method:"GET",
    headers: {
      "tasks": newListItem.innerText
    }
  })
  .then( response => response.json() )
  .then( json => {
  })
}
  
//   newListItem.onclick = function() {
//     fetch('/modify', {
//     method: "POST",
//     body: JSON.stringify({id: task._id}),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//     .then(response => response.json())
//     .then(json => {
//       var tasks = document.getElementById("tasks");
//         for(var i = 0; i < tasks.length; i++)
//           if(tasks[i].id.localeCompare() === 0)
//             tasks.splice(i, 1);
      
      
      
//     });
//   }
  
  var pencil = document.getElementById("edit");
pencil.addEventListener("click", function(){
  console.log("edit button clicked")
});
  
  tasksList.appendChild(newListItem);
  newListItem.appendChild(modifyButton);
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
    input2 = document.querySelector("#yourcreationdate"),
    input3 = displayChoiceVal(),
    json1 = {
      yourtask: input1.value,
      priority: input3,
      creationdate: input2.value
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


