// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
var errorhandler = require('errorhandler')
var session = require('express-session')
const Auth0Strategy = require('passport-auth0');
var favicon = require('serve-favicon');
var path = require('path')
var http = require('http')
var finalhandler = require('finalhandler')

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
//!!!!app.use(bodyparser.bodyparser.json)

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

//Database Connection
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://sadie:${process.env.DBPASS}@a3cluster.tryvi.mongodb.net/A3?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let a3collection = null;
let a3users = null;
client.connect(err => {
  a3collection = client.db("A3").collection("a3collection");
  a3users = client.db("A3").collection("a3users");
});

//adds the tasks to the database
app.post("/add", bodyparser.json(), function(req, res) {
  console.log("body:", req.body);
  a3collection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

//deletes the tasks in the database
app.post("/delete", bodyparser.json(), function(req, res) {
  console.log("delete body: ", req.body);
  a3collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

//updates the tasks in the database
app.post("/update", bodyparser.json(), (req, res) => {
  a3collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body.id) },
      { $set: { name: req.body.name } }
    )
    .then(result => {
      console.log("RESULT:", result.result.ok);
      res.json(result);
    });
});

//adds users to the database
app.post("/register", bodyparser.json(), function(req, res) {
  console.log("body:", req.body);
  a3users.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

//login user to their account
app.post("/login", bodyparser.json, function(req, res) {
  
  //find user with matching username and password
  a3users.find({
    $and: [
      { username: { $eq: req.body.username } },
      { password: { $eq: req.body.password } }
    ]
    //send to main.html
  }).then(cursor =>{
    
    if((cursor != null) && (cursor.getCount() > 0)){
      res.redirect("main.html?name=" + req.body.username);
    }else{
      alert("Incorrect login information.");
    }
  })
  
});

// send the default array of dreams to the webpage
app.get("/tasks", (req, res) => {
  //find all tasks associated with the given username
  a3collection.find({ username: { $eq: req.body.username } }) 
    .toArray()
    .then(result => {
      console.log("RESULT:", result);
      res.json(result);
    });

});
