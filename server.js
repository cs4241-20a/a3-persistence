// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb"), ObjectID = require('mongodb').ObjectID;
const responseTime = require("response-time");
const StatsD = require('node-statsd')
const errorHandler = require("errorhandler")
const timeout = require("connect-timeout")
let stats = new StatsD();
let users = [];

const app = express();

// ` symbol lets us inject into strings
// create MongoDB client
const uri = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.nvzar.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true});

let collection = null; 
client.connect(err => {
  collection = client.db("a3").collection("classes");
  //console.log(collection)
  // perform actions on the collection object
});


// middleware packages
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(responseTime())
app.use(errorHandler())
app.use(timeout(1000))

// middleware to check DB connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.use(responseTime(function(req, res, time){
  let stat = (req.method + req.url).toLowerCase()
    .replace(/[:.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
  
}))

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});


app.post("/index", bodyParser.json(), function(req, response){
  //console.log("request received: index")
  console.log(req.body);
  // process login information
  let username = req.body.username
  let password = req.body.password
  let userExists = users.includes(username)
  if(userExists){
    for(let i=0;i<users.length;i++){
      if(users[i][1] === password){
        // success
      }
      else{
        console.log("Password failure");
      }
    }
  }
  else{
    let newUser = [username, password]
    users.push(newUser)
  }
  
  //response.json(req)
  response.redirect("/homepage");
});

app.get("/homepage", (req, res) =>{
  res.sendFile(__dirname + "/views/index.html")
  
})

app.get("app/views/index.html", (req, response) =>{
  response.redirect("app/views/index.html")
})

app.get("/classes", (req, res) =>{
  //console.log("request received: classes")
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// DB

app.post("/add", bodyParser.json(), function(req, res) {
  console.log("test")
  console.log("body:", req.body);
  collection.insertOne(req.body)
    .then(dbresponse => {
    console.log(dbresponse);
    res.json(dbresponse.ops[0]);
  })
});

app.post("/delete", bodyParser.json(), function(req, res){
  console.log("id =", req.body.id)
  let obj = mongodb.ObjectID(req.body.id);
  console.log(obj)
  let objid = "ObjectId(" + "\"" + obj + "\"" + ")"
  console.log(objid)
  collection
    .deleteOne({ _id: obj })
    .then( result => res.json( result ))
  //console.log(res);
})


/*app.post("/add", bodyParser.json(), (request, response) => {
  dreams.push(request.body.dream);
  response.json(request.body);
});*/