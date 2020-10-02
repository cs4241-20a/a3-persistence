// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const app = express();
const cookieParser = require('cookie-parser');
const responseTime = require('response-time');
const morgan = require('morgan');
const timeout = require('connect-timeout');
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use( express.json() );
app.use(timeout('3s'))
app.use(cookieParser());
app.use(haltOnTimedout)
app.use(responseTime((req, res, time) => {
  console.log("Response Time: " + req.method, req.url, time + 'ms');
}));
app.use(haltOnTimedout)
app.use(morgan('tiny'))
app.use(haltOnTimedout)
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://StressUser:${process.env.DBPASSWORD}@cluster0.h4ew2.mongodb.net/stressdata?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client
  .connect()
  .then(() => {
    return client.db("stressdata").collection("stress");
  })
  .then(__collection => {
    collection = __collection;
    return collection.find({}).toArray();
  })
  .then(console.log);
app.get("/activities", (req, res) => {
  if (collection !== null) {
    collection
      .find({username:user})
      .toArray()
      .then(result => res.json(result));
  }
});

app.post("/add", bodyParser.json(), function(req, res) {
  console.log("body:", req.body);
  let activity = ''
    let description = ''
    
    if(req.body.stress === "Low"){
      if (req.body.time === "5 Minutes"){
        activity = 'Text a friend'
        req.body['activity'] = activity
      }if (req.body.time === "10 Minutes"){
        activity = 'Drink tea'
        req.body['activity'] = activity
      }else if (req.body.time === "30 Minutes"){
        activity = 'Do a face mask'
        req.body['activity'] = activity
      }else if (req.body.time === "1 Hour"){
        activity = 'Hang out with friends'
        req.body['activity'] = activity
      }
    }
    
    if(req.body.stress === "Moderate"){
      if (req.body.time === "5 Minutes"){
        activity = 'Make a to-do list'
        req.body['activity'] = activity
      }if (req.body.time === "10 Minutes"){
        activity = 'Listen to music'
        req.body['activity'] = activity
      }else if (req.body.time === "30 Minutes"){
        activity = 'Do a coloring page'
        req.body['activity'] = activity
      }else if (req.body.time === "1 Hour"){
        activity = 'Watch a movie'
        req.body['activity'] = activity
      }
    }
    
    if(req.body.stress === "High"){
      if (req.body.time === "5 Minutes"){
        activity = 'Controlled Breathing'
        req.body['activity'] = activity
      }if (req.body.time === "10 Minutes"){
        activity = 'Write a journal entry'
        req.body['activity'] = activity
      }else if (req.body.time === "30 Minutes"){
        activity = 'Meditate'
        req.body['activity'] = activity
      }else if (req.body.time === "1 Hour"){
        activity = 'Take a nap'
        req.body['activity'] = activity
      }
    }
  
  req.body['username'] = user
  
  collection.insertOne(req.body).then(dbresponse => {
    console.log(dbresponse);
    res.json(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyParser.json(), function(req, res) {
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.post("/modify", (req, res) => {
  console.log(req.body)
  collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body.id) },
      {
        $set: {
          stress: req.body.stress,
          time: req.body.time,
          activity: req.body.activity
        }
      }
    )
    .then(result => res.json(result));
});

let loginCollection = null;
client.connect().then(() => {
  loginCollection = client.db("stressdata").collection("login");
});

let user = null;
app.post("/login", bodyParser.json(), function(req, res) {
  loginCollection
    .find({ username: req.body.username, password: req.body.password })
    .toArray()
    .then(result => res.json(result));
  user = req.body.username;
});

app.post("/create", bodyParser.json(), function(req, res) {
  loginCollection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
  user = req.body.username;
});

app.post("/logout", bodyParser.json(), function(req, res) {
  user = null;
  console.log("hello")
});
