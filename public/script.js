let clickcount = 0;
let seconds = 0;
let cps = 0;
let time = 0;

//when start button is clicked swap visibilities and start 30 second timer.
function startClicked() {
  seconds = document.getElementById('customseconds').value;
  if (seconds > 0) {
    console.log("Game started!");
    document.getElementById('customseconds').style.display = "none";
    document.getElementById('startbtn').style.display = "none";
    document.getElementById('currentclicks').innerHTML = "Click the button to start earning points!";
    var classes = document.getElementsByClassName('poststart');
    for (var i = 0; i < classes.length; i++) {
      classes[i].style.display = "block";
    }
    setTimeout(end, seconds * 1000); //after 3 seconds...
  } else {
    alert("Please give seconds greater than 0");
  }
}


//increments number of clicks by 1 per click.
function addClicked() {
  clickcount += 1;
  document.getElementById('currentclicks').innerHTML = clickcount + " Points";
}

//after timer is elapsed disable button and allow recording.
function end() {
  console.log("time is up");
  document.getElementById('clickbtn').style.display = "none"; //make click button disappear
  alert("You've run out of time!"); //give user alert to know of change

  if (clickcount === 0) {
    document.getElementById('currentclicks').innerHTML = "Wow... you didn't even try";
    document.getElementById('startbtn').style.display = "block";
  } else {
    document.getElementById('currentclicks').innerHTML = "You scored: " + clickcount + " Points!";
    cps = Math.round((clickcount / seconds) * 10) / 10;
    time = Date.now();
    console.log("Click count"+ clickcount + "seconds:" + seconds + "cps:" + cps);

    //make game recording buttons appear
    let classes = document.getElementsByClassName('postgame'); 
    for (var i = 0; i < classes.length; i++) {
      classes[i].style.display = "block";
    }
  }
}

const submit = function (e) {
  //prevent default form action from being carried out
  e.preventDefault();

  if (document.getElementById('yourname').value === "") {
    alert("Please don't leave the name blank");
    return false;
  }

  //construct a new user's score to be submitted for storage
  const userScore = {
    name: document.getElementById('yourname').value,
    cps: cps,
    clicks: clickcount,
    seconds: seconds,
    time: time
  }

  //send the userScore after json conversion and receive the new scoreboard 
  fetch('/submit', {
    method: 'POST',
    body: JSON.stringify(userScore),
    headers:{
      "Content-Type": "application/json"
    }
  })
    .then(function (response) {
      //response
      response.json().then(function (data) {
        //data
        console.log("Submit Response:", response);
        console.log("Returned data: ", data);
        restartGame();

        buildTable(data);
      })
    })

  return false;
}

const deleteName = function (e) {
  //prevent default form action from being carried out
  e.preventDefault();

  const delName = {
    name: document.getElementById('delname').value
  }
  // if (delName.name == "Mr. Insano") {
  //   alert("Well well well, looks like someone couldn't beat Mr. Insano like a true pro... tsk tsk");
  // }

  const body = JSON.stringify(delName);

  fetch('/delete', {
    method: 'POST',
    body
  })
    .then(function (response) {
      //response
      response.json().then(function (data) {
        //data
        console.log("Delete Response:", response);
        console.log("Returned data: ", data);

        buildTable(data);
        document.getElementById('delname').value = "";
      })
    })

  return false;
}

//what to do after name is stored in server
function restartGame() {
  console.log("Restarting game...");
  clickcount = 0;


  document.getElementById('yourname').value = "";
  document.getElementById('currentclicks').style.display = "none";
  document.getElementById('inputname').style.display = "none";
  document.getElementById('yourname').style.display = "none";
  document.getElementById('submitbtn').style.display = "none";
  document.getElementById('startbtn').style.display = "block";
  document.getElementById('customseconds').style.display = "block";
  document.getElementById('customseconds').value = "Please input seconds here";
}

//generate a table for displaying under score
function buildTable(newScoreboard) {

  //sort by clicks per second
  newScoreboard.sort((a, b) => b.cps - a.cps);

  let table = document.getElementById('scoretable');
  //for building the scoreboard header for the table
  let newTable =
    '<tr>\n' +
    '<th>Placing</th>\n' +
    '<th>Player Name</th>\n' +
    '<th>Clicks Per Second</th>\n' +
    '<th>Total Clicks</th>\n' +
    '<th>Seconds</th>\n' +
    '<th>Input Time (H:min)</th>\n' +
    '</tr>\n';

  //for populating the scoreboard with scores.
  for (let i = 0; i < newScoreboard.length; i++) {
    let d = new Date(newScoreboard[i].time);
    let s = d.getMinutes();
    // if ((d.getMinutes() % 10) == 0) {
    //   s = d.getMinutes().toString() + "0";
    // }
    if (d.getMinutes() < 10) {
      s = "0" + d.getMinutes().toString();
    }
    newTable += ('<tr>\n');
    newTable += (`<td> #${i + 1}</td>\n`);
    newTable += (`<td> ${newScoreboard[i].name}</td>\n`);
    newTable += (`<td> ${newScoreboard[i].cps}</td>\n`);
    newTable += (`<td> ${newScoreboard[i].clicks}</td>\n`);
    newTable += (`<td> ${newScoreboard[i].seconds}</td>\n`);
    newTable += (`<td> ${d.getHours()}:${s}</td>\n`);
    newTable += ('</tr>\n');
  }
  table.innerHTML = newTable;
  //console.log("Table populated: \n" + table.innerHTML);
}

//get the table data for generating the table on load.
function initializeTable(){
  fetch('/data', {
    method: 'GET'
  })
    .then(function (response) {
      //response
      response.json().then(function (data) {
        //data
        console.log("Data Response:", response);
        console.log("Returned data: ", data);

        buildTable(data);
      })
    })

  return false;
}

window.onload = function () {
  const button = document.getElementById('submitbtn');
  button.onclick = submit;
  const delbutton = document.getElementById('delbtn');
  delbutton.onclick = deleteName;
  document.getElementById('customseconds').value = "Please input seconds here";
  document.getElementById('clickbtn').style.display = "none";
  document.getElementById('currentclicks').style.display = "none";
  document.getElementById('inputname').style.display = "none";
  document.getElementById('yourname').style.display = "none";
  document.getElementById('submitbtn').style.display = "none";
  initializeTable();
  console.log("Loaded!");
}