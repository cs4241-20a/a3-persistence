// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const logoutButton = document.getElementById("logout"),
  stressTable = document.getElementById("activitylist"),
  stressForm = document.querySelector("form");

logoutButton.addEventListener("click", event => {
  event.preventDefault();
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
  window.location.href = "login.html";
});

function addActivity(activity) {
  let newRow = stressTable.insertRow(-1),
    newLevel = newRow.insertCell(0),
    newTime = newRow.insertCell(1),
    newActivity = newRow.insertCell(2),
    editButton = newRow.insertCell(3),
    editElement = document.createElement("button"),
    deleteButton = newRow.insertCell(4);
  newLevel.innerHTML = activity.stress;
  newTime.innerHTML = activity.time;
  newActivity.innerHTML = activity.activity;
  editButton.appendChild(editElement);
  editElement.innerHTML = "edit";
  deleteButton.innerHTML = "x";
  let id = activity._id;
  // listener for the delete button to
  // remove a book
  deleteButton.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newRow.remove();
      });
  };

  editElement.onclick = function() {
    let updateButton = document.createElement("button"),
      levelInput = document.createElement("input"),
      timeInput = document.createElement("input"),
      activityInput = document.createElement("input");

    updateButton.innerHTML = "update";
    editButton.appendChild(updateButton);
    editButton.removeChild(editElement);
    levelInput.value = newLevel.innerHTML;
    timeInput.value = newTime.innerHTML;
    activityInput.value = newActivity.innerHTML;
    newLevel.innerHTML = "";
    newTime.innerHTML = "";
    newActivity.innerHTML = "";
    newLevel.appendChild(levelInput);
    newTime.appendChild(timeInput);
    newActivity.appendChild(activityInput);
    // listener for the update button to
    // update a book
    updateButton.onclick = function() {
      const json = {
          stress: levelInput.value,
          time: timeInput.value,
          activity: activityInput.value,
          id: id
        },
        body = JSON.stringify(json);
      fetch("/modify", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          newLevel.innerHTML = levelInput.value;
          newTime.innerHTML = timeInput.value;
          newActivity.innerHTML = activityInput.value;
          editButton.removeChild(updateButton);
          editButton.appendChild(editElement);
          newLevel.removeChild(levelInput);
          newTime.removeChild(timeInput);
          newActivity.removeChild(activityInput);
        });
    };
  };
}

function loadDB(item) {
  let newRow = stressTable.insertRow(-1),
    newLevel = newRow.insertCell(0),
    newTime = newRow.insertCell(1),
    newActivity = newRow.insertCell(2),
    editButton = newRow.insertCell(3),
    editElement = document.createElement("button"),
    deleteButton = newRow.insertCell(4),
    id = item._id;
  newLevel.innerHTML = item.stress;
  newTime.innerHTML = item.time;
  newActivity.innerHTML = item.activity;
  editButton.appendChild(editElement);
  editElement.innerHTML = "edit";
  deleteButton.innerHTML = "x";
  // listener for the delete button to
  // remove a book
  deleteButton.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newRow.remove();
      });
  };

  editElement.onclick = function() {
    let updateButton = document.createElement("button"),
      levelInput = document.createElement("input"),
      timeInput = document.createElement("input"),
      activityInput = document.createElement("input");

    updateButton.innerHTML = "update";
    editButton.appendChild(updateButton);
    editButton.removeChild(editElement);
    levelInput.value = newLevel.innerHTML;
    timeInput.value = newTime.innerHTML;
    activityInput.value = newActivity.innerHTML;
    newLevel.innerHTML = "";
    newTime.innerHTML = "";
    newActivity.innerHTML = "";
    newLevel.appendChild(levelInput);
    newTime.appendChild(timeInput);
    newActivity.appendChild(activityInput);
    // listener for the update button to
    // update a book
    updateButton.onclick = function() {
      const json = {
          stress: levelInput.value,
          time: timeInput.value,
          activity: activityInput.value,
          id: id
        },
        body = JSON.stringify(json);
      
      fetch("/modify", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          newLevel.innerHTML = levelInput.value;
          newTime.innerHTML = timeInput.value;
          newActivity.innerHTML = activityInput.value;
          editButton.removeChild(updateButton);
          editButton.appendChild(editElement);
          newLevel.removeChild(levelInput);
          newTime.removeChild(timeInput);
          newActivity.removeChild(activityInput);
          
        });
    };
  };
}
fetch("/activities")
  .then(response => response.json())
  .then(stress => {
    stress.forEach(loadDB);
  });

function getRadioValue() {
  const e = document.getElementsByName("stress");

  for (let i = 0; i < e.length; i++) {
    if (e[i].checked) {
      return e[i].value;
    }
  }
  return false;
}

stressForm.addEventListener("submit", event => {
  event.preventDefault();

  const level = getRadioValue(),
    time = document.getElementById("time"),
    json = { stress: level, time: time.value },
    body = JSON.stringify(json);
  fetch("/add", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      addActivity(json);
    });
  // reset form
  stressForm.reset();
});
