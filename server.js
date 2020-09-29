// https://a3-malek-elshakhs.glitch.me/user/signin/callback
var express = require("express"),
  app = express(),
  bodyparser = require("body-parser");

var helmet = require("helmet");
var morgan = require("morgan");
var compression = require("compression");
var githubAPI = require("github-oauth-express");

app.use(express.static("./"));
app.use(helmet());
app.use(morgan());
app.use(compression());

app.use( function( req, res, next) {
  morgan('tiny');
  next()
})

app.listen(3000);

const mongoDB = require("mongodb");
const MongoClient = mongoDB.MongoClient;

const uri = `mongodb+srv://mlshax:${process.env.DBPASSWORD}@cluster0.y6dt3.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let userCollection = null;
let meetCollection = null;
client.connect(err => {
  userCollection = client.db("Project3").collection("Users");
  meetCollection = client.db("Project3").collection("Meetings");
});

app.post("/add", bodyparser.json(), function(req, res) {
  userCollection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyparser.json(), function(req, res) {
  userCollection
    .deleteOne({ _id: mongoDB.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.post("/modify", bodyparser.json(), function(req,res) {
  userCollection
    .updateOne(
      { _id:mongoDB.ObjectID( req.body.id ) },
      { $set:{ user:req.body.user, pass:req.body.pass} }
    )
    .then( result => res.json( result ) )
})

app.get("/users", function(req, res) {
  userCollection.find().toArray().then(dbresponse => {
    res.json(dbresponse);
  })
})

app.post("/addMeeting", bodyparser.json(), function(req,res) {
  meetCollection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
})
         
app.post("/deleteMeeting", bodyparser.json(), function(req,res) {
  meetCollection
    .deleteOne({ _id: mongoDB.ObjectID(req.body.id) })
    .then(result => res.json(result));
})

app.post("/modifyMeeting", bodyparser.json(), function(req,res) {
  meetCollection
    .updateOne(
      { _id:mongoDB.ObjectID( req.body.id ) },
      { $set:{ title:req.body.title, start:req.body.start, end:req.body.end} }
    )
    .then( result => res.json( result ) )
})

app.post("/meetings", bodyparser.json(), function(req, res) {
  meetCollection.find({ "user": req.body.account }).toArray().then(dbresponse => {
    res.json(dbresponse);
  })
})

var githubAccount = "";

app.get("/githubAccount", function(req, res) {
  res.json(githubAccount);
})

githubAPI(
  app,
  {
    clientId: 'bbe908208af155698563',
    clientSecret: '1516869af941736a06c4ff45c574d756abc511c1',
    redirectURL: '/schedule.html'
  }
)
  .then(authToken => {
    githubAccount = authToken;
    console.log('authToken:', authToken);
  })
  .catch(err => console.log(err));