const dataParse = (json) => {
  const items = document.getElementById("items");
  items.innerHTML = "";
  json.forEach((item) => {
    var timeDue = moment(item._createdOn);

    const priorityMap = {
      high: 1,
      medium: 3,
      low: 5,
    };

    timeDue.add(priorityMap[item.priority] * 24, "hours");

    var now = moment();
    items.innerHTML += `
      <tr>
        <td></td>
        <td><textarea class="form-control" id="task-${item._id}">${
      item.task || "Unknown Task"
    }</textarea>
        <td><select class="form-control" id="priority-${item._id}">
          <option value="high" ${
            item.priority == "high" ? "selected" : null
          }>High</option>
          <option value="medium" ${
            item.priority == "medium" ? "selected" : null
          }>Medium</option>
          <option value="low" ${
            item.priority == "low" ? "selected" : null
          }>Low</option>
        </select></td>
        <td style="opacity:0.7">${timeDue.diff(now, "hours")} hours</td>
        <td><button class="saveButton btn btn-outline-success btn-sm btn-block" id="${
          item._id
        }-save">Save</button><div class="spacerMini"></div><button class="deleteButton btn btn-outline-danger btn-sm btn-block mt-1" id="${
      item._id
    }-delete">Delete</button></td>
      </tr>
      `;
  });
};

const loginProc = (json) => {
  console.log("user data", json);
  if (!json._id) return;

  document.getElementById("userInfo").setAttribute("style", "display:none");
  document.getElementById("profile").setAttribute("style", "");

  document.getElementById("loggedUsername").innerHTML = json.username;

  document.getElementById("loginPage").setAttribute("style", "display:none");
  document.getElementById("otherPages").setAttribute("style", "");

  fetch("/api/getData")
    .then((response) => response.json())
    .then((json) => dataParse(json));
};

const elementDisable = () => {
  document.body.setAttribute("style", "pointer-events:none;opacity:0.4");
};
const elementEnable = () => {
  document.body.setAttribute("style", "pointer-events:auto;opacity:1");
};

const delInput = (e) => {
  e.preventDefault();

  const id = e.target.getAttribute("id").split("-")[0];

  const json = {
      delete: true,
      id,
    },
    body = JSON.stringify(json);

  elementDisable();

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((response) => response.json())
    .then((json) => {

      dataParse(json);
      name.value = "";
      task.value = "";
      elementEnable();
    });

  return false;
};

const editEntry = (e) => {
  e.preventDefault();

  const id = e.target.getAttribute("id").split("-")[0];

  const task = document.querySelector(`#task-${id}`),
    priority = document.querySelector(`#priority-${id}`),
    json = {
      task: task.value,
      priority: priority.value,
      id,
    },
    body = JSON.stringify(json);
  elementDisable();
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((response) => response.json())
    .then((json) => {

      dataParse(json);
      name.value = "";
      task.value = "";
      elementEnable();
    });

  return false;
};

const submit = function (e) {

  e.preventDefault();

  const task = document.querySelector("#task"),
    priority = document.querySelector("#priority"),
    json = { name: name.value, task: task.value, priority: priority.value },
    body = JSON.stringify(json);

  elementDisable();
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((response) => response.json())
    .then((json) => {
      
      dataParse(json);
      task.value = "";
      elementEnable();
    });

  return false;
};

const logout = () => {
  fetch("/logout").then(() => {
    document.getElementById("userInfo").setAttribute("style", "");
    document.getElementById("profile").setAttribute("style", "display:none");

    document.getElementById("loggedUsername").innerHTML = "";

    document.getElementById("loginPage").setAttribute("style", "");
    document.getElementById("otherPages").setAttribute("style", "display:none");

    const items = document.getElementById("items");
    items.innerHTML = "";
  });
};
const login = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw "Invalid Username/Passwword";
      }
      return response.json();
    })
    .then((json) => loginProc(json))
    .catch((err) => {
      console.error(err);
      alert(err);
    });
};

window.onload = function () {
  const button = document.getElementById("addTask");
  button.onclick = submit;

  fetch("/api/getUser")
    .then( response => response.json() ) 
    .then( json => loginProc(json) ); 

  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList[0] == "deleteButton") {
      delInput(e);
    }
    if (e.target && e.target.classList[0] == "saveButton") {
      editEntry(e);
    }
    if (e.target && e.target.getAttribute("id") == "loginButton") {
      login();
    }
    if (e.target && e.target.getAttribute("id") == "logoutButton") {
      logout();
    }
  });
};
