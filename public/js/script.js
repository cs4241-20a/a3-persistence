"use strict";

function sendData(e) {
    e.preventDefault();
    let text = document.getElementById("text").value;

    fetch('/submit', {
        method: "POST",
        body: JSON.stringify({test: text}),
        headers: {
            "Content-Type":"application/json"
        }
    })
    .then(response => response.json())
    .then(function(data) {
        console.log(data);
    });
}

window.onload = function() {
    //getAllItems();
    document.getElementById("submit").addEventListener("click", sendData, false);
    //document.addEventListener("click", handleButton, false);
}

console.log("Loaded JS")