// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://user:abcdef123@cluster0.z38ps.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true});
let users = null;
client.connect(err => {
  users = client.db("test").collection("users");
  // perform actions on the collection object
});


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      users.findOne({ user: username }, function(err, user) {
        if (err) { return done(err); }
        if (!userExists(username)) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (getPassword(username) !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
));


app.post("/register", (request, response) => {
  users.findOne({username: request.body.username}).then(result => {
    console.log(result);
    if(result !== null) {
      console.log("Username already exists");
    }
    else {
      users.insertOne(request.body).then();
    }
  })
});

// app.post('/login',
//     passport.authenticate('local', { successRedirect: '/',
//       failureRedirect: '/login',
//       failureFlash: true })
// );

// listen for requests :)
const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

async function userExists(username) {
  // checks to see if the username exists in the database
  users.findOne({username: username}).then(result => {
    console.log(result);
    return result !== null;
  })};

async function getPassword(username) {
  users.findOne({username: username}).then(result => {
    return result.password;
})};
