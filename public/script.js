const submit = function( e ) {
      // prevent default form action from being carried out
      try {
        e.preventDefault()
      }
      catch {
        //If I forced the submit button on window load just continue, this was not a form submission
      }

      const user = document.querySelector('#username');
      const timeOfDay = document.querySelector('#timeOfDay');
      const weather = document.querySelector( '#weather' ),
            notes = document.querySelector('#text-area'),
            aboveFreezing = document.querySelector('#above-freezing'),
            belowFreezing = document.querySelector('#below-freezing'),
            json = { user: user.value, time: timeOfDay.value, weather: weather.value, notes: notes.value, aboveFreezing: aboveFreezing.value, belowFreezing: belowFreezing.value },
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
  var table = '<thead><tr><th scope="col">#</th><th scope="col">User</th><th scope="col">Time</th><th scope="col">Weather</th><th scope="col">Notes</th><th scope="col">Freezing?</th></tr></thead>';
  
      for(var i = 0; i < json.length; i++) {
        var obj = json[i];
        console.log(obj);
        console.log(obj[0]);
        table+="<tr><td>" + obj['_id'] + "</td><td>" + obj['user'] + "</td><td>" + obj['time'] + "</td><td>" + obj['weather'] + "</td><td>" + obj['notes'] + "</td><td>" + obj['aboveFreezing'] + "</td></tr>";
      }
      document.getElementById("reports").innerHTML = table;
  window.scrollTo(0, 0);
}

window.onload = function() {
      const button = document.querySelector( '#report' )
      button.onclick = submit
      submit();
    }