// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const body_parser = require("body-parser")
var timeout = require('connect-timeout')
var responseTime = require('response-time')
var morgan = require('morgan')
const app = express();

//database stuff
let db = null
const mongodb = require('mongodb');
const { request, response } = require("express");
const MongoClient = mongodb.MongoClient
const uri = "mongodb+srv://user:Redsox99@cluster0.ocd5q.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  db = client.db("Dreams")
})

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))
app.use(haltOnTimedout)
app.use(responseTime({
  digits: 2
}))

// server homepage
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.post('/login', timeout('5s'), body_parser.json(), haltOnTimedout, (request, response) => {
  console.log("username: " + request.body.username + " password: " + request.body.prassword)
  if(request.body.username === "username" && request.body.password === "password"){
    response.sendFile(__dirname + "/views/index.html");
  }
})

app.get("/index", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// log error responses
morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
})

app.use(responseTime((req, res, time) => {
  console.log(`${req.method} ${req.url}` + "Response Time: " + `${time}` + 'ms');
}))

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  db.collection("test").find({}).toArray()
    .then(result => {
      response.json(JSON.stringify(result))
      console.log(result)
    });
});

//add the data to the database
app.post('/add', timeout('5s'), body_parser.json(), haltOnTimedout, (request, response) => {
  // the request gets added to the local database
  // add the element to the remote database
  db.collection("test").insertOne(request.body)
    .then(dbRespons => {
      response.json(dbRespons.ops[0])
    })
})

// remove data from the database
app.delete('/delete', timeout('5s'), body_parser.json(), haltOnTimedout, (request, response) => {
  console.log(request.body.id)
  db.collection("test")
    .deleteOne({ _id: mongodb.ObjectID(request.body.id) })
    .then(results => response.json(results))
})

app.put('/change', timeout('5s'), body_parser.json(), haltOnTimedout, (request, response) => {
  db.collection("test").updateOne(
    { dream: request.body.id },
    { $set: { dream: request.body.name } }
  )
    .then(result => response.json(result))
})

const port = process.env.PORT || 3000

// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

//timeout handler
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next()
}