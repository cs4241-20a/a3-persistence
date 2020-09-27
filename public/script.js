// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page



function updateTable(json, row) {
  //var row = document.getElementById("table").rows[id].cells;
  console.log(json);
  json = JSON.parse(json);
  row.cells[0].innerHTML = json.name;
  row.cells[1].innerHTML = json.major;
  row.cells[2].innerHTML = json.classYear;
  row.cells[3].innerHTML = json.classYear - 4;
  // var newInput = document.getElementById("newInput");
  // newInput.style.visibility = "hidden";
  
  var newInput = document.getElementById("newInput");
  var input = document.getElementById("input");
  var left = document.getElementById("leftSide");
  left.innerHTML = input.innerHTML;
  // input.style.display="inline";
  //newInput.style.display = "hidden";
}

function addRow(json, i) {
  for (i; i < json.length; i++) {
    const id = json[i]._id;
    const row = document.createElement("tr");
    var table = document.getElementById("table");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var td5 = document.createElement("td");
    var td6 = document.createElement("td");
    td1.innerHTML = json[i].name;
    td2.innerHTML = json[i].major;
    td3.innerHTML = json[i].classYear;
    td4.innerHTML = json[i].admissionYear;
    
    
    var edit = document.createElement("button");
    edit.innerHTML = "Edit";
    edit.onclick = function() {
      editRow(id, row);
    };
    td5.appendChild(edit);

    var remove = document.createElement("button");
    remove.innerHTML = "Remove";
    remove.onclick = function() {
      removeRow(id, row);
    };
    td6.appendChild(remove);

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    row.appendChild(td6);

    table.children[0].appendChild(row);
  }
}

function updateRow(id, row) {
  const name = document.querySelector("#newName");
  const major = document.querySelector("#newMajor");
  const classYear = document.querySelector("#newClass");
  const json = {
    name: document.getElementById("newName").value,
    major: document.getElementById("newMajor").value,
    classYear: document.getElementById("newClass").value,
    admissionYear: document.getElementById("newClass").value - 4,
    id: id
  };
  const body = JSON.stringify(json);
  
  if(name.value == ""){
    alert("Name is required.")
    return false;
  }
  if(classYear.value < 1865 || classYear.value >= 2100){
    alert("School year should be within 1865-2100")
    return false;
  }
  

  fetch("/edit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      //delete json.id;
      console.log(json);
      updateTable(body, row);
      console.log("Row changed");
    });
}

function editRow(id, row) {
  var newInput = document.getElementById("newInput");
  var input = document.getElementById("input");
  var left = document.getElementById("leftSide");
  left.innerHTML = newInput.innerHTML;
  //var row = document.getElementById("table").rows[rowIdx].cells;
  var cells = row.cells;

  document.getElementById("newName").value = cells[0].innerHTML;
  document.getElementById("newMajor").value = cells[1].innerHTML;
  document.getElementById("newClass").value = cells[2].innerHTML;

  document.getElementById("Save").onclick = function() {
    updateRow(id, row);
  };
}
function removeRow(id, row) {
  fetch("/remove", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      row.remove();
      console.log("Row removed.");
    });
}

const showTable = function() {
  //e.preventDefault();
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log("data:", json);
      addRow(json, 0);
    });
};

const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();

  const name = document.querySelector("#name");
  const major = document.querySelector("#major");
  const classYear = document.querySelector("#class");
  const json = {
    name: document.getElementById("name").value,
    major: document.getElementById("major").value,
    classYear: document.getElementById("class").value,
    admissionYear: document.getElementById("class").value - 4
  };
  const body = JSON.stringify(json);
  if(name.value == ""){
    alert("Name is required.")
    return false;
  }
  if(classYear.value < 1865 || classYear.value >= 2100){
    alert("School year should be within 1865-2100")
    return false;
  }

  fetch("/submit", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      addRow(json, json.length - 1);
    });
};

window.onload = function() {
  showTable();
  const button = document.querySelector("#Add");
  // const sign = document.querySelector("#sign");
  button.onclick = submit;
  // sign.onclick = signIn;
};
