// Form submission
const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const checkbox = document.getElementById('roll')
    const initbonus = document.querySelector( '#initbonus')
    const initiative = document.querySelector( '#initiative' )

    const name = document.querySelector( '#name' )
    const hp = document.querySelector( '#hp')
    const ac = document.querySelector( '#ac')
    if(name.value === "" || ac.value === "" || 
    initbonus.value === "" || hp.value === "") {
        window.alert("Please fill in all of the fields.")
        return false
    }

    // handle initiative
    var init;
    if(checkbox.checked) {
        // Roll their initiative

        init = parseInt(initbonus.value) + getRandomInt(20)

    } else {
        // their initiative is what was entered.
        init = initiative.value
    }

    const json = {name: name.value, num: init, ac:ac.value, hp:hp.value }
    const body = JSON.stringify( json )
    //console.log(body)

    fetch( '/add', {
      method:'POST',
      body,
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then( response => response.json()) 
    .then( resjson => processJSON(resjson))

    // clear inputs
    name.value = ""
    initiative.value = 0
    initbonus.value = 0
    hp.value = 0
    ac.value = 0

    return false
  }

document.addEventListener("click", function (e) {
    if(e.target && e.target.classList[0] == "delete") {
        removeCreature(e)
    }
    if(e.target && e.target.classList[0] == "moveUp") {
        moveCreature(e, -1)
    }
    if(e.target && e.target.classList[0] == "moveDown") {
        moveCreature(e, 1)
    }
})

const removeCreature = function (e) {
    e.preventDefault();
    const _id = e.target.getAttribute("id");
    const order = e.target.getAttribute("order")

    const json = {delete: 'delete', _id, order},
        body = JSON.stringify(json);

        fetch('/remove', {
            method:'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then( resjson => processJSON(resjson))
}

const moveCreature = function (e, dir) {
    e.preventDefault();
    const id = e.target.getAttribute("id");
    const order = e.target.getAttribute("order")

    const json = {movedir: dir, id, order},
        body = JSON.stringify(json);

        fetch('/move', {
            method:'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then( resjson => processJSON(resjson))
}

const processJSON = (json) => {
    console.log(json)
    const creatures = document.getElementById("creatures");
    creatures.innerHTML = "";
    json.forEach((creature) => {
        creatures.innerHTML += `
        <tr>
            <td>${
                creature._id}
            </td>
            <td>${
                creature.order}
            </td>
            <td>${
                creature.name}
            </td>
            <td>${
                creature.num}
            </td>
            <td>${
                creature.hp}
            </td>
            <td>${
                creature.ac}
            </td>
            <td><i class="moveUp fa fa-angle-double-up" id="${creature._id}" order="${creature.order}">
            </td>
            <td><i class="moveDown fa fa-angle-double-down" id="${creature._id}" order="${creature.order}">
            </td>
            <td><i class="delete fa fa-trash-o" style="font-size:24px" id="${creature._id}" order="${creature.order}"></i>
            </td>
        </tr>`
    })
}

window.onload = ()=> {
    const button = document.querySelector( 'button' )
    button.onclick = submit
    getAll()

}

const getAll = () =>{
    fetch('/appData')
    .then(response => response.json())
    .then((json) => {
        processJSON(json)
        //console.log(json)
    })

}

// Helpers
function switchRoll() {
    var checkBox = document.getElementById("roll");
    var bonus = document.getElementById("initbonusBox")
    var init = document.getElementById("initiativeBox")
    if(checkBox.checked == true) {
        init.style.display = "none"
        bonus.style.display = "block"
    } else {
        bonus.style.display = "none"
        init.style.display = "block"

    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1
}