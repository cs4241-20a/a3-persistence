const dotenv = require('dotenv').config()
const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const errorhandler = require('errorhandler')
const responseTime = require('response-time')
const timeout = require('connect-timeout')

app.use(express.static("public"));

// Error Handler
app.use(errorhandler({ log: errorNotification }))
function errorNotification (err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url

  notifier.notify({
    title: title,
    message: str
  })
}

// Response Time
const StatsD = require('node-statsd')
const stats = new StatsD()

app.use(responseTime(function (req, res, time) {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/[:.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
  console.log(time)
}))

// Timeout
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

app.get("/", responseTime(), (request, response) => {

  response.sendFile(__dirname + "/views/index.html");
});

app.get("/games", (request, response) => {
  getDBHighScore()
  response.sendFile(__dirname + "/views/game.html");
});

// route to get all docs
app.get( '/users', timeout('10s'), haltOnTimedout, (req,res) => {
  if( usercollection !== null ) {
    // get array and pass to res.json
    usercollection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.get("/admin", (request, response) => {
  response.sendFile(__dirname + "/views/admin.html");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// MongoDB
const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient;
const uri =`mongodb+srv://test:${process.env.DBPASS}@cluster0.5dhbz.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null
let usercollection = null

let adminname = null
let adminpass = null

let currentPlayerID = null

client.connect(err => {
  usercollection = client.db("dbtest").collection("test_users");
  
  usercollection.find({admin: {$in: [true]}}).toArray( (err , result) => {
    adminname = result[0].name
    adminpass = result[0].pass
  })
  
});

app.post( '/add', bodyparser.json(), function (req, res) {
  usercollection.insertOne( req.body )
    .then( dbresponse => {
      res.json(dbresponse.ops[0])
    })
})

app.post( '/modify', bodyparser.json(), function (req, res) {

  ID =  req.body.modifyId
  field = req.body.modifyField
  newVal = req.body.modifyValue



  let update = { $set : {} };
  update.$set[field] = newVal;

  usercollection
    .update(
      { _id:MongoDB.ObjectID(ID) },
      update
    )
})

app.post( '/delete', bodyparser.json(), function (req, res) {
  usercollection.deleteOne({ _id:MongoDB.ObjectID(req.body.deleteID)})
    .then( result => res.json (result) )
  
})


// New Addition - login
app.post( '/login', bodyparser.json(), function (req, res) {
  username = req.body.username
  password = req.body.password
  auth = req.body.auth

  // check if admin
  if (auth === true || username === "admin"){
    if (username !== adminname){
      res.json({message:"liar"})
      return
    } else {
      if (password !== adminpass){
        res.json({message:"wrong password"})
        return
      } else {
        res.json({message:"admin"})
        return
      }
    }
  }

  // check if existed
  usercollection.countDocuments({name: {$in: [username]}})
    .then( (result) => {
      if (result > 0) {
        usercollection.find({name: {$in: [username]}}, { limit: 1 }).toArray( (err , result2) => {
          if (password !== result2[0].pass){
            res.json({message:"wrong password"})
            return
          } else {
            currentPlayerID = result2[0]._id
            res.json({message:"existed"})
            return
          }
        })
      } else {
        // New
        usercollection.insertOne({name:username, pass:password, admin:false, highScore:-1})
          .then( dbresponse => {currentPlayerID = dbresponse.ops[0]._id})
        res.json({message:"new"})
        return
      }
    })

  
}) 


// From Assignment 2 - server logic
let answer = "-1";
let lastSubmitted = "";
let highestSubmitted = "None";
let highScore = "None";
let DBHighScore = -1
let currentNickName = "None"

app.get( '/getAns', (req, res) => {
  answer = "" + Math.floor(Math.random() * 10);
  res.writeHeader( 200, "OK", { 'Content-Type': 'text/plain' })
  res.end( answer )
})

app.get ( '/getField', (req, res) => {
  rsp = [{"answer":answer},{"lastSubmitted":lastSubmitted},{"highestSubmitted":highestSubmitted},{"localHighScore":highScore}, {DBHighScore}, {currentNickName}]
    
  res.writeHeader( 200, "OK", { 'Content-Type': 'application/json' })
  res.end( JSON.stringify(rsp) )
})

app.post ( '/updateScore', (request, response) => {
  let tempScore
  request.on( 'data', function( data ) {
    let TAT = JSON.parse(data)
    tempScore = TAT["score"]
  })

  request.on( 'end', function() {
    if (highScore === "None") {
      highScore = tempScore
      updateHighScoreDB()
      highestSubmitted = lastSubmitted
    } else {
      if (parseInt(highScore) > parseInt(tempScore)){
        highScore = tempScore
        updateHighScoreDB()
        highestSubmitted = lastSubmitted
      }
    }
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end()
  })
})

app.post( '/submitAns', (request, response) => {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    parsed = JSON.parse( dataString ) 
    lastSubmitted = parsed["yourname"]
    console.log(lastSubmitted)

    if (lastSubmitted === answer){
      dataString = "succeed!"
    } else {
      dataString = "failed!"
    }

    // ... do something with the data here!!!

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(dataString)
  })
})

function updateHighScoreDB(){
  DBHighScore = highScore
  usercollection
    .updateOne(
      { _id:MongoDB.ObjectID( currentPlayerID ) },
      { $set:{ highScore } }
    )
}

function getDBHighScore(){
  usercollection.find({"_id":MongoDB.ObjectID(currentPlayerID)}).toArray((err, result) => {
    DBHighScore = result[0].highScore
  })
}