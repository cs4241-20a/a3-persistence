// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const ensure = require('connect-ensure-login');
const app = express();
const GitHubStrategy = require('passport-github').Strategy;
var currentUser = null;

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.SECRET,
    callbackURL: 'https://a3-margaretearnest.glitch.me/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/',
  function(req, res) {
    res.render('index', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/github',
  passport.authenticate('github'));

app.get('/return', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    currentUser = req.user
    res.render('index', { user: req.user });
  });

app.get('/profile',
  // ensure.ensureLoggedIn('/login'),
  function(req, res){
    res.render('profile', { user: currentUser });
  });

app.get('/logout', function(req, res){
  req.logout();
  currentUser = null
  res.redirect('/');
});

// // make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// // https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// // send the default array of dreams to the webpage
// app.get("/dreams", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(dreams);
// });

// app.post("/add", bodyParser.json(), (req, res) => {
//   dreams.push(req.body.dream)
//   res.json(req.body)
// })

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
