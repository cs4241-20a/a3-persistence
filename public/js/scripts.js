// Add some Javascript code here, to run on the front end.

console.log("Welcome to assignment 2!");

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault();

    //fields
    const fName = document.getElementById("fName").value;
    const mName = document.getElementById("mName").value;
    const lName = document.getElementById("lName").value;
    const gender = document.getElementById("gender").value;
    const birthday = document.getElementById("birthday").value;

    document.getElementById('fName').value = "";
    document.getElementById("mName").value = "";
    document.getElementById("lName").value = "";
    document.getElementById("gender").value = "Male";
    document.getElementById("birthday").value = "";

    //constructing the response
    let json = {
        firstName: fName,
        middleName: mName,
        lastName: lName,
        gender: gender,
        birthday: birthday
    };

    console.log(json);

    let body = JSON.stringify(json);

    fetch( '/add', {
        method:'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(( response ) => {
        // do something with the response
        return response.json();
    }).then(( json ) => {
        console.log(json);
        loadTable(json);
    });

    return false
};

const loadTable = function ( json ){
    console.log(json)
    const table = document.getElementById("table-body");
    table.innerHTML = "";
    for (let i = 0; i < json.length; i++){
        table.innerHTML += (
            "<tr>" +
            "<td>" + json[i]['fullName'] + "</td>" +
            "<td>" + json[i]['gender'] + "</td>" +
            "<td>" + json[i]['birthday'] + "</td>" +
            "<td>" + json[i]['ableToDrink'] + "</td>" +
            "<td>" + "<button type=\"button\" onclick='deleteElement(this)' class=\"btn btn-danger deleteButton\" value='" + json[i]['fullName'] + "'>Delete</button>" + "</td>"    +
            "<td>" + "<button type=\"button\" onclick='modifyElement(this)' class=\"btn btn-warning modifyButton\" value='" + json[i]['fullName'] + "'>Override</button>" + "</td>"    +
            "</tr>"
        );
    }
};

const modifyElement = function (e){
    let json = {
        fullName: e.value
    };

    let body = JSON.stringify(json);

    fetch( '/modify', {
        method:'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( function( response ) {
        return response.json();
    }).then( function( json ) {
        loadTable(json);
    });
};

const deleteElement = function (e){
    let json = {
        fullName: e.value
    };

    let body = JSON.stringify(json);

    fetch( '/delete', {
        method:'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( function( response ) {
        return response.json();
    }).then( function( json ) {
        loadTable(json);
    });

};

window.onload = function() {
    const button = document.querySelector( '#addGuestButton' );
    button.onclick = submit;
    fetch("/load", {
        method:'POST'
    }).then(function (response){
        return response.json();
    }).then(function (json) {
        loadTable(json);
    });
};