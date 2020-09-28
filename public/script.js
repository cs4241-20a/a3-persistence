// Add some Javascript code here, to run on the front end.

const currentId = [];
const liveAccounts = [];

function getAccounts() {
  fetch("/recieve", {
    method: "GET"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.forEach(item => {
        if (!liveAccounts.includes(item._id)) {
          liveAccounts.push(item._id);
        }
      });
    });
  return false;
}

function register() {
  if (
    document.getElementById("inputEmail3").value == "" ||
    document.getElementById("inputPassword3").value == ""
  ) {
    alert("You must enter a correct Username/Password");
  }
  const json = {
    username: document.getElementById("inputEmail3").value,
    password: document.getElementById("inputPassword3").value
  };
  fetch("/register", {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      liveAccounts.push(json._id);
    });
}

function login() {
  var username = document.getElementById("inputEmail3").value;
  var password = document.getElementById("inputPassword3").value;
  const json = {
    username,
    password
  };
  fetch("/login", {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(async function(response) {
    if (response.status === 200) {
      let json = await response.json();
      document.location.href = "/app.html";
    }
    else{
      alert("Incorrect Login Info")
    }
  });
}

function parseDate(dateStr) {
  var date = dateStr.split("-");
  return new Date(date[2], date[0] - 1, date[1]);
}

function calcPrio(fdate, sdate) {
  var distance = Math.round((sdate - fdate) / (1000 * 60 * 60 * 24));
  if (distance >= 1 && distance <= 7) {
    return 10;
  } else if (distance >= 8 && distance <= 14) {
    return 9;
  } else if (distance >= 15 && distance <= 21) {
    return 8;
  } else if (distance >= 22 && distance <= 30) {
    return 7;
  } else if (distance >= 31 && distance <= 45) {
    return 6;
  } else if (distance >= 46 && distance <= 60) {
    return 5;
  } else if (distance >= 61 && distance <= 90) {
    return 4;
  } else if (distance >= 91 && distance <= 120) {
    return 3;
  } else if (distance >= 121 && distance <= 210) {
    return 2;
  } else if (distance >= 211) {
    return 1;
  } else {
    return "Error";
  }
}
function checkDateForm(str) {
  if (str.match("^[-0-9]")) {
    var check = str.split("-");
    console.log(check[2]);
    if (check[2].length == 4 && check[2] <= 9999) {
      if (check[0] - 1 <= 12) {
        if (check[1] <= 31) {
          return true;
        }
      }
    }
    return false;
  } else {
    return false;
  }
}

function createDone() {
  var doneButton = document.createElement("input");
  doneButton.type = "button";
  doneButton.value = "Done";
  doneButton.onclick = function() {
    doneRow(this);
  };
  return doneButton;
}

function createEdit() {
  var editButton = document.createElement("input");
  editButton.type = "button";
  editButton.value = "Edit";
  editButton.onclick = function() {
    editRow(this);
  };
  return editButton;
}

function createDelete() {
  var deleteButton = document.createElement("input");
  deleteButton.type = "button";
  deleteButton.value = "Delete";
  deleteButton.onclick = function() {
    deleteRow(this);
  };
  return deleteButton;
}

function doneRow(row) {
  var index = row.parentNode.parentNode.rowIndex;
  var str = row.parentNode.parentNode.children;
  var pName, pDesc, pSDate, pEDate, pPrio, pButton, end;
  var pN, pD, pS, pE, pP;
  for (var i = 0; i < 6; i++) {
    if (i == 0) {
      pName = str[i].children[0];
      if (pName.value == "") {
        end = "<td>" + pName.placeholder + "</td>";
        pN = pName.placeholder;
      } else {
        end = "<td>" + pName.value + "</td>";
        pN = pName.value;
      }
    } else if (i == 1) {
      pDesc = str[i].children[0];
      if (pDesc.value == "") {
        end = end + "<td>" + pDesc.placeholder + "</td>";
        pD = pDesc.placeholder;
      } else {
        end = end + "<td>" + pDesc.value + "</td>";
        pD = pDesc.value;
      }
    } else if (i == 2) {
      pSDate = str[i].children[0];
      if (pSDate.value == "") {
        end = end + "<td>" + pSDate.placeholder + "</td>";
        pS = pSDate.placeholder;
      } else {
        end = end + "<td>" + pSDate.value + "</td>";
        pS = pSDate.value;
      }
    } else if (i == 3) {
      pEDate = str[i].children[0];
      console.log(pEDate.value);
      if (pEDate.value == "") {
        end = end + "<td>" + pEDate.placeholder + "</td>";
        pE = pEDate.placeholder;
      } else {
        end = end + "<td>" + pEDate.value + "</td>";
        pE = pEDate.value;
      }
    } else if (i == 4) {
      pPrio = str[i].children[0];
      if (pPrio.value == "") {
        end = end + "<td>" + pPrio.placeholder + "</td>";
        pP = pPrio.placeholder;
      } else {
        end = end + "<td>" + pPrio.value + "</td>";
        pP = pPrio.value;
      }
    } else if (i == 5) {
      end =
        end +
        "<td> <input type='button' value = 'Delete' onclick='deleteRow(this)'> <input type='button' value = 'Edit' onclick='editRow(this)'> <input type='button' value = 'Done' onclick='doneRow(this)'></td>";
    }
  }
  row.parentNode.parentNode.innerHTML = end;
  const json = {
    pName: pN,
    pDesc: pD,
    pSDate: pS,
    pEDate: pE,
    pPrio: pP,
    id: currentId[index - 1]
  };
  fetch("/update", {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function editRow(row) {
  var index = row.parentNode.parentNode.rowIndex;
  var str = row.parentNode.parentNode.innerHTML;
  var pName, pDesc, pSDate, pEDate, pPrio, pButton, end, yea;
  for (var i = 0; i < 6; i++) {
    if (i == 0) {
      var pName = str.slice(str.indexOf("<td>"), str.indexOf("</td>"));
      str = str.replace(pName, "");
      str = str.replace("</td>", "");
      pName = pName.replace("<td>", "");
      end =
        "<td><input type='text' id='pN'onfocus='this.value = '''  placeholder = '" +
        pName +
        "'></td>";
    } else if (i == 1) {
      var pDesc = str.slice(str.indexOf("<td>"), str.indexOf("</td>"));
      str = str.replace(pDesc, "");
      str = str.replace("</td>", "");
      pDesc = pDesc.replace("<td>", "");
      end =
        end +
        "<td><input type='text' id='pD'onfocus='this.value = '''  placeholder = '" +
        pDesc +
        "'></td>";
    } else if (i == 2) {
      var pSDate = str.slice(str.indexOf("<td>"), str.indexOf("</td>"));
      str = str.replace(pSDate, "");
      str = str.replace("</td>", "");
      pSDate = pSDate.replace("<td>", "");
      end =
        end +
        "<td><input type='text' id='pS'onfocus='this.value = '''  placeholder = '" +
        pSDate +
        "'></td>";
    } else if (i == 3) {
      var pEDate = str.slice(str.indexOf("<td>"), str.indexOf("</td>"));
      str = str.replace(pEDate, "");
      str = str.replace("</td>", "");
      pEDate = pEDate.replace("<td>", "");
      end =
        end +
        "<td><input type='text' id='pE'onfocus='this.value = '''  placeholder = '" +
        pEDate +
        "'></td>";
    } else if (i == 4) {
      var pPrio = str.slice(str.indexOf("<td>"), str.indexOf("</td>"));
      str = str.replace(pPrio, "");
      str = str.replace("</td>", "");
      pPrio = pPrio.replace("<td>", "");
      end =
        end +
        "<td><input type='text' id='pP'onfocus='this.value = '''  placeholder = '" +
        pPrio +
        "'></td>";
    } else if (i == 5) {
      var pButton = str.slice(str.indexOf("<td>"), str.indexOf("</td>"));
      str = str.replace(pButton, "");
      str = str.replace("</td>", "");
      pButton = pButton.replace("<td>", "");
      end =
        end +
        "<td> <input type='button' value = 'Delete' onclick='deleteRow(this)'> <input type='button' value = 'Edit' onclick='editRow(this)'> <input type='button' value = 'Done' onclick='doneRow(this)'></td>";
    }
  }
  row.parentNode.parentNode.innerHTML = end;
}

function deleteRow(row) {
  var index = row.parentNode.parentNode.rowIndex;
  document.getElementById("projectTable").deleteRow(index);
  console.log(index);
  fetch("/delete", {
    method: "POST",
    body: JSON.stringify({ id: currentId[index - 1] }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      currentId.pop(index);
    });
}

function fillTable() {
  document.getElementById("status").innerHTML = "";
  if (
    !checkDateForm(document.getElementById("pSDate").value) ||
    !checkDateForm(document.getElementById("pEDate").value)
  ) {
    document.getElementById("status").innerHTML = "Invalid Date";
    console.log("error");
    return false;
  }
  var tableRef = document.getElementById("projectTable");
  var newRow = tableRef.insertRow();
  var prio;
  for (var i = 0; i < 6; i++) {
    var newCell = newRow.insertCell(i);
    if (i == 0) {
      var newText = document.createTextNode(
        document.getElementById("pName").value
      );
    } else if (i == 1) {
      var newText = document.createTextNode(
        document.getElementById("pDesc").value
      );
    } else if (i == 2) {
      var newText = document.createTextNode(
        document.getElementById("pSDate").value
      );
    } else if (i == 3) {
      var newText = document.createTextNode(
        document.getElementById("pEDate").value
      );
    } else if (i == 4) {
      var startDate = parseDate(document.getElementById("pSDate").value);
      var endDate = parseDate(document.getElementById("pEDate").value);
      prio = calcPrio(startDate, endDate);
      var newText = document.createTextNode(prio.toString());
    }
    if (i == 5) {
      newCell.appendChild(createDelete());
      newCell.appendChild(createEdit());
      newCell.appendChild(createDone());
    } else {
      newCell.appendChild(newText);
    }
  }
  return prio;
}

function clearInput() {
  document.getElementById("pName").value = "";
  document.getElementById("pDesc").value = "";
  document.getElementById("pSDate").value = "";
  document.getElementById("pEDate").value = "";
}

function clearTable() {
  while (document.getElementById("projectTable").rows.length > 1) {
    document.getElementById("projectTable").deleteRow(1);
  }
}

function fillTableGet(contents) {
  var tableRef = document.getElementById("projectTable");
  var newRow = tableRef.insertRow();
  for (var i = 0; i < Object.keys(contents).length - 1; i++) {
    var newCell = newRow.insertCell(i);
    if (i == 0) {
      var newText = document.createTextNode(contents.pName);
    } else if (i == 1) {
      var newText = document.createTextNode(contents.pDesc);
    } else if (i == 2) {
      var newText = document.createTextNode(contents.pSDate);
    } else if (i == 3) {
      var newText = document.createTextNode(contents.pEDate);
    } else if (i == 4) {
      var newText = document.createTextNode(contents.pPrio);
    }
    if (i == 5) {
      newCell.appendChild(createDelete());
      newCell.appendChild(createEdit());
      newCell.appendChild(createDone());
    } else {
      newCell.appendChild(newText);
    }
  }
}

const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  var end = fillTable();
  if (!end) {
    return;
  }

  const projectName = document.querySelector("#pName"),
    projectDesc = document.querySelector("#pDesc"),
    projectSDate = document.querySelector("#pSDate"),
    projectEDate = document.querySelector("#pEDate"),
    json = {
      pName: projectName.value,
      pDesc: projectDesc.value,
      pSDate: projectSDate.value,
      pEDate: projectEDate.value,
      pPrio: end.toString(),
      pButton: [createDelete(), createEdit(), createDone()]
    },
    body = JSON.stringify(json);

  fetch("/add", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());

  clearInput();
  location.reload();
  return false;
};

const get = function(e) {
  fetch("/get", {
    method: "GET"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearTable();
      console.log(data);

      data.forEach(item => {
        currentId.push(item._id);
        fillTableGet(item);
      });
    });
  return false;
};

const addExample = function(e) {
  const json = {
      pName: "Example",
      pDesc: "This is An Example Entry",
      pSDate: "01-01-2000",
      pEDate: "02-14-2000",
      pPrio: "6",
      pButton: [createDelete(), createEdit(), createDone()]
    },
    body = JSON.stringify(json);
  fetch("/add", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
  location.reload();
  return false;
};

const reset = function(e) {
  for (var i = 0; i < currentId.length; i++) {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id: currentId[i] }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        currentId.pop(i);
      });
  }
  addExample(this);
};

function start(e) {
  e.preventDefault();
  submit(e);
  get(e);
}
window.onload = function() {
  console.log(document.location);
  
    const subButton = document.querySelector("#submit");
    subButton.onclick = start;
    const resetButton = document.querySelector("#reset");
    resetButton.onclick = reset;
    const exampleButton = document.querySelector("#example");
    exampleButton.onclick = addExample;
    get(this);
  getAccounts();
};

/*
// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const onScreenItems = [];

// a helper function that creates a list item for a given dream
function appendNewItem(id,name,email,username,password) {
   const things = [id,name,email,username,password];

  newListItem.onclick = function() {
    fetch("/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        newListItem.remove();
      });
  };
  onScreenItems.appendChild(things)
}

/*dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  fetch("/add", {
    method: "POST",
    body: JSON.stringify({ dream: dreamsForm.elements.dream.value }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      appendNewDream(json.dream, json._id);
    });

  // reset form
  dreamsForm.reset();
  dreamsForm.elements.dream.focus();
});
*/
/*
function checkInfo() {
  var email = document.getElementById("inputEmail3").value;
  var password = document.getElementById("inputPassword3").value;
        const json ={
          name: "John Doe",
          email: email,
          username: "jDoe",
          password: password
        }
        console.log("yes")
        fetch("/add", {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(json => {
            appendNewItem(json._id, json.name, json.email, json.username, json.password);
          });
      }
*/
