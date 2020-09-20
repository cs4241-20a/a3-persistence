const express = require("express");
const passport = require('passport');
const mongodb = require( 'mongodb' );
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session');
const { request, response } = require("express");
require('dotenv').config();
console.log(process.env.mongoAcc)
const mongoURI = `mongodb+srv://${process.env.mongoAcc}:${process.env.mongoPass}@cluster0.0ultu.mongodb.net/Cluster0?retryWrites=true&w=majority`
console.log(mongoURI)
const client = new mongodb.MongoClient( mongoURI, { useNewUrlParser: true, useUnifiedTopology:true })
let usersDB = null
let usersCollection = null;

  
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();

client.connect()
.then( () => {
  // will only create collection if it doesn't exist
  return client.db( 'users' ).collection('users');
})
.then( __collection => {
  // store reference to collection
  usersDB = __collection
  // blank query returns all documents
  return usersDB.find({ }).toArray()
})
.then( console.log );

const portNum = Number(process.env.PORT) || 3000;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    
    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}
));

// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("views"));

app.use( (req,res,next) => {
  if( usersDB !== null ) {
    next()
  }else{
    console.log('cannot connect to mongoDB')
    res.status( 503 ).send()
  }
})
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
})) 
app.use(bodyParser.json())
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
});

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('req.user')
    console.log(req.user)
    console.log('req.sess')
    console.log(req.session)
    res.redirect('/');
    
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
  // console.log("session:")
  // console.log(request.session)
});

app.post('/login', (request, response) => {
  let username = request.body.username;
  let pass = request.body.password;
  console.log(username, pass)
});

app.post('/register', (request, response) => {
  console.log('register')
  let username = request.body.username;
  let pass = request.body.password;
  let checkQuery = {'username': username}
  usersDB.find(checkQuery).toArray(function(err, result){
    if (err){
      throw err;
    }
    if (result.length == 1){
      response.json({code: 'found'})
    } else {
      usersDB.insertOne({'username': username, 'password': pass}).then(response.json( {code: 'new'} ) )
    }
  })
})


// listen for requests :)
const listener = app.listen(portNum, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
