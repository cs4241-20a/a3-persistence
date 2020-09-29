// define variables that reference elements on our page
const dreamsForm = document.querySelector("form");

let username = ""
let tokenid = 0
var table = document.getElementById("myTable"); 


              
window.onload = function(){
  getData();
}

// a helper function that creates a list item for a given dream  
function build (response, id){ 
  var keys = [];  
  for (var i = 0; i < response.length; i++) {
  var tr = table.insertRow(-1);
	for (keys in response[i]) {
    if(keys != "_id" &&keys != "username"&&keys!="tokenid"){
    var tabCell = tr.insertCell();
    
    tabCell.innerHTML = response[i][keys]
  }
}
}
  
  tr.onclick = function(){
 fetch( '/remove', {
    method: "POST",
    body: JSON.stringify({ id}),
   headers: {
   "Content-Type": 'application/json'
     }
     })
    .then(response =>response.json())
   .then(json => { tr.remove()})
  }
  
  
  tr.onmouseover = function() {
    fetch("/update", {
      method: "POST",
      body: JSON.stringify({ foodname: name, id:id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        tabCell.innerHTML = json;
      });
  };
}


function getData() {
  // fetch the initial list
  fetch("/results")
    .then(response => response.json()) // parse the JSON from the server
    .then(results => {
      //console.log(results)
    for (var i = 0, length = results.length; i < length; i++) {
      build(results[i],results[i].id)
    }
  }
  );
}


const query = window.location.search.substring(1)
const token = query.split('access_token=')[1]
var food_name = document.querySelector( '#foodname' )
var datebought = document.querySelector("#purchased")
var enjoy =document.querySelector("#enjoyability")
var size = document.querySelector("#size")
  // listen for the form to be submitted and add a new dream when it is
dreamsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page

event.preventDefault();

  
if(food_name.value === ""){
  alert("Did not fill out food name field.")
}  
else if(datebought.value === ""){
  alert("Did not fill out purchased field.")
}
else if(enjoy.value === ""){
  alert("Did not fill out enjoy field.")
}
else{  
  fetch('//api.github.com/user', {
			headers: {
				// Include the token in the Authorization header
				Authorization: 'token ' + token
			}
		})
		// Parse the response as JSON
		.then(res => res.json())
		.then(res =>
        fetch( '/add', {
        method: "POST",
        body: JSON.stringify({
        foodname: food_name.value ,
        purchased: datebought.value,
        enjoyability: enjoy.value,
        size:size.value,
        onlist: "no",
        username:`${res.login}` ,
        tokenid: token}),
        headers: {
        "Content-Type": 'application/json'}
      })
      .then(response =>response.json())
      .then(json => { build(json,json.id);
     }))}
})
