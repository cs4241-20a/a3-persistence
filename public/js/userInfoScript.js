window.addEventListener('load', () => {
  fetch('/userpage', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
  .then(function(response) {
      return response.json();
  })
  .then(function(json) {
    console.log(json)
    //var item = json[json.length-1]
    //console.log(item)
    const header = document.getElementById("welcome")
    var message = "Hello " + json + "!"
    header.appendChild(document.createTextNode(message))
  })
})

var rIndex,
    tbod = document.getElementsByTagName("tbody").item(0)

const table = document.querySelector("table")
//console.log(table)
const ids = []
const rowNums = []

function appendNewInfo(todoItem, tbcount) {
  const row = document.createElement("tr")
  var col1 = document.createElement("td")
  var col2 = document.createElement("td")
  var col3 = document.createElement("td")
  var head = document.createElement("th")
  head.setAttribute('scope', 'row')
  head.appendChild(document.createTextNode(tbcount))
  row.appendChild(head)
  col1.setAttribute('type', 'task')
  col1.appendChild(document.createTextNode(todoItem.task))
  row.appendChild(col1)
  col2.setAttribute('type', 'duedate')
  col2.appendChild(document.createTextNode(todoItem.duedate))
  row.appendChild(col2)
  col3.setAttribute('type', 'priority')
  col3.appendChild(document.createTextNode(todoItem.priority))
  row.appendChild(col3)
  const todoForm = document.querySelector("form")
  row.onclick = function () {
    todoForm.elements.task.value = todoItem.task
    todoForm.elements.duedate.value = todoItem.duedate
    todoForm.elements.priority.value = todoItem.priority
    ids.push(todoItem)
    rowNums.push(tbcount)
  }
  tbod.appendChild(row)
}

//console.log(uname)

window.addEventListener('load', event => {
  //console.log(tbod)
  
  event.preventDefault()
  
  var h = document.getElementById('welcome')
  var name = h.innerHTML
  var ind = name.indexOf("Hello ")
  var uname = name.substring(ind+6,name.length-1)
  console.log("Current user: " + uname)
  fetch('/tableData', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
  .then(function(response) {
      return response.json();
  })
  .then(function(json) {
    console.log("Array: " + JSON.stringify(json))
    var count = 0
    for(var i = 0; i < json.length; i++)
    {
      count++
      var todo = json[i]
      //if(todo.username == uname) 
      console.log("append")
      appendNewInfo(todo, count)
    }
  })
})

const todoForm = document.querySelector("form")

const add = function (e) {
  
  e.preventDefault()
  
  const input = document.querySelector( '#task' )
  const input2 = document.querySelector( '#duedate' )
  const input3 = document.querySelector( '#priority')
  var h = document.getElementById('welcome')
  var name = h.innerHTML
  var ind = name.indexOf("Hello ")
  var uname = name.substring(ind+6,name.length-1)
  const json = { username: uname, task: input.value, duedate: input2.value, priority: input3.value }
  const body = JSON.stringify( json )
  console.log(body)
  
  fetch( '/add', {
         method:'POST',
         body,
         headers: {
          "Content-type": "application/json"
        }
    })
    .then( function( response ) {
      return response.json()
    })
    .then( function( json ) {
      console.log( json )
      var count = 0
      var tableCount = tbod.rows.length
      //for(var i = 0; i < json.length; i++)
        //{
      //var todo = json[json.length-1]
      var todo = json
      if(todo.username == uname) {
            //count++
            //if(count > tableCount)
        appendNewInfo(todo, tableCount+1)
          //}
        }
      //count = 0;
  })
  //selectInput()
}

function modifyTable(item, itemNum) {
  var todoItem = table.rows[itemNum]
  console.log(todoItem)
  var cells = todoItem.getElementsByTagName("td")
  cells[0].innerHTML = item.task
  cells[1].innerHTML = item.duedate
  cells[2].innerHTML  = item.priority
  console.log(todoItem)
}

const edit = function (e) {
  
  e.preventDefault()

  const todoForm = document.querySelector("form")
  var tdi = ids[ids.length-1]
  console.log("TDI: ", tdi)
  tdi.task = todoForm.elements.task.value
  tdi.duedate = todoForm.elements.duedate.value
  tdi.priority = todoForm.elements.priority.value
  console.log("Modified: ", tdi)
  
  fetch( '/edit', {
         method:'POST',
         body: JSON.stringify(tdi),
         headers: {
          "Content-type": "application/json"
        }
    })
    .then( function( response ) {
      return response.json()
    })
    .then( function( json ) {
      //console.log('Changed: ', json )
      //This returns the modified data cell, then use the rowNum array to change the right row
      modifyTable(tdi, rowNums[rowNums.length-1])
  })
}

const remove = function (e) {
  
  e.preventDefault()
  var tdi = ids[ids.length-1]
  //console.log(id)
  
  fetch('/delete', {
    method: 'POST',
    body: JSON.stringify({id: tdi._id}),
    headers: {
      "Content-type": "application/json"
    }
  })
  .then( response => response.json())
  .then( json => {
    table.deleteRow(rowNums[rowNums.length-1])
    location.reload()
  })
}

const signout = function (e) {
  
  e.preventDefault()
  
  console.log('Going to Sign Out')
  
  fetch('/signout', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
  .then( function(response) {
      return response.text();
  })
  .then(function(json) {
    console.log("Bye!")
    window.location = 'https://a3-nikhil-chintada.glitch.me/'
  })
}

window.onload = function() {
    const button1 = document.querySelector( '#add' )
    button1.onclick = add
  
    const button2 = document.querySelector( '#edit' )
    button2.onclick = edit
  
    const button3 = document.querySelector( '#delete' )
    button3.onclick = remove
  
    const button4 = document.querySelector('#signout')
    button4.onclick = signout
  }