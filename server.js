// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var responseTime = require('response-time')
var compression = require('compression')
var morgan = require('morgan')
var timeout = require('connect-timeout')

app.use(responseTime((req, res, time) => {
  console.log(req.method, req.url, time + 'ms');
}));
app.use(compression())
app.use(morgan('combined'))
app.use(timeout('10s'))

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//go to login page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

// listen for requests
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://dbUser:${process.env.DBPASSWORD}@cluster0.yeato.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
});

//Add
app.post("/add", bodyParser.json(), function(req, res) {
  let json = { dream:req.body.dream, username:username }
  console.log("Adding: ", json);
  collection.insertOne(json).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

//Delete
app.post("/delete", bodyParser.json(), function(req, res) {
  console.log( "Removing: ", req.body )
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

//Edit
app.post("/edit", bodyParser.json(), function(req,res) {
  console.log("Editing: ", req.body)
  collection
    .updateOne(
      { _id:mongodb.ObjectID( req.body.id ) },
      { $set:{ dream:req.body.dream, username:username } }
    )
    .then( result => res.json( result ) )
})

//Gets items in list for specific user
app.get("/items", bodyParser.json(), function(req, res){
  console.log("Getting for:", username)
  var query = {username:username}
  collection.find(query).toArray()
    .then(result => res.json(result))
})

//2nd table
let userCollection = null;
client.connect(err => {
  userCollection = client.db("datatest").collection("users");
});

//Logs a user in
let username = null
app.post("/login", bodyParser.json(), function(req, res) {
  console.log( "Logging in:", req.body )
  username = req.body.username
  var query = {username:username, password:req.body.password}
  console.log("Finding user:", query)
  userCollection.find(query).toArray()
    .then(result => res.json(result))
});

//logs a user out
app.post("/logout", bodyParser.json(), function(req, res) {
  console.log( "Logging out:", req.body )
  username = null
  console.log("Logged out:", username)
});

//creates an account
app.post("/create", bodyParser.json(), function(req, res) {
  let json = { username:req.body.username, password:req.body.password }
  console.log( "Creating account: ", req.body )
  username = req.body.username
  console.log("Logged in:", username)
  userCollection.insertOne(json).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});