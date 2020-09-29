// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('connect-flash');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://user:abcdef123@cluster0.z38ps.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true});
let users = null;
let posts = null;
client.connect(err => {
  users = client.db("test").collection("users");
  posts = client.db("test").collection("posts");
  // perform actions on the collection object
});
let user = null;

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(
    function(username, password, done) {
      users.findOne({ username: username }, async function(err, user) {
        if (err) { return done(err); }
        let doesUserExist = await userExists(username);
        if (!doesUserExist) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        let actualPassword = await getPassword(username);
        if (actualPassword !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        console.log(user);
        return done(null, user);
      });
    }
));

passport.serializeUser(function(user, done) {
  console.log(user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  users.findOne({_id: id}, function(err, user) {
    done(err, user);
  });
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/getusername", (request, response) => {
  console.log("trying for username");
  if (user !== null) {
    console.log("sending json");
    response.json({username: user});
  }
})

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

app.get("/loadData", async (request, response) => {
  let data = await posts.find({}).toArray();
  await response.json(data);
})

app.post("/addpost", (request, response) => {
  console.log(request.body);
  posts.insertOne(request.body).then(function () {
    console.log("post added");
  })
});

app.post("/editpost", async (request, response) => {
  let post = await posts.findOne({title: request.body.title});
  console.log(post);
  await response.json(post);
  // posts.findOne({title: request.body.title}).then(result => {
  //   console.log(result);
  //   response.json(result);
  // })
});

app.post("/deletepost", async (request, response) => {
  await posts.deleteOne({title: request.body.title});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/login', async function (req, res){
  passport.authenticate('local', { successRedirect: '/getusername',
    failureRedirect: '/login',
    failureFlash: true })
  let userData = req.body;
  let username = userData.username;
  let password = userData.password;
  let isActualUser = await userExists(username);
  if (isActualUser) {
    let actualPassword = await getPassword(username);
    if (actualPassword === password) {
      console.log("user logged in");
      user = username;
    }
    else {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(500);
  }
  return res.end();
});

// listen for requests :)
const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

async function userExists(username) {
  // checks to see if the username exists in the database
  let result = await users.findOne({username: username});
  return result !== null;
};

async function getPassword(username) {
  let result = await users.findOne({username: username});
  return result.password;
};
