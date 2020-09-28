// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://user:abcdef123@cluster0.z38ps.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true});
let users = null;
client.connect(err => {
  users = client.db("test").collection("users");
  // perform actions on the collection object
});


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.post("/register", (request, response) => {
  users.insertOne(request.body).then( result => request.json( result ) )
})

// listen for requests :)
const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
