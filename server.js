// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.

const path = require('path');
const port = 3000;

const express = require("express");

// Express middleware
const handlebars = require("express-handlebars");
const passport = require("passport");
const expressSession = require("express-session")
const bodyParser = require("body-parser");

const API = require("./API");

const app = express();

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({
    layoutsDir: __dirname + '/views/layouts',
}));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// PassportJS
var GitHubStrategy = require('passport-github').Strategy;

app.use(expressSession({
   secret: 'cookie_secret',
    name: 'cookie_name',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://a3-sammoran.glitch.me/auth/github/callback/"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile.id)
    return cb(null, profile)
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Check if user is authenticated. If so, send them thru, if not make them login
function isAuthenticated(req, res, next) {
  console.log("IN ISAUTHENTICATED!", req.user)
  if(req.user) {
    return next();
  }
  else {
    res.redirect('/login')
  }
}

app.get('/', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('home', {layout : 'main'});
});

app.get('/login', (req, res) => res.redirect('/auth/github'))

app.get('/secure', (req, res) => {
    // Check logged in
    if(req.user) {
        res.sendFile(path.join(__dirname + '/views/secure.html'))
    }
    else {
        res.status(400).send({
            message: "You're not logged in!"
        })
    }
})

app.get('/auth/github', function(req, res, next) {

  // generate the authenticate method and pass the req/res
  passport.authenticate('github', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    
    //return res.redirect('/secure')
    
  })(req, res, next);

});

app.get('*/style.css', (req, res) =>  {
  res.sendFile(path.join(__dirname + "/views/style.css"))
})

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to secure site
    res.redirect('/recipes/add?id=' + req.user.id);
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Endpoint to show results
app.get('/results', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/views/results.html'))
})

// Endpoint for all recipes
app.get('/recipes/results', isAuthenticated, (req, res) => {
  API.getAllRecipes()
  .then((data) => {
    console.log("RESULT: ", data)
    res.send(JSON.stringify(data))
  })
})

// Endpoint for submitting recipe
app.post('/recipes/add', isAuthenticated, bodyParser.json(), (req, res) => {
  console.log(req.body);
  // Set user ID so we know whose recipe it is
  req.body.user = req.user;
  API.insert(req.body, req.user);
  res.send("Recipe submitted");
})

// Endpoint for view with form to add recipes
app.get('/recipes/add', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname + '/views/addrecipe.html'))
})