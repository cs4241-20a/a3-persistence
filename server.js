require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { response } = require('express');
const mongodb = require('mongodb')


// checks for objects in the public folder
app.use(express.static('public'));

// default
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// get data for building initial table
app.get("/data", (request, response) => {
  // express helps us take JS objects and send them as JSON
  if (collection !== null) {
    collection.find({}).toArray().then(result => response.json(result));
  }
  //response.json(dbresponse.ops);
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://Jordan:${process.env.DB_PASS}@cluster0.i1bsg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null;
client.connect(err => {
  collection = client.db("scoreboard_db").collection("user_scoreboards");
  // perform actions on the collection object

});


// submits a new user to the scoreboard array from post method
app.post("/submit", bodyParser.json(), (request, response) => {
  console.log("The person is: " + request.body.name);
  collection
    .insertOne(request.body)
    .then(dbresponse => {
      response.json(dbresponse.ops[0]);
    })
  console.log("New user recorded!");
})

// deletes a user from the scoreboard array and returns new scoreboard
app.post("/delete", bodyParser.json(), (request, response) => {

  collection
    .deleteMany({"name": request.body.name})
    .then(result => response.json(result))
})

// modifies a given user's score and generates a new CPS, returns new scoreboard.
app.post("/modify", bodyParser.json(), (request, reponse) => {
  collection
    .updateMany()
    .then(result => response.json(result))

})