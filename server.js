// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
var path = require('path');
const axios = require('axios')
var cookieParser = require('cookie-parser')


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())
app.get('/success', (req, res) => 
        res.send("You have successfully logged in"));
app.get('/fail', (req, res) => res.send("error logging in"));
app.get('/logerin.html', (request, response) => {
  return response.render('/logerin.html');
});
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



const GitHubStrategy = require('passport-github').Strategy;
const redirect_uri = 'https://a3-alexa-freglette.glitch.me/user/callback'

const GITHUB_CLIENT_ID = "b43dade3174bab8be401";
const GITHUB_CLIENT_SECRET = "71d0121c4459c1eaddb817622f58424928b5e936";

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://a3-alexa-freglette.glitch.me/loginer.html"
  },
  function(accessToken, refreshToken, profile, cb) {
  //console.log(profile, accessToken, refreshToken);
  return cb(null, profile);
  }
));

app.use(express.static(__dirname + '/public'))
	

app.get('/auth/github',
  passport.authenticate('github'));

app.get('https://a3-alexa-freglette.glitch.me/loginer.html',
  passport.authenticate('github', { failureRedirect: 'https://a3-alexa-freglette.glitch.me/loginer.html' }),
  function(req, res) {
    res.redirect('https://a3-alexa-freglette.glitch.me/loginer.html');
  
  });

// Declare the redirect route
app.get('/loginer.html', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code
  axios({
    // make a POST request
    method: 'post',
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  })
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://afreg:${process.env.DBPASSWORD}@cluster0.k8sgr.mongodb.net/<dbname>?retryWrites=true&w=majority`; //make sure tis is right
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null


app.get('/', (req, res) => res.sendFile('index.html', { root : __dirname}));




app.route('/*').get(function(req, res) { 
   //  console.log('Cookies: ', req.cookies)
   //   console.log('Signed Cookies: ', req.signedCookies)
    return res.sendFile(path.join(__dirname, '/views/table.html')); 
});



let userid = null;


client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("webware").collection("webware");
  })
  .then(copycollection => {
    // store reference to collection
    collection = copycollection;
    // blank query returns all documents
    return collection.find({ username: userid }).toArray();
    console.log
  })
  .then(arr => {
   //console.log(arr);

  });


app.get("/error", function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Error Logging In!");
 next()

});


app.get("/results", function(req, res) {
  if (userid != null) {
    collection = client.db("webware").collection("webware");
    collection
      .find({username: userid})
      .toArray()
      .then(result => res.json(result));
  }
});

app.post('/add',bodyparser.json(), function(req,res,next){
  collection = client.db("webware").collection("webware");
  collection.insertOne(req.body)
   .then(dbresponse =>{
    res.json(dbresponse.ops)
    
    next();
  })
})

app.post('/remove', bodyparser.json(), function(req,res){
  collection = client.db("webware").collection("webware");
  collection.deleteOne({_id:mongodb.ObjectID(req.body.id)}) 
  .then (result => res.json(result))
})


app.post("/update", bodyparser.json(), (req, res) => {
  collection =client.db("webware").collection("webware");  
  var addtolist = "added to list";
    res.json(addtolist);
    collection.updateOne(
        {  _id:mongodb.ObjectID( req.body._id ) },
        { $set: { "onlist":"added to list" } }
      )
      .then(result => {
      });
  })

