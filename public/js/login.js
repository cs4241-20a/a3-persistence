console.log("Welcome to assignment 3!")

const login = function (e) {
  // prevent default form action from being carried out
  e.preventDefault()

  const uname = document.querySelector('#Username')
  const pw = document.querySelector('#Password')

  if (uname.value.toString().trim() === '' || pw.value.toString().trim() === '') {
    alert("Empty fields.")
    return false
  }

  const json = {
    username: uname.value,
    password: pw.value
  }

  const body = JSON.stringify(json)
  fetch('/login', {
    method: 'POST',
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      if (json != null) {
        alert("Logging in.")
        window.location.href = "/views/index.html";
      } else {
        alert("This account does not exist. Please create account or enter valid credentials.")
      }
    })
  document.getElementById('Username').value = ""
  document.getElementById('Password').value = ""

  return false
}

const create = function (e) {
  // prevent default form action from being carried out
  e.preventDefault()

  const uname = document.querySelector('#Username')
  const pw = document.querySelector('#Password')
  let userID = null

  if (uname.value.toString().trim() === '' || pw.value.toString().trim() === '') {
    alert("Empty fields.")
    return false
  }

  const json = {
    username: uname.value,
    password: pw.value
  }

  const body = JSON.stringify(json)
  fetch('/create', {
    method: 'POST',
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      alert("Created account.")
    })


  document.getElementById('Username').value = ""
  document.getElementById('Password').value = ""

  window.location.href = "/views/index.html";

  return false
}


window.onload = function () {
  const loginBtn = document.querySelector('#login-btn')
  const createBtn = document.querySelector('#create-btn')

  loginBtn.onclick = login
  createBtn.onclick = create
}