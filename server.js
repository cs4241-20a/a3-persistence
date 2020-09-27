// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const errorhandler = require("errorhandler");
const responseTime = require("response-time");
const timeout = require("connect-timeout");
const cors = require("cors");

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.use(morgan('tiny'));
app.use(responseTime());
app.use(timeout('10s'));
app.use(cors())
//app.use(errorhandler());

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// MongoDB codes
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = 
      `mongodb+srv://Jason:${process.env.DBPASSWORD}@cluster0.gi1ee.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});

let collection = null;
client.connect(err => {
  collection = client.db("A3").collection("A3");
});

app.post( '/add', bodyParser.json(), function( req, res) {
  collection.insertOne( req.body )
    .then( dbresponse => {
    res.json( dbresponse.ops[0] )
  })
});

app.post( '/delete', bodyParser.json(), function( req, res){
  collection.deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then( result => res.json( result))
})

app.get( '/tasks', (req,res) => {
  if( collection !== null ) {
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post( '/update', bodyParser.json(), (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectID( req.body.id ) },
      { $set:{ task : req.body.task, priority : req.body.priority, starttime : req.body.starttime } }
    )
    .then( result => res.json( result ) )
})