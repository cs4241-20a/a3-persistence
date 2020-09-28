const express = require("express");
const secrets = require("./secrets");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const app = express();
const auth = require('connect-ensure-login');
const timeout = require('connect-timeout');

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const uri = `mongodb+srv://gratitude-robot:${ secrets.DBPASS }@a3-primary.4sekk.mongodb.net/${ secrets.DBNAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;
client.connect(err => {
  collection = client.db("test").collection("devices");
  console.log(collection);
});

app.use(timeout('5s'));
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

app.use(express.static("public"));
app.use(haltOnTimedout);

app.use(require('morgan')('combined'));
app.use(haltOnTimedout);
app.use(require('cookie-parser')());
app.use(haltOnTimedout);
app.use(require('express-session')({ secret: 'hyperbolic paraboloid', resave: true, saveUninitialized: true }));
app.use(haltOnTimedout);
app.use(passport.initialize());
app.use(haltOnTimedout);
app.use(passport.session());
app.use(haltOnTimedout);

app.use(require("express-lowercase-paths")());
app.use(haltOnTimedout);
app.use(require('serve-favicon')(path.join(__dirname, 'assets', 'favicon.png')));
app.use(haltOnTimedout);
app.use(require('helmet')({contentSecurityPolicy: false}));
app.use(haltOnTimedout);
app.use(require("connect-rid")({headerName: "x_rid"}));
app.use(haltOnTimedout);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(secrets.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// ----------
// Middleware
// ----------

passport.use(new GitHubStrategy({
  clientID: secrets.GITHUB_CLIENT_ID,
  clientSecret: secrets.GITHUB_CLIENT_SECRET,
  callbackURL: `${
    secrets.DOMAIN === "localhost" ? "http" : "https"
  }://${secrets.DOMAIN}:${secrets.PORT}/auth/github/callback`
},
function(accessToken, refreshToken, profile, cb) {
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
  return cb(null, profile);
}
));
app.use(haltOnTimedout);

app.get('/auth/github', 
  passport.authenticate('github', { successReturnToOrRedirect: '/', failureRedirect: '/', failureFlash: 'Authentication Failed'}));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

// ----------------------
// Requests and Responses
// ----------------------

app.get('/get-runs', auth.ensureLoggedIn('/auth/github'), function getRuns(request, response){
  const cursor = collection.find({"user": request.user.username}) // get everything
  cursor.toArray().then(array => {
    console.log(`Array data: ${JSON.stringify(array)}`);
    response.json(array);
  });
});

app.post('/add-run', bodyParser.json(), auth.ensureLoggedIn('/auth/github'), function addRun (request, response) {
  let runToAdd = request.body;
  runToAdd.user = request.user.username;
  console.log(`Adding run ${JSON.stringify(runToAdd)}`);
  collection.insertOne(request.body)
  .then(dbresponse => {
    console.log(`dbresponse: ${dbresponse}`);
    response.json( dbresponse.ops[0] );
  });
});

app.post('/delete-run', bodyParser.json(), auth.ensureLoggedIn('/auth/github'), function deleteRun (request, response) {
  console.log(`ID to delete :${JSON.stringify(request.body.id)}`);
  collection.deleteOne({ _id:MongoDB.ObjectID( request.body.id ) })
    .then( result => response.json(result) );
});

app.post('/edit-run', bodyParser.json(), auth.ensureLoggedIn('/auth/github'), function editRun (request, response) {
  let runToEdit = request.body.run;
  runToEdit.user = request.user.username;
  collection.update({_id:MongoDB.ObjectID(request.body.id)}, runToEdit)
    .then( result => response.json(result));
});

app.get('/user-existence', auth.ensureLoggedIn('/auth/github'), function userExistence (request, response) {
  //If there is no user
  if(!request.user.username) {
    res.json('none');
  }

  console.log(`Checking for user :${request.user.username}`);
  const cursor = collection.find({"username": request.user.username}) // get everything
  cursor.toArray().then(array => {
    console.log(`Array data: ${JSON.stringify(array)}`);

    // If no such user exists
    if(!array.length) {
      console.log(`Adding user ${request.user.username}`);
      collection.insertOne({username: request.user.username, new: false})
      .then(dbresponse => {
        console.log(`dbresponse: ${dbresponse}`);
        response.json({userState: 'false', username: request.user.username});
      });
    }
    // If such a user exists
    else {
      response.json({userState: 'true', username: request.user.username});
    }

  });
});