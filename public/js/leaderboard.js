let table = document.getElementById("data_table");

function updateResults() {
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

    let time_seconds = element.laptime;

    let minutes = Math.floor(time_seconds / 60);
    let seconds = time_seconds - minutes * 60;

    seconds = seconds < 10 ? "0" + seconds.toFixed(3) : seconds.toFixed(3);

    addEntry(entry, minutes + ":" + seconds);

    const date = new Date(element.settime);

    addEntry(entry, date.toUTCString());

    let remove_td = document.createElement("TD");
    let remove_button = document.createElement("button");

    remove_button.innerText = "Invalidate Lap";
    remove_button.classList.add(
      "button",
      "is-small",
      "is-rounded",
      "is-danger"
    );

    if (element.mine) {
      remove_button.addEventListener("click", () =>
        removeEntry(entry, element._id)
      );
    } else {
      remove_button.disabled = true;
    }

    remove_td.appendChild(remove_button);
    entry.appendChild(remove_td);
  });
}

function removeEntry(entry, removeID) {
  console.log("Request to remove " + removeID);

  const lapObject = JSON.stringify({ lapID: removeID });

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
  new_data.innerHTML = value;

  entry.appendChild(new_data);
}

function scrollToTable() {
  table.scrollIntoView({ block: "center", behavior: "smooth" });
}
