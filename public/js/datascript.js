let username = localStorage.getItem('username')
//function called when they hit Forge Card button
const add = function(e) {
    e.preventDefault()
    const inputs = document.getElementsByClassName('addCard')
    const rarity = document.querySelector('input[name="rarity"]:checked').value
    fetch('/add', {
        method:'POST',
        body:JSON.stringify({username, name:inputs[0].value, manacost:inputs[1].value, type:inputs[2].value,abilities:inputs[3].value,flavortext:inputs[4].value,rarity}),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
        Array.prototype.slice.call( inputs ).map(i=>i.value='')
        addEntry(json)
    })
}
//this function adds an entry to the list via json (usually after the above func gets a response)
const addEntry = function(json) {
    const tbody = document.querySelector('table')
    const tr = document.createElement('tr')
    tbody.appendChild(tr)
    let x
    for(x in json) {
        if (x != '_id' && x!='username') {
            const td = document.createElement('td')
            td.innerText = json[x]
            tr.appendChild(td)
        }
    }
    const td = document.createElement('td')
    td.classList.add('modify')
    const editInput = document.createElement('input')
    editInput.type = 'button'
    editInput.value = 'edit'
    td.appendChild(editInput)
    const delInput = document.createElement('input')
    delInput.type = 'button'
    delInput.value = 'del'
    td.appendChild(delInput)
    tr.appendChild(td)
    tr.onmouseover = function() {
        delInput.style.visibility = 'visible'
        editInput.style.visibility = 'visible'
    }
    tr.onmouseleave = function() {
        delInput.style.visibility = 'hidden'
        editInput.style.visibility = 'hidden'
    }
    editInput.onclick = function() {
        if(editInput.value === 'edit') {
            tr.contentEditable = true;
            editInput.value = 'save'
        } else {
            tr.contentEditable = false;
            editInput.value = 'edit'
            edit(json._id, tr)
        }
    }
    delInput.onclick = function() {
        tbody.removeChild(tr)
        remove(json._id)
    }
    
}
//function called when edit is saved.
const edit = function(id, tr) {
    const tds = tr.getElementsByTagName('td')
    fetch('/edit', {
        method:'POST',
        body:JSON.stringify({id, name:tds[0].innerText, manacost:tds[1].innerText, type:tds[2].innerText,abilities:tds[3].innerText,flavortext:tds[4].innerText,rarity:tds[5].innerText}),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response=>response.json())
    .then(json=>{
        console.log('success')
    })
}
//function called when user hits delete.
const remove = function(id) {
    fetch('/remove', {
        method:'POST',
        body:JSON.stringify({id}),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response=>response.json())
    .then(json=>{
        console.log('success')
    })
}

//function called during window.onload.
const startup = function() {
  document.querySelector('#welcome').innerText = `Welcome back, ${username}`
      document.querySelector('h1').innerText=username + "'s Custom Cards"
      fetch('/load', {
        method:'POST',
        body:JSON.stringify({username}),
        headers:{
            'Content-type':'application/json'
        }
    }).then(response=>response.json())
    .then(json=>{
        console.log(json)
        for(let i=0;i<json.length; i++) addEntry(json[i])
    })
}
//stuff that needs to be set when the window loads
window.onload=function() {
  if(localStorage.getItem('username')==null) {
    fetch('/auth/user', {
    }).then(response=>response.json())
    .then(json=>{
      username = json.username
      localStorage.setItem('username',json.username)
      startup()
    }).catch(err=>{
      console.log(err)
    })
  } else {
    startup()
  }
    document.querySelector('#signout').onclick = function() {
        localStorage.clear()
        window.location.assign("/")
      fetch('/logout', {
      }).then(response=>console.log(response))
    }
    document.querySelector('#addCard').onclick = add
}