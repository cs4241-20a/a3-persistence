// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.

const path = require('path');

const port = 3000;

const express = require("express");

// Express middleware
const passport = require("passport");
const expressSession = require("express-session")
const bodyParser = require("body-parser");

const API = require("./API");

const app = express();
app.set('view engine', 'ejs');

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
  if(req.user) {
    return next();
  }
  else {
    res.redirect('/login')
  }
}

app.get('/', (req, res) => {
    // Homepage
    res.render('index', {title: "Home"});
});

app.get('/login/success', isAuthenticated, (req, res) => {
  res.render("login-success", {title: "Logged In!", message: "Successfully logged in!"});
})

app.get('/login/already', isAuthenticated, (req, res) => {
  res.render("login-success", {title:"Logged In!", message: "You're already logged in!"});
})

app.get('/login', function(req, res, next) {
    if(req.user) {
      res.redirect('login/already');
    }
    else {
      next();
    }
  },
  (req, res) => res.redirect('/auth/github'))

app.get('/auth/github', function(req, res, next) {

  // generate the authenticate method and pass the req/res
  passport.authenticate('github', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    
    //return res.redirect('/secure')
    
  })(req, res, next);

});

// app.get('*/style.css', (req, res) =>  {
//   res.sendFile(path.join(__dirname + "/views/style.css"))
// })

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to confirmation page
    res.redirect('/login/success');
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Endpoint to show all recipes in database
app.get('/recipes/all', (req, res, next) => {
  res.render('results', {title: "All Recipes"})
})

app.get('/recipes/my', isAuthenticated, (req, res) => {
  res.render('myrecipes', {title: "My Recipes", userID: req.user.id})
})

// API endpoint to get recipe data
app.get('/recipes/data', isAuthenticated, (req, res) => {
  const userID = req.query.userID;
  console.log("GOT userid: ",  userID)
  API.getRecipesNoID(userID)
  .then((data) => {
    console.log("RESULT: ", data)
    res.send(JSON.stringify(data))
  })
})

// Endpoint for view with form to add recipes
app.get('/recipes/add', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname + '/views/addrecipe.html'))
})

// Endpoint for submitting recipe
app.post('/recipes/add', isAuthenticated, bodyParser.json(), (req, res) => {
  // Set user ID so we know whose recipe it is
  req.body.userID = req.user.id;
  console.log(req.body);
  API.insert(req.body)
  .then(
    res.send("Recipe submitted!")
  )
})

app.post('/recipes/delete', isAuthenticated, bodyParser.json(), (req, res) => {
  API.tryDelete(req.body.userID, req.body.recipeID)
  .then(res.send("Deleted recipe!"))
})

app.get('*', (req, res) => {
  res.render("404", {title: "404 Error"});
})