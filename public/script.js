// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const studentsList = document.getElementById("students");
const studentForm = document.getElementById("studentForm");
const senseiElement = document.getElementById("sensei");
const table = document.getElementById("studentTable");
const classSize = document.getElementById("size");
const classRate = document.getElementById("totalrate");


// a helper function that creates a table row for a given student
function enrollStudent(student) {
  // Create an empty <tr> element and add it to the last position of the table:
  let row = table.insertRow(-1);

  // Insert new cells (<td> elements) at the 1st, 2nd, and 3rd position of the "new" <tr> element:
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  cell5.className = "buttonColumn";

  let btn = document.createElement('input');
  btn.type = "button";
  btn.value = "Remove";
  btn.className = "deleteButton";
  btn.onclick = function(){
    fetch("/delete", {
      method:"POST",
      body:JSON.stringify({id: student._id}),
      headers: {
      "Content-Type": "application/json"
      }
    })
    .then( response => response.json() )
    .then( json => {
      table.deleteRow(row.rowIndex);
      getRoster();
    })
  };
  let btn2 = document.createElement('input');
  btn2.type = "button";
  btn2.value = "Edit";
  btn2.className = "editButton";
  btn2.onclick = function(){
    if(btn2.value === "Edit"){
      row.contentEditable = true;
      btn2.value = "Submit";
      cell1.style.border = "2px dotted black";
      cell2.style.border = "2px dotted black";
      cell3.style.border = "2px dotted black";
      cell4.style.border = "2px dotted black";
    }
    else if(btn2.value === "Submit"){
      row.contentEditable = false;
      btn2.value = "Edit";
      cell1.style.border = "";
      cell2.style.border = "";
      cell3.style.border = "";
      cell4.style.border = "";
      
      let newStudent = updateStudent(student._id, cell1.innerText, 
                    cell2.innerText, cell3.innerText, cell4.innerText);
    }
  }
  cell5.appendChild(btn2);
  cell5.appendChild(btn);

  // Add some text to the new cells:
  cell1.innerHTML = student.name;
  cell2.innerHTML = student.belt;
  cell3.innerHTML = student.age;
  cell4.innerHTML = student.record;
}

function submitForm(e) {
  e.preventDefault();

  // get dream value and add it to the list
  let name = studentForm.elements.name.value;
  let belt = studentForm.elements.belt.value;
  let age = studentForm.elements.age.value;
  let record = studentForm.elements.winrate.value;

  fetch("/add", {
    method:"POST",
    body:JSON.stringify({ "sensei": senseiElement.innerText,
      name, belt, age, record }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( response => response.json() )
  .then( json => {
    enrollStudent(json);
    getRoster();
  })
  // reset form
  studentForm.reset();
  studentForm.elements.name.focus();
};

function getRoster(){
  fetch("/results", {
    method:"GET",
    headers: {
      "sensei": senseiElement.innerText
    }
  })
  .then( response => response.json() )
  .then( json => {
    listStudents(json);
  })
}

function updateStudent(id, name, belt, age, record){
    fetch("/update", {
    method:"POST",
    body:JSON.stringify({id, 
      "sensei": senseiElement.innerText, 
      name, belt, age, record}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then( response => response.json() )
  .then( json => {
    getRoster();
    return json;
  })
}

function listStudents(json){
  let winrate = 0;
  let numRows = table.rows.length-1;
  // first delete all existing rows on the user page
  for(let i=0; i<numRows; i++){
    table.deleteRow(1);
  }
  // then display all information from the database
  for(let j=0; j<json.length; j++) {
    enrollStudent(json[j]);
    winrate = winrate + Number(json[j].record);
  }
  classSize.innerHTML = json.length;
  winrate = winrate / json.length;
  let final = (Math.round(winrate * 1000) / 1000);
  classRate.innerHTML = final;
}

function login(e) {
    e.preventDefault();

    let sensei = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch('/login', {
      method: "POST",
      body: JSON.stringify({sensei, password}),
      headers: {
        "Content-Type":"application/json"
      }
    })
    .then(async function(response) {
      if (response.status === 200) {
        let json = await response.json();
        let username = json.username;
        document.title = "Dojo Roster Management";
        document.getElementById("loginPage").hidden = true;
        document.getElementById("mainPage").hidden = false;
        senseiElement.innerText = username;
        getRoster();
      } 
      else {
        window.alert("Incorrect username or password");
      }
    });
}

function createAccount(e) {
    e.preventDefault();

    let sensei = document.getElementById("newUsername").value;
    let password = document.getElementById("newPassword").value;
    
    fetch('/newaccount', {
      method: "POST",
      body: JSON.stringify({sensei, password}),
      headers: {
        "Content-Type":"application/json"
      }
    })
    .then(function(response) {
      if (response.ok) {
        window.alert("Created new account - Now Login!");
      } else {
        window.alert("Error occured - new account was not created");
      }
    })
}

window.onload = function(){
  const loginButton = document.getElementById("login");
  loginButton.onclick = login;
  const createButton = document.getElementById("create");
  createButton.onclick = createAccount;
  const submitButton = document.getElementById("submitstudent");
  submitButton.onclick = submitForm;
}