const getData = (json) => {
  console.log(json);
  const tasks = document.getElementById("tasks");
  tasks.innerHTML = ""
  json.forEach((task) => {
    const shortID = task._id.substring(5)
    tasks.innerHTML+=`
    <tr>
      <td>${shortID}</td>
      <td>${task.name}</td>
      <td>${task.task}</td>
      <td>${task.priority}</td>
      <td>${task.deadline}</td>
      <td>
      <div class="spacerMini"></div>
      <button class="deleteButton" id="${task._id}">Delete</button>
      <div class="spacerMini"></div>
      <button class="updateButton" id="${task._id}">Update</button>
      </td>
      </tr>`
      ;
  });
};

const calculateDeadline = function(prio){
  var deadlineVal = 0;
  if(prio === "low"){
      deadlineVal+=4;
  }

  if(prio === "medium"){
    deadlineVal+=2;
  }

  if(prio === "high"){
      deadlineVal++;
  }
  console.log(deadlineVal + "days")
  var finalDeadline = moment().add(deadlineVal, "days").format("MM/DD/YYYY")
  return finalDeadline;
};

const submit = function( e ) {
  e.preventDefault();

  const name = document.querySelector("#taskName"),
     task = document.querySelector("#taskDesc"),
     priority = document.querySelector("#prio"),
     deadline = calculateDeadline(priority.value),
     json = { name: name.value, task: task.value, priority: priority.value, deadline: deadline},
     body = JSON.stringify(json);

  fetch( '/submit', {
    method:'POST',
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json() )
  .then(json => {
    getData(json);
    taskName.value = "";
    taskDesc.value = "";
  })
  return false
};

const updateTask = function( e ) {
  e.preventDefault();

  const tempID = e.target.getAttribute("id"),
     name = document.querySelector("#taskName"),
     task = document.querySelector("#taskDesc"),
     priority = document.querySelector("#prio"),
     deadline = calculateDeadline(priority.value),
     json = {tempID, name: name.value, task: task.value, priority: priority.value, deadline: deadline},
     body = JSON.stringify(json);

  fetch( '/submit', {
    method:'POST',
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json() )
  .then(json => {
    getData(json);
  })
  return false
};

const deleteTask = function (e) {
  e.preventDefault();
  const val = e.target.getAttribute("id");

  const json = {delete: 'delete', val},
  body = JSON.stringify(json);
  console.log(body);

  fetch("/submit", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(json => getData(json));

  return false;
};

const logout = function (e) {
  e.preventDefault();
  fetch("/logout")
  .then(response => {
    if (response.ok){
        window.location.href = "/"
    }
  })
}

window.onload = function() {
  const addBtn = document.getElementById('addBtn')
  addBtn.onclick = submit;

  const logoutBtn = document.getElementById('logoutBtn')
  logoutBtn.onclick = logout;

  fetch("/api/getData")
    .then(response => response.json())
    .then((json) => {
      getData(json)
    });

    document.addEventListener("click", function (e) {
    if (e.target && e.target.classList[0] == "deleteButton") {
      deleteTask(e);
    }
    });

    document.addEventListener("click", function (e) {
    if (e.target && e.target.classList[0] == "updateButton") {
      updateTask(e);
    }
    });
}
