// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();
const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const app = express();
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const errorHandler = require('error-handler');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let user = process.env.DBUSERNAME;
let password = process.env.DBPASSWORD;
let name = process.env.DBNAME;
const uri = "mongodb+srv://" + user + ":" + password + "@cluster0.mzhnv.mongodb.net/" + name + "?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } );

app.use( session({ secret: process.env.A3_SECRET, resave: false, saveUninitialized: true, cookie: { secure: false } } ) );
app.use( express.json() );
app.use( express.static("public") );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( (request, response, next) => { next() } );

let collection = null;
let users = null;
client.connect(err => {
  collection = client.db('rink').collection("players");
  users = client.db('rink').collection("users");
});

passport.use(new LocalStrategy( {usernameField: 'coach', passwordField: 'password'}, function (coach, password, done) {
  users.find( {coach: coach, password: password} ).toArray()
    .then(function (result) {
      if(result.length >= 1){
        return done(null, coach);
      } else {
        return done(null, false, { message: "incorrect username/password"} );
      }
    })
  }
));

passport.serializeUser( function (user, done) {
  done(null, user);
});

passport.deserializeUser( function (user, done) {
  done(null, user);
});

passport.use(new GitHubStrategy({ clientID: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET, callbackURL: process.env.GITHUB_CALLBACK },
  async(accessToken, refreshToken, profile, cb) => {
    const docs = await users.find( { username: profile.username, github: true } ).toArray();
    const user = { username: profile.username, password: null, github: true };

    console.log("Processing", user);

    if(docs.length == 0){
      await collection.insertMany([user]);
    }

    const users = await collection.find( { username: profile.username, github: true } ).toArray();
    await client.close();
    cb(null, users[0]);
  }
));

app.get("/auth/github", passport.authenticate("github"));

app.get("auth/github/callback", passport.authenticate("github", {failureRedirect: "/"}), function(request, response){
    console.log(request.user);
    response.redirect("/");
});

app.post("/login", bodyParser.json(), passport.authenticate("local", { failureFlash: false }), function (request, response) {
    response.json( {username: request.user} );
});

app.post("/add", bodyParser.json(), function (request, response) {
  //add a new player
  collection.insertOne( request.body )
    .then( dbresponse => {
      response.json(dbresponse.ops[0]);
  })
});

app.post("/delete", bodyParser.json(), function (request, response) {
  //delete player
  collection.deleteOne( {_id: new mongodb.ObjectID(request.body.id) } )
    .then( dbresponse => response.json( dbresponse ));
});

app.post("/update", bodyParser.json(), function (request, response) {
  //edit a player
  collection.updateOne({_id:mongodb.ObjectID( request.body.id )}, {$set: {'number': request.body.number, 'firstName': request.body.firstName, 'lastName': request.body.lastName, 'experience': request.body.experience } })
    .then( dbresponse => {
      response.json(dbresponse);
  })
});

app.get("/results", function (request, response) {
  collection.find({ coach: request.headers.coach }).toArray()
    .then(players => {
      response.json(players);
    })
});

app.get("/", (_, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
