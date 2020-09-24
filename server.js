const express = require("express");
const secrets = require("./secrets");
const bodyParser = require("body-parser");
const app = express();

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const uri = `mongodb+srv://gratitude-robot:${ secrets.DBPASS }@a3-primary.4sekk.mongodb.net/${ secrets.DBNAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;
client.connect(err => {
  collection = client.db("test").collection("devices");
  console.log(collection);
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(secrets.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// ----------------------
// Requests and Responses
// ----------------------

app.get('/getRuns', function getRuns(request, response){
  const cursor = collection.find({}) // get everything
  cursor.toArray().then(array => {
    console.log(`Array data: ${JSON.stringify(array)}`);
    response.json(array);
  })
});

app.post('/addRun', bodyParser.json(), function addRun (request, response) {
  console.log(`Body of add run request: ${JSON.stringify(request.body)}`);
  collection.insertOne(request.body)
  .then(dbresponse => {
    console.log(`dbresponse: ${dbresponse}`);
    response.json( dbresponse.ops[0] );
  });
});

app.post('/deleteRun', bodyParser.json(), function deleteRun (request, response) {
  console.log(`ID to delete :${JSON.stringify(request.body.id)}`);
  collection.deleteOne({ _id:MongoDB.ObjectID( request.body.id ) })
    .then( result => response.json(result) );
});

app.post('/editRuns', bodyParser.json(), function editRuns (request, response) {
  let dataString = '';
  request.on('data', function( editedRuns ) {
    dataString += editedRuns;
    console.log(`Run received: ${dataString}`);
  });
  request.on('end', function() {
    let editedRuns = JSON.parse(dataString);
    for(let i = 0; i < editedRuns.length; i++) {
      editedRuns[i].speed = editedRuns[i].distance * 60 / editedRuns[i].time;
    }
    data.splice(0, data.length); // clear data
    for (let i = 0; i < editedRuns.length; i++) {
      data.push(editedRuns[i]);
    }
    console.log(`New runs: ${JSON.stringify(data)}`);
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain'});
    response.end();
  });
});