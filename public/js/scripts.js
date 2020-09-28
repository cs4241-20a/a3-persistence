//const { json } = require("body-parser")

window.onload = function () {
  const button = document.getElementById('submitbtn');
  button.addEventListener("click", submit);
  fetch('/load')
  .then((res) => res.json())
    .then((json) => {
      console.log(json)
      addToTable(json);
    })
  }

const submit = function (e) {
  console.log("button pushed")
    // prevent default form action from being carried out
    e.preventDefault()
    console.log("button pushed")
    const nameinput = document.querySelector('#yourname'),
      scoreinput = document.querySelector('#score'),
      locationinput = document.querySelector('#location'),
      table = document.getElementById('scoretable'),
      json = { yourname: nameinput.value, score: scoreinput.value, location: locationinput.value }
      body = JSON.stringify(json)
      console.log("parsed variables")

    fetch('/add', {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body
    })
      .then((appdata) => appdata.json())
      .then((json) => {
        addToTable(json);
      })

      return false
  }

  function deleteData(id) {
    fetch('/remove', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id })
    })
    .then((res) => res.json())
    .then((json) => addToTable(json));
}

       const addToTable = (data) => {
         const scoretable = document.getElementById('scoretable');
         scoretable.innerHTML = '';

         data.forEach(element => {
           scoretable.innerHTML += `
           <tr id='${element._id}row'>
              <td class='namedata'>${element.yourname}</td>
              <td class='scoredata'>${element.score}</td>
              <td class='locationdata'>${element.location}</td>
              <td>
                <button id='${element._id}delete'>Delete</button>
                </td>
                <td>
                <button>Edit</button>
                </td>
            </tr>
            `;
            
            var del = document.getElementById(`${element._id}delete`);
            del.addEventListener('click', () => {
                deleteData(element._id);
                console.log("deleted data");
            })


         });
         
         }
         
        

  