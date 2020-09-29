// const dreamsList = document.getElementById("dreams");
// const dreamsForm = document.querySelector("form");

// // a helper function that creates a list item for a given dream
// function appendNewDream(dream, id) {
//   const newListItem = document.createElement("li");
//   newListItem.innerText = dream;
  
//   newListItem.onclick = function() {
//     fetch( '/delete', {
//       method:'POST',
//       body:JSON.stringify({id}),
//       headers: {
//         'Content-Type' : 'application/json'
//       }
//     })
//     .then( response => response.json())
//     .then( json => {
//       newListItem.remove()
//     })
//   }
  
//   dreamsList.appendChild(newListItem);
// }

// // fetch the initial list of dreams
// fetch("/dreams")
//   .then(response => response.json()) // parse the JSON from the server
//   .then(dreams => {
//     // remove the loading text
//     dreamsList.firstElementChild.remove();
  
//     // iterate through every dream and add it to our page
//     dreams.forEach(appendNewDream);
  
//     // listen for the form to be submitted and add a new dream when it is

//   });

// dreamsForm.addEventListener("submit", event => {
//   // stop our form submission from refreshing the page
//   event.preventDefault();

//   // get dream value and add it to the list
//   let newDream = dreamsForm.elements.dream.value;
//   appendNewDream(newDream);
  
//   fetch( '/add', {
//     method:'POST',
//     body:JSON.stringify({dream:newDream}),
//     headers: {
//       'Content-Type' : 'application/json'
//     }
//   })
//   .then( response => response.json())
//   .then( json => {
//     appendNewDream(json.dream, json._id)
//   })
  
//   // reset form
//   dreamsForm.reset();
//   dreamsForm.elements.dream.focus();
// });

console.log("Welcome to assignment 3!")

let x, y, z
let contrastColor
let button, play_btn, play_text, form, check_btn, check_txt

let startTime, endTime

window.onload = function() {
    form = document.getElementById( 'submit_form' )
    form.style.display = "none"

    button = document.getElementById( 'submit_btn' )
    button.onclick = submit
    
    randomBackground()

    play_btn = document.getElementById('play_btn')
    play_text = document.getElementById("play_text")
    play_text.style.display = "none"
    play_btn.onclick = function(){
        setTimeout(play_handle, Math.random() * 3000)
    }

    check_btn = document.getElementById("check_btn")
    check_txt = document.getElementById("check_txt")

    check_btn.onclick = updateField
}

function randomBackground() {
    x = Math.floor(Math.random() * 256);
    y = Math.floor(Math.random() * 256);
    z = Math.floor(Math.random() * 256);
    
    const bgColor = "rgb(" + x + "," + y + "," + z + ")";

    const x_c = Math.floor(255 -x),
          y_c = Math.floor(255 - y),
          z_c = Math.floor(255 - z);

    contrastColor = "rgb(" + x_c + "," + y_c + "," + z_c + ")";
  
    document.body.style.background = bgColor;
    document.getElementById("play_btn").style.backgroundColor = contrastColor;
    document.getElementById("play_btn").style.color = bgColor;
}

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    endTime = new Date().getTime()
    const timeDiff = endTime - startTime
    startTime = 0
    endTime = 0

    let succeed = false

    play_text.innerHTML = ""
    play_text.style.display = "none"

    const input = document.querySelector( '#yourname' ),
          json = { yourname: input.value },
          body = JSON.stringify( json )

    fetch( '/submitAns', {
      method:'POST',
      body 
    })
    .then( function( response ) {
      // do something with the reponse 
      return response.text()
    }).then ( function (txt){
        if (txt === "succeed!"){
            console.log("Here!")
            const scoreJson = JSON.stringify({score: timeDiff})
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/updateScore", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(scoreJson);
        }
    })

    form.style.display = "none"
    play_btn.style.display = "block"

    return false
}

const updateField = function (){
    fetch( '/getField', {
        method:'GET',
    })
    .then( function( response ) {
        // do something with the reponse 
        return response.json()
    }).then ( function (json){
       check_txt.innerHTML = JSON.stringify(json)
    })

}

const play_handle = function (){

    form.style.display = "block"
    play_btn.style.display = "none"

    fetch( '/getAns', {
        method:'GET',
    })
    .then( function( response ) {
        // do something with the reponse 
        return response.text()
    }).then ( function (txt){
        play_text.innerHTML = txt
        play_text.style.display = "block"
        startTime = new Date().getTime()
    })
}