// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express")
const app = express();
const bodyParser  = require('body-parser')
const validationResult = require('express-validator')
const passport = require("passport")
const mongodb = require('mongodb')
const GitHubStrategy = require('passport-github').Strategy;
const MongoClient = mongodb.MongoClient;
//YOU CHANGE THIS
const uri = `mongodb+srv://plain:${process.env.dbpassword}@cluster0.wybmy.mongodb.net/<dbname>?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true });


let collection  = null
client.connect(err => {
  //YOU CHANGE THIS
  collection = client.db("Assignment3").collection("Users");
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});
//I could not make this work and I have no idea why
app.get("/index", (request, response) => {
  response.redirect("/views/index.html")
});

app.post("/add", bodyParser.json(), (request, response) => {
  collection.insertOne( request.body )
    .then( dbresponse => {
          console.log(dbresponse)
          response.json(dbresponse.ops[0])
  })
})

app.post("/update", bodyParser.json(), (request, response) => {
  let query = {_id:request.id}
  let newVal = { $set : {event:request.event}}
  collection.updateOne({name:request.event.name}, newVal)
    .then(dbresponse => {
    response.json({"updated": true})
  })
})

app.post("/login", bodyParser.json(), (request, response) => {
  collection.insertOne(request.body)
    .then( dbresponse => {
    console.log(dbresponse.ops)
    response.redirect(__dirname + "/views/index.html")                 
  })
})

app.post("/delete", bodyParser.json(), (request, response) => {
  collection
    .deleteOne({_id:mongodb.ObjectID(request.body.id)})
    .then( result => response.json( result ))
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
