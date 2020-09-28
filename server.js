console.log(); // server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const port = 3000;
var compression = require('compression')



app.use(compression())
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/auth.html");
});

app.get("/home", (request, response) => {
  response.sendFile(__dirname + "/views/home.html");
});

app.use( function(req, res, next){
  console.log(req.url)
  next()
})

app.use(express.static('./'))



//listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});




//******************************************************github auth********************************************


const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("You have successfully logged in"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  GITHUB AUTH  */

const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = "fed330c0c6019e184f81"
const GITHUB_CLIENT_SECRET = "3d4227d1bb33fcb5a12768f240d74b7e7d19454a";

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });

//******************************************************github auth********************************************

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://lewj8:${process.env.DBPASSWORD}@a3cluster.kl647.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("Datatest").collection("test");
  console.log(collection);
  // perform actions on the collection object
});

app.post("/add", bodyparser.json(), function(req, res) {
  collection.insertOne(req.body).then(dbresponse => {
    console.log(dbresponse);
    res.json(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyparser.json(), function(req, res) {
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.post("/dreams", bodyparser.json(), function(req, res) {
  collection.find().toArray(function(e, d) {
    console.log(d.length);
    res.send(d);
  });
});

app.post("/update", bodyparser.json(), function(req, res) {
  collection
    .update({ _id: mongodb.ObjectID(req.body.id) }, {dream: req.body.txt})
    .then(result => res.json(result));
});

//;.updateOne({ _id: mongodb.ObjectID(req.body.id) }, req.body)