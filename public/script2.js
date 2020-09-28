const patronsForm = document.getElementById("patronForm");
patronsForm.addEventListener("submit", event2 => {
    // stop our form submission from refreshing the page
    event.preventDefault();
    console.log("HI2");
    fetch("/add", {
      method: "POST",
      body: JSON.stringify({
        firstName: patronsForm.elements.fname.value,
        lastName: patronsForm.elements.lname.value,
        age: patronsForm.elements.age.value,
        state: patronsForm.elements.state.value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        addPatron(json);
      });
    // reset form
    patronsForm.reset();
    patronsForm.elements.fname.focus();
  });
/*function appendTable(){
  fetch("/all",{
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => addPatron(response))
}*/

function addPatron(patrons) {
  var numAccessed = 1;
  let tableStart = 1;
  let initTable = document.getElementById("patrons");
  let rowCount = initTable.rows.length;
  for (var i = tableStart; i < rowCount; i++) {
    initTable.deleteRow(tableStart);
  }
  for (let patron in patrons) {
    let table = document.getElementById("patrons");
    let row = table.insertRow(numAccessed);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    cell0.innerHTML = patrons[patron].firstName;
    cell1.innerHTML = patrons[patron].lastName;
    cell2.innerHTML = patrons[patron].age;
    cell3.innerHTML = patrons[patron].state;
    cell4.innerHTML = "X";
    cell4.onclick = function() {
      fetch("/delete", {
        method: "POST",
        body: JSON.stringify({ id: patrons[patron]._id }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          table.deleteRow(this.parentNode.rowIndex);
        });
    };
    numAccessed++;
  }
}
