const USERNAME = localStorage.getItem('username')

/*I am not adding protections to add,remove,and edit.*/
const add = function(e) {
    e.preventDefault()
    const inputs = document.getElementsByClassName('addCard')
    const rarity = document.querySelector('input[name="rarity"]:checked').value[0]//can add error handling in future
    fetch('/add', {
        method:'POST',
        body:JSON.stringify({username: USERNAME, name:inputs[0].value, manacost:inputs[1].value, type:inputs[2].value,abilities:inputs[3].value,flavortext:inputs[4].value,rarity}),
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
    const cardInput = document.createElement('input')
    cardInput.type = 'button'
    cardInput.value = 'card'
    td.appendChild(cardInput)
    tr.onmouseover = function() {
        delInput.style.visibility = 'visible'
        editInput.style.visibility = 'visible'
        cardInput.style.visibility = 'visible'
    }
    tr.onmouseleave = function() {
        delInput.style.visibility = 'hidden'
        editInput.style.visibility = 'hidden'
        cardInput.style.visibility = 'hidden'
    }
    editInput.onclick = function() {
        if(editInput.value === 'edit') {
            tr.contentEditable = true;
            editInput.value = 'save'
        } else {
            tr.contentEditable = false;
            editInput.value = 'edit'
            edit(json._id, tr)
            //update value in server
        }
    }
    delInput.onclick = function() {
        tbody.removeChild(tr)
        remove(json._id)
    }
    //FIX BELOW
    cardInput.onclick = function() {
        document.querySelector('#card').style.visibility = 'visible'
        document.querySelector('.cardSpan').innerText = data.personname
        location.href = "#card"
    }
    
}

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
//this will likely be marked as an achievement. i rly want to do it but idk if i can.
//i also wanna add a 3rd page for tutorial for adding stuff. and what stuff means
//accessible via the navbar
//(can also add a public/private feature for cards and public can be seen by everyone)
const showCard = function(tr) {
    
}

window.onload=function() {
    document.querySelector('#welcome').innerText = `Welcome back, ${USERNAME}`
    document.querySelector('#signout').onclick = function() {
        localStorage.clear()
        window.location.assign("/")
    }
    document.querySelector('h1').innerText=USERNAME + "'s Custom Cards"
    document.querySelector('#addCard').onclick = add
    fetch('/load', {
        method:'POST',
        body:JSON.stringify({username: USERNAME}),
        headers:{
            'Content-type':'application/json'
        }
    }).then(response=>response.json())
    .then(json=>{
        console.log(json)
        for(let i=0;i<json.length; i++) addEntry(json[i])
    })
}