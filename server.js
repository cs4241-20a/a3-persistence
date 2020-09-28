// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser")
const timeout = require("connect-timeout")
const morgan = require("morgan")
const compression = require("compression")
const app = express();



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});



// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.use(morgan('logged'))
app.use(compression())
app.use(timeout(10000))
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.nbm6a.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null
let logins = null
client.connect(err => {
  collection = client.db("BarDatabase").collection("barPatrons");
  logins = client.db("logins").collection("credentials");
});
app.post("/add", bodyParser.json(), function(req,res){
  collection.insertOne(req.body).then(dbresponse=>{
    //res.json(dbresponse.ops[0])
    collection.find({}).toArray(function(err, arr){
      res.json(arr)
    })
  })
})
app.post("/delete", bodyParser.json(), function(req,res){
  console.log(mongodb.ObjectID(req.body.id))
  collection.deleteOne({ _id:mongodb.ObjectID(req.body.id)})
  .then(result=> {
    res.json(result)
  })
})
app.post("/login", bodyParser.json(), function(req,res){
  logins.findOne({username:req.body.username})
  .then(loginResponse=>{
    res.json(loginResponse)
  })
})
app.post("/addUser", bodyParser.json(), function(req,res){
  logins.insertOne(req.body).then(loginResponse=>{
    res.json(loginResponse.ops[0])
  })
})