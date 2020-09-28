// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const session = require('express-session');
const responseTime = require('response-time');

const passport = require("passport");
const Strategy = require("passport-github").Strategy;

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://webware_3:${process.env.DBPW}@cluster0.6tevw.mongodb.net/webware?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let githubID = null;
let githubName = null;

passport.use(
  new Strategy(
    {
      clientID: process.env["GIT_ID"],
      clientSecret: process.env["GIT_SECRET"]
    },
    function(accessToken, refreshToken, profile, cb) {
      githubID = profile.id;
      githubName = profile.displayName;

      console.log("Signed in as: " + githubID + ", " + githubName);
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
//app.use(favicon()
app.use(session({secret: "webware is super duper cool", resave: true, saveUninitialized: true}));
app.use(responseTime());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", passport.authenticate("github"), function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      console.log(githubID + "("+ githubName +")"+ "visited this page " + req.session.page_views + " times");
      res.send();
   } else {
      req.session.page_views = 1;
      console.log( githubID + "("+ githubName +")"+ "this page for the first time!");
     res.send();
   }
});

app.get(
  "/success",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/index.html");
  }
);

let collection = null;
client.connect(err => {
  collection = client.db("webware").collection("watchlist");
  // perform actions on the collection object
  //client.close();
});

app.get("/index.html", (request, response) => {
  //clear();
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/submit", bodyParser.json(), (request, response) => {
  let userDoc = {};

  console.log(request.body);

  collection.findOne({ userID: githubID }).then(dbresponse => {
    userDoc = dbresponse;
    if (userDoc === null) {
      let list = [];
      list.push(request.body.data);
      let data = { userID: githubID, name: githubName, list: list };
      collection.insertOne(data).then(dbresponse => {
        response.json(dbresponse.ops[0]);
      });
    } else {
      let list = userDoc.list;
      let duplicate = false;
      for (let i = 0; i < list.length; i++) {
        if (request.body.data.title === list[i].title) {
          duplicate = true;
          list[i].rating = request.body.data.rating;
        }
      }
      if (duplicate === false) list.push(request.body.data);
      list.sort(function(a, b) {
        return b.rating - a.rating;
      });
      collection
        .replaceOne(
          { userID: githubID },
          { userID: githubID, name: githubName, list: list }
        )
        .then(dbresponse => {
          console.log("Updated entry.");
          response.json(dbresponse.ops[0]);
        });
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

async function clear() {
  await collection.deleteMany({});
}
