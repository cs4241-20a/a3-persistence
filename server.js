// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
// var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');
var compression = require('compression')
var responseTime = require('response-time')


app.use(cookieParser());
app.use(responseTime())
app.use(compression())


const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const uri = 'mongodb+srv://'+process.env.USERNM+':'+process.env.DBPASS+'@cluster0.txxox.mongodb.net/a3-dataset?retryWrites=true&w=majority'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
// const uri = "mongodb+srv://dbUser:${process.env.DBPASS}@cluster0.txxox.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'a3-dataset' ).collection( 'tasks' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  //.then( console.log )


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    console.log("not connected")
    res.status( 503 ).send()
  }
})



// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// route to get all docs
app.get( '/tasks', (req,res) => {
  console.log("request username task:", req.cookies.name)
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray()
      .then( result => {
      var currUser = req.cookies.name
      var userArray = []
      //console.log(result)
      for(var i =0 ; i<result.length; i++){
        console.log(result[i])
        console.log(result[i].username)
        if(result[i].username === currUser){
          userArray.push(result[i])
        }
      }
      res.json( userArray ) })
  }
})

app.post( "/login", bodyParser.json(), (request,response,next) => {
  console.log("given username:", request.body.username)
  response.cookie('name', request.body.username) //Sets name = express
  console.log(request.cookies.name)
  console.log("logging in");
  response.redirect('/success');
});

app.get('/getCookie', (req, res) => {
  res.json(req.cookies.name)
})


app.get('/success', (req, res) => {
  console.log("next page");
  res.sendFile(__dirname + "/views/listpg.html");
});

// // send the default array of dreams to the webpage
// app.get("/dreams", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(dreams);
// });


app.post("/add", bodyParser.json(), (request,response) => {
  //console.log("body:",request.body)
  // console.log(collection)
  request.body.username = request.cookies.name
  console.log("current username:", request.cookies.name)
  collection.insertOne(request.body)
    .then(dbresponse =>{
      console.log( "response: ",dbresponse.ops[0] )
      response.json(dbresponse.ops[0])
   })
  //var newTask = {dream: request.body.dream, status: request.body.status}

})

app.post( '/remove', bodyParser.json(), (req,res) => {
  collection
    .deleteOne({ _id:mongodb.ObjectID( req.body.id ) })
    .then( result => res.json( result ) )
})

app.post( '/update',bodyParser.json(), (req,res) => {
  console.log("trying to update", req.body)
  collection
    .updateOne(
      { _id:mongodb.ObjectID( req.body.id ) },
      { $set:{ status:req.body.status } }
    )
    .then( result => res.json( result ) )
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});





