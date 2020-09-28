const express = require("express");
const secrets = require("./secrets");
const bodyParser = require("body-parser");
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const app = express();
const auth = require('connect-ensure-login');

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const uri = `mongodb+srv://gratitude-robot:${ secrets.DBPASS }@a3-primary.4sekk.mongodb.net/${ secrets.DBNAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;
client.connect(err => {
  collection = client.db("test").collection("devices");
  console.log(collection);
});

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'hyperbolic paraboloid', resave: true, saveUninitialized: true }));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/login',
  // function(req, res){
  // res.render('login');
  (req, res)=> res.send('logged in')
  // }
);

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

app.get('/auth/github',
  passport.authenticate('github', { successReturnToOrRedirect: '/', failureRedirect: '/', failureFlash: 'Authentication Failed'}));

app.post('/auth/github',
  passport.authenticate('github', { successReturnToOrRedirect: '/', failureRedirect: '/', failureFlash: 'Authentication Failed' }), function login() {
    res.text("Authenticated");
  });

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

// ----------------------
// Requests and Responses
// ----------------------

app.get('/getRuns', function getRuns(request, response){
  const cursor = collection.find({}) // get everything
  cursor.toArray().then(array => {
    console.log(`Array data: ${JSON.stringify(array)}`);
    response.json(array);
  })
});

app.post('/addRun', bodyParser.json(), auth.ensureLoggedIn('/auth/github'), function addRun (request, response) {
  console.log(`Body of add run request: ${JSON.stringify(request.body)}`);
  collection.insertOne(request.body)
  .then(dbresponse => {
    console.log(`dbresponse: ${dbresponse}`);
    response.json( dbresponse.ops[0] );
  });
});

app.post('/deleteRun', bodyParser.json(), auth.ensureLoggedIn('/auth/github'), function deleteRun (request, response) {
  console.log(`ID to delete :${JSON.stringify(request.body.id)}`);
  collection.deleteOne({ _id:MongoDB.ObjectID( request.body.id ) })
    .then( result => response.json(result) );
});

app.post('/editRun', bodyParser.json(), function editRun (request, response) {

  collection.update({_id:MongoDB.ObjectID(request.body.id)}, request.body.run)
    .then( result => response.json(result));
});

app.post('/editRuns', bodyParser.json(), function editRuns (request, response) {
  let dataString = '';
  request.on('data', function( editedRuns ) {
    dataString += editedRuns;
    console.log(`Run received: ${dataString}`);
  });
  request.on('end', function() {
    let editedRuns = JSON.parse(dataString);
    for(let i = 0; i < editedRuns.length; i++) {
      editedRuns[i].speed = editedRuns[i].distance * 60 / editedRuns[i].time;
    }
    data.splice(0, data.length); // clear data
    for (let i = 0; i < editedRuns.length; i++) {
      data.push(editedRuns[i]);
    }
    console.log(`New runs: ${JSON.stringify(data)}`);
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain'});
    response.end();
  });
});