const processData = (json) => {
    const items = document.getElementById("items");
    items.innerHTML = "";

    json.forEach((item) => {

        const priorityMap = {
            high: 1,
            medium: 3,
            low: 5,
        };
        
        items.innerHTML += `
        <tr>
          <td><textarea class="form-control" id="task-${item._id}">${item.task || "Unknown Task"}</textarea>
          
          <td><select class="form-control" id="priority-${item._id}">
            <option value="high" ${item.priority == "high" ? "selected" : null
            }>High</option>
            <option value="medium" ${item.priority == "medium" ? "selected" : null
            }>Medium</option>
            <option value="low" ${item.priority == "low" ? "selected" : null
            }>Low</option>
          </select></td>
          
          <td><input class="form-control" type="date" id="date-${item._id}" value=${item.date}></td>
          
          <td><button class="saveButton btn btn-warning btn-sm btn-block" id="${item._id
            }-save">Save Changes</button><div class="spacerMini"></div><button class="deleteButton btn btn-info btn-sm btn-block mt-1" id="${item._id
            }-delete">Completed!</button></td>
        </tr>
        `;
    });
};

const processLogin = (json) => {
    console.log("user data", json);
    if (!json._id) return;

    document.getElementById("login").setAttribute("style", "display:none");
    document.getElementById("profile").setAttribute("style", "");

    document.getElementById("l-username").innerHTML = json.username;

    document.getElementById("loginGate").setAttribute("style", "display:none");
    document.getElementById("pages").setAttribute("style", "");

    fetch("/api/getData")
        .then((response) => response.json())
        .then((json) => processData(json));
};

const disableBody = () => {
    document.body.setAttribute("style", "pointer-events:none;opacity:0.4");
};
const enableBody = () => {
    document.body.setAttribute("style", "pointer-events:auto;opacity:1");
};
const deleteEntry = (e) => {
    e.preventDefault();

    const id = e.target.getAttribute("id").split("-")[0];

    const json = {
        delete: true,
        id,
    },
        body = JSON.stringify(json);

    disableBody();

    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body,
    })
        .then((response) => response.json())
        .then((json) => {
            // do something with the reponse
            processData(json);
            name.value = "";
            task.value = "";
            enableBody();
        });

    return false;
};

const editEntry = (e) => {
    e.preventDefault();

    const id = e.target.getAttribute("id").split("-")[0];

    const task = document.querySelector(`#task-${id}`),
        priority = document.querySelector(`#priority-${id}`),
        date = document.querySelector(`#date-${id}`),
        json = {
            task: task.value,
            priority: priority.value,
            date: date.value,
            id,
        },
        body = JSON.stringify(json);
    disableBody();
    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body,
    })
        .then((response) => response.json())
        .then((json) => {
            // do something with the reponse
            processData(json);
            name.value = "";
            task.value = "";
            date.value = "";
            enableBody();
        });

    return false;
};

const submit = function (e) {
    // prevent default form action from being carried out
    e.preventDefault();

    const task = document.querySelector("#task"),
        priority = document.querySelector("#priority"),
        date = document.querySelector("#dateID"),
        json = { name: name.value, task: task.value, priority: priority.value, date: date.value },
        body = JSON.stringify(json);

    disableBody();
    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body,
    })
        .then((response) => response.json())
        .then((json) => {
            // do something with the reponse
            processData(json);
            task.value = "";
            enableBody();
        });

    return false;
};

const logout = () => {
    fetch("/logout").then(() => {
        document.getElementById("login").setAttribute("style", "");
        document.getElementById("profile").setAttribute("style", "display:none");

        document.getElementById("l-username").innerHTML = "";

        document.getElementById("loginGate").setAttribute("style", "");
        document.getElementById("pages").setAttribute("style", "display:none");

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
        .then((json) => processLogin(json))
        .catch((err) => {
            console.error(err);
            alert(err);
        });
};

window.onload = function () {
    const button = document.getElementById("submitTicket");
    button.onclick = submit;

    // fetch("/api/getUser")
    //   .then((response) => response.json())
    //   .then((json) => processLogin(json));

    document.addEventListener("click", function (e) {
        if (e.target && e.target.classList[0] == "deleteButton") {
            deleteEntry(e);
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