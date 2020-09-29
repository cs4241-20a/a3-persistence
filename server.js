// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyparser = require('body-parser');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const responseTime = require('response-time');
const timeout = require('connect-timeout');
const app = express();

let verUser = null;

app.use(timeout('120s'))
app.use(morgan('dev'))
app.use(cookieSession({
  name: 'session',
  keys: [0],
  
  maxAge: 24 * 60 * 60 * 1000
}))

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/index.html", (request, response) =>{
  response.sendFile(__dirname + "/views/index.html");
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://KaiserNex:${process.env.DBPASSWORD}@a3-cluster.enhbv.mongodb.net/datatest?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null
let loginCollection = null
client.connect(err => {
  collection = client.db("datatest").collection("test")
  loginCollection = client.db("datatest").collection("Accounts")
});

app.get("/pop",bodyparser.json(), (req,res) =>{
  collection.find({user: verUser}).toArray(function(err, result){
    if(err) throw err;
    console.log(result);
    res.json(result);
  })
})


app.post("/add", bodyparser.json(), (req, res) => {
  collection.insertOne({user: verUser,dream: req.body.dream})
  .then( dbresponse => {
    console.log( dbresponse )
    res.json( dbresponse.ops[0])
  })
})

app.post( '/delete', bodyparser.json(), function( req, res ) {
  collection
    .deleteOne({_id:mongodb.ObjectID( req.body.id ) })
    .then( result => res.json( result ) )
})

app.post("/edit", bodyparser.json(), (req, res) =>{
  console.log(req.body.old)
  collection
    .updateOne({dream:req.body.old}, {$set: {dream:req.body.new}})
  res.json({stuff: "test"});
})

app.post('/login', bodyparser.json(),(req, res) =>{
  console.log("Heyo")
  console.log(req.body.uname)
  loginCollection.find({uname: req.body.uname}).toArray(function(err, result){
    if (err) throw err;
    if(result.length == 0){
      loginCollection.insertOne({uname: req.body.uname, psw: req.body.psw})
      .then( dbresponse => {
        console.log( dbresponse.ops[0].uname )
        verUser = req.body.uname;
        res.json({newu: true,login: true})
      })
    }
    else{
      console.log(req.body.psw)
      console.log(result[0].psw)
      if(req.body.psw == result[0].psw) {
        verUser = req.body.uname;
        res.json({newu:false,login: true})
      }
      else{
        res.json({login: false})
      }
    }
  })
})