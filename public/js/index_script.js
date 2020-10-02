const getUserFunc = function (e){

    fetch('/getUser',
        {method: 'GET'
        })
        .then(response => response.json())
        .then(function(response){
            console.log(response)
            var h3 = document.getElementById('welcome');
            h3.innerHTML = "Welcome " + response
        })
}

const loadData = function(e) {

    fetch('/getData',
        {method: 'GET'
        })
        .then(response => response.json())
        .then(function(response){
            response.forEach(addToTable)

    })
}


function addToTable(item){

    var table = document.getElementById('registration');
    var row = table.insertRow(1);
    var c0 = row.insertCell(0);
    var c1 = row.insertCell(1);

    c0.innerHTML = item.major;
    c1.innerHTML = item.course;
}

const submitChanges = function( e ) {


    const json = {
            major: document.querySelector( '#major' ).value,
            course: document.querySelector( '#course' ).value
        }
        body = JSON.stringify( json )

    // const form = new FormData(document.getElementById('form'))
    console.log(body)
    var table = document.getElementById('registration');
    var row = table.insertRow(1);
    var c0 = row.insertCell(0);
    var c1 = row.insertCell(1);

    c0.innerHTML = json.major;
    c1.innerHTML = json.course;


    fetch( '/submit', {
        method:'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return false
}

window.onload = function() {
    getUserFunc()
    loadData()
    const button = document.querySelector( 'button' )
    button.onclick = submitChanges
}