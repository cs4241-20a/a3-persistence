console.log("Assignment 3")

const submit = function(e) {
    e.preventDefault()

    const name = document.querySelector('#homework').value
    const subject = document.querySelector('#subject').value
    const date = document.querySelector('#date').value

    const json = {
        "name":name,
        "subject":subject,
        "date":date
    }

    const body = JSON.stringify(json)
    console.log(body)

     fetch('/add', {
        method: 'POST',
        body,
        headers:{
          "Content-Type":"application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          updateHomeworks(json)
        })

      document.getElementById('homework').value = ""
      document.getElementById('subject').value = ""
      document.getElementById('date').value = ""

      return false
}




// function gethmwk() {
//   fetch( '/hmwkResponse', {
//     method:'GET'
//   })
//   .then( response => {
//     response.json().then(function (array) {
//       hmwkDisplay(array)
//     });
//   })
// }

const updateHomeworks = function(json) {
    let hwTable = document.getElementById('mainTable')
    for (var idx in json) {
      createEntry(hwTable, json[idx])
    }
}

const createEntry = function (hwTable, json) {
    let row = hwTable.insertRow(-1)
    let name = row.insertCell(0)
    let subject = row.insertCell(1)
    let date = row.insertCell(2)
    let edit = row.insertCell(3)
    let del = row.insertCell(4)

    name.contentEditable = "true"
    subject.contentEditable = "true"
    date.contentEditable = "true"

    var editButton = document.createElement("button")
    editButton.innerHTML = "Edit"
    editButton.addEventListener("click", editHmwk)
    editButton.className = "btn btn-info"
    editButton.id = json._id

    var delButton = document.createElement("button")
    delButton.innerHTML = "Delete"
    delButton.addEventListener("click", deleteHmwk)
    delButton.className = "btn btn-danger"
    delButton.id = json._id

    name.innerHTML = json.name
    subject.innerHTML = json.subject
    date.innerHTML = json.date
    edit.appendChild(editButton)
    del.appendChild(delButton)
}

const deleteHmwk = function() {
    const json = { id: this.id }
    const body = JSON.stringify(json)

    fetch('/delete', {
        method: 'POST',
        body,
        headers:{
          "Content-Type":"application/json"
        }
    })

    var i = this.parentNode.parentNode.rowIndex;
  document.getElementById("mainTable").deleteRow(i);
}

const editHmwk = function() {
    let hwTable = document.getElementById("mainTable")
    var i = this.parentNode.parentNode.rowIndex;
    var row = hwTable.rows[i]

    const json = {
        name: row.cells[0].innerHTML,
        subject: row.cells[1].innerHTML,
        date: row.cells[2].innerHTML,
        id: this.id
    }
    const body = JSON.stringify(json)

    fetch('/update', {
        method: 'POST',
        body,
        headers:{
          "Content-Type":"application/json"
        }
      }).then(response => response.json())

    document.getElementById("mainTable").deleteRow(i);
    createEntry(document.getElementById('mainTable'), json, i)
}

window.onload = function () {
    const addButton = document.querySelector('#addButton')
    addButton.onclick = submit

    fetch('/data')
        .then(response => response.json())
        .then(json => {
          updateHomeworks(json)
        })
}
