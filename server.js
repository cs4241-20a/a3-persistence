// server.js
// where your node app starts
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorhandler = require("errorhandler");
const path = require("path");
let currUserId = null;
let userCollection = null;
var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(cookieParser());


// start github auth
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      passReqToCallBack: true,
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: "https://a3-lara-padir.glitch.me/auth/github/callback"
    },

    function(accessToken, refreshToken, profile, done) {
      done(null, profile);

      console.log("got token");
    }
  )
);

// authenticate user here
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  function(req, res) {
    console.log("authenticate");
  }
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    res.sendFile(__dirname + "/views/form.html");
  }
);

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", bodyparser.json(), (req, res) => {
  res.sendFile(__dirname + "/views/index.html");

  console.log("Cookies: ", req.cookies);

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://lpadir:${process.env.DBPASSWORD}@cluster0.caywp.mongodb.net/datatest?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
});

app.post("/add", bodyparser.json(), function(req, res) {
  console.log("body:", req.body);
  collection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

/*app.post("/getAll", bodyparser.json(), (req, res) => {
  collection
    .find({user:req.user})
    .toArray()
    .then(result => res.json(result));
});*/

app.post("/delete", bodyparser.json(), function(req, res) {
  console.log("delete-body:", req.body);
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.post("/update", bodyparser.json(), (req, res) => {
  collection
    .updateOne(
     // { user: mongodb.ObjectID(req.body.user) },
      { _id: mongodb.ObjectID(req.body.id) },
      { $set: { dreams: req.body.dreams } }
    )
    .then(result => res.json(result));
});

app.post("/login", bodyparser.json(), function(req, res) {
  res.sendFile(__dirname + "/views/form.html");
  //{ user: mongodb.ObjectID(req.body.user) }
});

app.post("/logout", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});
