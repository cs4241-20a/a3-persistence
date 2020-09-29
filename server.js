// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

let collection = null
let users = null
let name = "3"
const mongodb = require('mongodb')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://opinel98:Alarma22@cluster0.luw3v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
app.use(bodyparser.json())
client.connect(err => {
  console.log("DB conected");
  collection = client.db("table1").collection("Members_Log");
  //client.close();
});
//const mongodb = require('mongodb');




// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post('/add',bodyparser.json(),function(request, response){
  console.log(" in add function")
  collection.insertOne({nickname: request.body.nickname, distance: request.body.distance, time: request.body.time, date: request.body.date, description: request.body.description})
  .then(dbresponse => {
    response.json(dbresponse.ops[0]);
  })
})

// send the default array of dreams to the webpage
app.get("/loadAll", (request, response) => {
  if(collection !== null){
    collection.find({nickname: name}).toArray().then(result => {
      response.json(result)
    })
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



