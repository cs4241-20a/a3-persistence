const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { response } = require('express');

// our default array of dreams
let scoreboard = [
  { name: "Mr. Insano", cps: 105.1, clicks: 1051, seconds: 10, time: 7987989869 },
  { name: "Matthew", cps: 5.4, clicks: 54, seconds: 10, time: 7987097986986 }
];

// checks for objects in the public folder
app.use(express.static('public'));

// default
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// get data for building initial table
app.get("/data", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(scoreboard);
});

// submits a new user to the scoreboard array from post method
app.post("/submit", bodyParser.json(), (request,response) => {
  console.log("The person is: " + request.body.name);
  scoreboard.push(request.body);
  console.log("New user recorded!");
  response.json(scoreboard);
})

// deletes a user from the scoreboard array and returns new scoreboard
app.post("/delete", bodyParser.json(), (request, response) => {
  console.log("Deleting...");
  scoreboard = scoreboard.filter(data => data.name !==  request.body.name);
  response.json(scoreboard);
})

// modifies a given user's score and generates a new CPS, returns new scoreboard.
app.post("/modify", bodyParser.json(), (request, reponse) => {

  let cps = Math.round(((request.body.clicks) / request.body.seconds) * 10) / 10;
  // set user's cps to given cps

  response.json(scoreboard);
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://Jordan:lol@cluster0.i1bsg.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});