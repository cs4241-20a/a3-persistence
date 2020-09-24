// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const secrets = require("secrets").DB;
const bodyParser = require("body-parser");
const app = express();

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const uri = `mongodb+srv://gratitude-robot:${ process.env.DBPASS }@a3-primary.4sekk.mongodb.net/${ process.env.DBNAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;
client.connect(err => {
  collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log(collection);
  // client.close();
});


// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

app.post("/add", bodyParser.json(), (request, response) => {
  console.log(`request: ${request.body}`);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.post("/add", bodyParser.json(), function(req, res) {
  console.log(`body: ${req.body}`);
  collection.insertOne(req.body)
  .then(dbresponse => {
    console.log(`dbresponse: ${dbresponse}`);
    res.json( dbresponse.ops[0] );
  })
});

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', (req,res) => {
  collection
    .deleteOne({ _id:MongoDB.ObjectID( req.body._id ) })
    .then( result => res.json( result ) )
})