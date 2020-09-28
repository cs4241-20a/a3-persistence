var allData = [
  {
    date: "2020-09-13",
    track: "NHMX",
    race: "Female",
    place: "8"
  }
];

const submit = function(e) {
  let i;
  // prevent default form action from being carried out
  e.preventDefault();

  const date = document.querySelector("#date").value,
    race = document.querySelector("#race").value,
    place = document.querySelector("#place").value,
    track = document.getElementsByName("track");

  let trackValue = null;
  for (i = 0; i < track.length; i++) {
    if (track[i].checked) {
      trackValue = track[i].value;
      break;
    }
  }

  if (!date || !trackValue || !race || !place) {
    alert("All fields are required to submit a new race result.");
  } else {
    const json = {
        date: date,
        track: trackValue,
        race: race,
        place: place
      },
      body = JSON.stringify(json);
    fetch("/submit", {
      method: "POST",
      body
    })
      .then(function(response) {
        return response.text();
      })
      .then(function(text) {
        allData.push(JSON.parse(text));
        updateTable();
      });
  }
  document.querySelector("#date").value = "mm/dd/yyyy";
  document.querySelector("#race").value = "";
  document.querySelector("#place").value = "";
  document.querySelector("#capeway").checked = false;
  document.querySelector("#crowhill").checked = false;
  document.querySelector("#mx207").checked = false;
  document.querySelector("#nhmx").checked = false;
  document.querySelector("#southwick").checked = false;
  document.querySelector("#winchester").checked = false;
  return false;
};

window.onload = function() {
  const subBut = document.querySelector("#submit");
  subBut.onclick = submit;
  updateTable();
};

const del = function(e) {
  e.preventDefault();
  console.log("Delete");
  allData.splice(Number(e.target.id.substring(1)), 1);
  updateTable();
};

const mod = function(e) {
  e.preventDefault();
  console.log("Edit");

  let obj = allData[Number(e.target.id.substring(1))];
  document.querySelector("#date").value = obj.date;
  document.querySelector("#race").value = obj.race;
  document.querySelector("#place").value = obj.place;

  document.querySelector("#capeway").checked = false;
  document.querySelector("#crowhill").checked = false;
  document.querySelector("#mx207").checked = false;
  document.querySelector("#nhmx").checked = false;
  document.querySelector("#southwick").checked = false;
  document.querySelector("#winchester").checked = false;
  document.querySelector("#" + obj.track).checked = true;

  allData.splice(Number(e.target.id.substring(1)), 1);
  updateTable();
};

function updateTable() {
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < allData.length; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 6; j++) {
      let cell = document.createElement("td");
      let text;
      switch (j) {
        case 0:
          text = document.createTextNode(allData[i].date);
          break;
        case 1:
          text = document.createTextNode(allData[i].track);
          break;
        case 2:
          text = document.createTextNode(allData[i].race);
          break;
        case 3:
          text = document.createTextNode(allData[i].place);
          break;
        case 4:
          text = document.createElement("Button");
          break;
        case 5:
          text = document.createElement("Button");
          break;
      }
      if (j === 4) {
        text.innerHTML = "Edit";
        text.id = "E" + i.toString();
        text.onclick = mod;
      }

      if (j === 5) {
        text.innerHTML = "Delete";
        text.id = "D" + i.toString();
        text.onclick = del;
      }
      cell.appendChild(text);
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
}
