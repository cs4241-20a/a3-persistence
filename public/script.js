const submit = function(e) {
  document.getElementById("habitView").innerHTML = "";

  // prevent default form action from being carried out
  e.preventDefault();

  const habit = document.querySelector("#task"),
    weeks = document.querySelector("#weeks"),
    date =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate(),
    weekday = new Date(date).getDay();

  let days = [];
  for (let i = 0; i < weeks.value; i++) {
    days.push(new Array(7).fill("#"));
  }
  const json = {
      habit_name: habit.value,
      weeks: weeks.value,
      startDate: date,
      weekday,
      days
    },
    body = JSON.stringify(json);

  fetch("/submit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(function(json) {
      fetch("/getAll", {
        method: "POST",
        body: { user: json.user }
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          generateHabitArea(json);
        });
    });

  return false;
};

window.onload = function() {
  const submitBtn = document.querySelector("#submitBtn");
  submitBtn.onclick = submit;

  fetch("/getAuth", {
    method: "GET"
  })
    .then(function(response) {
     document.getElementById("habitView").innerHTML=""
      return response.json();
    })
    .then(function(json) {
      if (json.user) {
        document.getElementById("helloMsg").innerText = "Hello " + json.user + "!"
        fetch("/getAll", {
          method: "POST",
          body: { user: json.user }
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(json) {
            generateHabitArea(json);
          });
      }else{
        document.getElementById("habitView").innerHTML = "You need to log in!"
      }
    });
};

const generateTable = function(rowNum, id, days, weekday, startDate, idMongo) {
  let habitBlock = document.getElementById(id),
    table = document.createElement("table");
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  let row = table.insertRow();

  for (let i = 0; i < weekdays.length; i++) {
    let el = document.createElement("th");
    row.appendChild(el);
    el.innerText = weekdays[(parseInt(weekday) + i) % 7];
  }
  table.appendChild(row);

  for (let i = 0; i < rowNum; i++) {
    let row = table.insertRow();
    for (let j = 0; j < 7; j++) {
      let cell = row.insertCell();
      cell.className = "habitCell";
      cell.id = id + "_" + i + "_" + j;
      cell.onclick = function(e) {
        document.getElementById("habitView").innerHTML = "";
        let thisID = e.target.getAttribute("id");
        let newVal = "";

        switch (e.target.innerText) {
          case "#":
            newVal = "O";
            break;
          case "O":
            newVal = "X";
            break;
          case "X":
            newVal = "-";
            break;
          case "-":
            newVal = "#";
            break;
        }

        let json = {
          habit: idMongo,
          row: thisID.split("_")[2],
          col: thisID.split("_")[3],
          val: newVal
        };

        e.preventDefault();

        fetch("/edit", {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(json) {
            fetch("/getAll", {
              method: "POST"
            })
              .then(function(response) {
                return response.json();
              })
              .then(function(json) {
                generateHabitArea(json);
              });
          });
      };

      let text = document.createTextNode(days[i][j]);

      cell.style.border = "solid white ";
      switch (days[i][j]) {
        case "#":
          cell.style.backgroundColor = "#bfbfbf";
          cell.style.color = "#bfbfbf";
          break;
        case "O":
          cell.style.backgroundColor = "#689f39";
          cell.style.color = "#689f39";
          break;
        case "X":
          cell.style.backgroundColor = "#dd432f";
          cell.style.color = "#dd432f";
          break;
        case "-":
          cell.style.backgroundColor = "#7c9fb6";
          cell.style.color = "#7c9fb6";
          break;
      }
      cell.appendChild(text);
    }
    table.appendChild(row);
  }
  habitBlock.appendChild(table);

  startDate = new Date(startDate);
  let todayDate = new Date();
  let endDate = new Date();
  endDate.setTime(startDate.getTime());
  endDate.setDate(startDate.getDate() + days.length * 7);

  if (todayDate <= endDate && todayDate >= startDate) {
    let daysPassed = Math.ceil((todayDate - startDate + 1) / 86400000);
    let row = Math.floor(daysPassed / 7);
    let col = (daysPassed % 7) - 1;
    let todayCell = document.getElementById(id + "_" + row + "_" + col);
    todayCell.style.border = "solid #68696b";
  }
};

function generateHabitArea(json) {
  let habitView = document.getElementById("habitView");
  for (let i = 0; i < json.length; i++) {
    let div = document.createElement("div");
    div.id = "habit_" + i;
    div.className = "card medium";
    let h = document.createElement("h3");
    h.className = "habitName";
    let title = document.createTextNode(json[i].habit_name);
    h.appendChild(title);
    div.appendChild(h);
    habitView.appendChild(div);
    generateTable(
      json[i].weeks,
      div.id,
      json[i].days,
      json[i].weekday,
      json[i].startDate,
      json[i]._id
    );
    let delBtn = document.createElement("button");
    div.appendChild(delBtn);
    delBtn.innerText = "Delete";
    delBtn.className = "secondary";
    delBtn.id = "delBtn_" + i;
    delBtn.onclick = function() {
      fetch("/delete", {
        method: "POST",
        body: JSON.stringify({ id: json[i]._id }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          div.remove();
        });
    };
  }
}
