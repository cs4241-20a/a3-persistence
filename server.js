// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const GitHubStrategy = require("passport-github").Strategy;
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://mazeGeneratorPage:${process.env.DATABASEPASSWORD}@mazes.5kglj.mongodb.net/${process.env.DATABASEID}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.SESSIONSECRET, resave: true, saveUninitialized: true }));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.SECRET,
      callbackURL: "https://a3-margaretearnest.glitch.me/return"
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("index", { user: req.user });
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/login/github", passport.authenticate("github"));

app.get(
  "/return",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    res.render("index", { user: req.user });
  }
);

app.get("/profile", function(req, res) {
  // require('connect-ensure-login').ensureLoggedIn(),
  res.render("profile", { user: req.user });
});

app.get("/logout", function(req, res) {
  req.logout();
  delete req.session;
  res.redirect("/login");
});

// // make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

let collection = null;
client.connect(err => {
  collection = client.db("mazeDatabase").collection("mazeCollection");
});

app.post("/add", bodyParser.json(), function(req, res) {
  collection
    .insertOne(req.body) //req.body is full content of new item
    .then(dbres => {
      console.log(dbres);
      res.json(dbres.ops[0]);
    });
});

app.post("/delete", bodyParser.json(), function(req, res) {
  collection
    .deleteOne({ _id: mongodb.ObjectId(req.body._id) }) //req.body is the _id to be deleted
    .then(dbres => {
      res.json(dbres);
    });
});

app.post("/getUser", bodyParser.json(), function(req, res) {
  collection
    .find({ id: req.body.id }) //req.body is the user id
    .toArray()
    .then(dbres => {
      res.json(dbres);
    });
});

app.post("/update", bodyParser.json(), function(req, res) {
  collection
    .updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      { $set: { mazeName: req.body.mazeName, maze: req.body.maze } }
    ) //req.body is whole object, identify by _id
    .then(dbres => {
      res.json(dbres);
    });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
