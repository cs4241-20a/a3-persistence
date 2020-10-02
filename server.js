// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
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

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

// sends user to the login page
app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

// sends user to the booklist page
app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://bookUser:${process.env.DBPASSWORD}@cluster0.20iyx.mongodb.net/bookdata?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

// connect the login collection to the server
let loginCollection = null
client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    loginCollection = client.db("bookdata").collection("login")
  })

// route to take the user input
// and find the correct log in
let user = null
app.post('/login', bodyParser.json(), function(req, res) {
  loginCollection.find({username: req.body.username, 
                        password: req.body.password}).toArray()
  .then (result => res.json(result))
  user = req.body.username
})

// route to take the user input
// and create a new user element
app.post('/create', bodyParser.json(), function(req, res) {
  loginCollection.insertOne(req.body)
  .then (dbresponse => {
    res.json(dbresponse.ops[0])
  })
  user = req.body.username
})

// route to reset the user and log them out
app.post('/logout', bodyParser.json(), function(req, res) {
  user = null
})

// connect the book collection to the server
let collection = null
client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db("bookdata").collection("book")
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  
// route to get all docs
app.get( '/books', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({username:user}).toArray().then( result => res.json( result ) )
  }
})

// route to add a new book entry for a specific user
app.post('/add', bodyParser.json(), function(req, res) {
  let hours = req.body.pages / 50;
  req.body["hours"] = hours;
  req.body['username'] = user;
  
  collection.insertOne(req.body)
  .then (dbresponse => {
    res.json(dbresponse.ops[0])
  })
})

// route to delete a book entry for a specific user
app.post('/delete', bodyParser.json(), function(req, res) {
  collection
    .deleteOne({ _id:mongodb.ObjectID( req.body.id ) })
    .then( result => res.json( result ) )
})

// route to update a book entyr to a specific user
app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectID( req.body._id ) },
      { $set:{ title: req.body.title, pages: req.body.pages, hours: req.body.hours} }
    )
    .then( result => res.json( result ) )
})
