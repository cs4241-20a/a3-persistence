// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
getResults()

// define variables that reference elements on our page
const namesList = document.getElementById("rappernames");
const generateForm = document.querySelector("form");

// a helper function that creates a list item for a given name
function appendNewName(name, id) {
  const newListItem = document.createElement("li");
  newListItem.innerText = name;

  newListItem.onclick = function() {
    fetch("/remove", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        newListItem.remove();
      });
  };

  newListItem.onmouseover = function() {
    fetch("/update", {
      method: "POST",
      body: JSON.stringify({ rapname: name, id:id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        newListItem.innerText = json;
        namesList.appendChild(newListItem);
      });
  };

  namesList.appendChild(newListItem);
}

function getResults() {
  // fetch the initial list of names
  fetch("/results")
    .then(response => response.json()) // parse the JSON from the server
    .then(results => {
      //console.log(results)
      // remove the loading text
      namesList.firstElementChild.remove();

      for (let i = 0, l = results.length; i < l; i++) {
        console.log(results[i].rapname);
        appendNewName(results[i].rapname, results[i].id);
      }
    });
}

// listen for the form to be submitted and add a new name when it is
generateForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  

  var x = document.getElementById("yourname").value;
  var y = document.getElementById("favColor").value;

  //make sure text input isn't empty
  if (x == "") {
    alert("Please enter a username before continuing");
    return false;
  }
  if (y == "") {
    alert("Please enter a favorite color before continuing");
    return false;
  }

  //unhide div
  var T = document.getElementById("writeUsername");
  T.style.display = "block";

  const name = document.querySelector("#yourname"),
    color = document.querySelector("#favColor"),
    json = { name: name.value, color: color.value },
    body = JSON.stringify(json);

  fetch("/add", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(json => {
      var displayRapName = json.rapname;
      document.getElementById("showName").innerHTML =
        "Your Rapper Name is " + displayRapName;

      appendNewName(displayRapName, json._id);
    });

  // reset form
  generateForm.reset();
  //generateForm.elements.appData.focus();
});
