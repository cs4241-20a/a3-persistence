const submit = function( e ) {
      // prevent default form action from being carried out
      try {
        e.preventDefault()
      }
      catch {
        //If I forced the submit button on window load just continue, this was not a form submission
      }
  
      let weathers = "";
      const selected = document.querySelectorAll('#timeOfDay option:checked');
      const values = Array.from(selected).map(el => el.value);
      values.forEach(element => weathers += element + ' ');
  
      const user = document.querySelector('#username');
      const timeOfDay = document.querySelector('#timeOfDay');
      const weather = document.querySelector( '#weather' ),
            notes = document.querySelector('#text-area'),
            aboveFreezing = document.querySelector('#above-freezing'),
            belowFreezing = document.querySelector('#below-freezing'),
            json = { user: user.value, time: weathers, weather: weather.value, notes: notes.value},
            body = JSON.stringify( json )

      fetch( '/dashboard', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    body
      })
      .then( function( response ) {
        
        // do something with the reponse 
        console.log(response.json().then((data) => {
        responseJSON(data);
        }));;
      })

      return false
    }

function responseJSON(json) {
  document.getElementById("reportform").reset();
  console.log(json)
  var table = '<thead><tr><th scope="col">User</th><th scope="col">Time</th><th scope="col">Weather</th><th scope="col">Notes</th><th scope="col">Remove</th></tr></thead>';
  
      for(var i = 0; i < json.length; i++) {
        var obj = json[i];
        console.log(obj);
        table+="<tr><td>" + obj['user'] + "</td><td>" + obj['time'] + "</td><td>" + obj['weather'] + "</td><td>" + obj['notes'] + "</td><td><button type=\"button\" class=\"btn btn-outline-danger\" onclick=\"removeReport(\'" + obj['_id']  + "\');\">X</button></td></tr>";
      }
      document.getElementById("reports").innerHTML = table;
  window.scrollTo(0, 0);
}

function removeReport(id) {
  const user = document.querySelector('#username');
  const json = { remove: id, user: user.value},
        body = JSON.stringify( json )
  
  fetch( '/dashboard', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    body
  })
    .then( function( response ) { 
        // do something with the reponse 
        console.log(response.json().then((data) => {
        responseJSON(data);
        }));;
      })

}

window.onload = function() {
      const button = document.querySelector( '#report' )
      button.onclick = submit
      submit();
    }