let table = document.getElementById("data_table");

let editResult = document.getElementById("edit_result");
let updateEditButton = document.getElementById("update_edit_button");
let cancelEditButton = document.getElementById("cancel_edit_button");
let fullnameEdit = document.getElementById("fullname_edit");
let teamnameEdit = document.getElementById("teamname_edit");

function checkField(field) {
  if (field.value.length == 0) {
    field.classList.add("is-danger");
    return false;
  } else {
    field.classList.remove("is-danger");
    return true;
  }
}

function updateResults() {
  startLoad();

  fetch("/results", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      createTable(json.results);
    });
}

updateResults();

function startLoad() {
  table.innerHTML = "<i class='mx-2 my-2 fas fa-sync fa-spin'></i>";
}

cancelEditButton.onclick = () => {
  editResult.classList.remove("is-active");
};

function createTable(dataJSON) {
  table.innerHTML = "";

  dataJSON.forEach((element, place) => {
    let entry = document.createElement("TR");

    table.appendChild(entry);

    if (element.mine) {
      entry.classList.add("has-text-weight-bold");
    }

    addEntry(entry, "P" + (place + 1));

    addEntry(entry, element.username);

    addEntry(entry, element.fullname);

    addEntry(entry, element.teamname);

    addEntry(entry, element.laptime);

    const date = new Date(element.settime);

    addEntry(entry, date.toUTCString());

    let modify_td = document.createElement("TD");
    let remove_button = document.createElement("button");
    let edit_button = document.createElement("button");

    remove_button.innerText = "Invalidate Lap";
    remove_button.classList.add(
      "button",
      "is-small",
      "is-rounded",
      "is-danger"
    );

    edit_button.innerText = "Edit Info";
    edit_button.classList.add(
      "mr-2",
      "mb-2",
      "button",
      "is-small",
      "is-rounded",
      "is-info"
    );

    if (element.mine) {
      remove_button.addEventListener("click", () => removeEntry(element._id));
      edit_button.addEventListener("click", () =>
        editEntry(element._id, element.fullname, element.teamname)
      );
    } else {
      remove_button.disabled = true;
      edit_button.disabled = true;
    }

    modify_td.appendChild(edit_button);
    modify_td.appendChild(remove_button);
    entry.appendChild(modify_td);
  });
}

function editEntry(editID, fullname, teamname) {
  console.log("Request to edit " + editID);

  fullnameEdit.value = fullname;
  teamnameEdit.value = teamname;
  editResult.classList.add("is-active");

  updateEditButton.onclick = () => {
    if (checkField(fullnameEdit) && checkField(teamnameEdit)) {
      const lapObject = JSON.stringify({
        id: editID,
        fullname: fullnameEdit.value,
        teamname: teamnameEdit.value,
      });

      editResult.classList.remove("is-active");

      startLoad();

      fetch("/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: lapObject,
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          createTable(json.results);
        });
    }
  };
}

function removeEntry(removeID) {
  console.log("Request to remove " + removeID);

  const lapObject = JSON.stringify({ lapID: removeID });

  startLoad();

  fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: lapObject,
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      createTable(json.results);
    });
}

function addEntry(entry, value) {
  let new_data = document.createElement("TD");
  new_data.textContent = value;

  entry.appendChild(new_data);
}

function scrollToTable() {
  table.scrollIntoView({ block: "center", behavior: "smooth" });
}
