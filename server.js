// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyparser = require("body-parser");

/* PASSPORT ADDITIONS */
app.get('/', (req, res) => res.sendFile('/views/auth.html', { root : __dirname}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: "688884ca4b9f79df989c",
    clientSecret: "99992c13b5dc0c95d2d30aff167d632066c4b28f",
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/success', (req, res) => res.sendFile('/views/index.html', { root : __dirname}));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });

/* END OF PASSPORT ADDITIONS */

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

DBPASSWORD = "9PYnye8sGzxBISC4"
// const uri = `mongodb+srv://test-user:${process.env.DBPASSWORD}@cluster0.ys3tz.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const uri = `mongodb+srv://test-user:9PYnye8sGzxBISC4@cluster0.ys3tz.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
});


/* get all dreams on initial load */
app.get("/dreams", (request, response) => {
  collection.find({ user: request.params.user }).toArray((err, docs) => {
    if (err) {
      // if an error happens
      response.send("Error in GET req.");
    } else {
      // if all works
      console.log(docs);
      response.send(JSON.stringify(docs)); // send back all users found with the matching username
    }
  });
});

app.post("/add", bodyparser.json(), function(req, res) {
  console.log("body: ", req.body);
  collection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
    console.log(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyparser.json(), function(req, res) {
  console.log("body: ", req.body);
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.post("/update", bodyparser.json(), function(req, res) {
  console.log("body: ", req.body);
  // collection
  //   .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
  //   .then(result => res.json(result));
  collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body.id) },
      { $set: { dream: req.body.dream } }
    )
    .then(result => res.json(result));
  console.log("json", res);
});
