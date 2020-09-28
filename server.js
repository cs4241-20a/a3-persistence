// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const session = require('express-session')
// const cookieSession = require("cookie-session")
const passport = require('passport')
const bodyparser = require("body-parser")
const timeout = require("connect-timeout")


app.use(function (req, res, next) {
    res.setTimeout(120*1000, function () {
        console.log("Request has timed out.");
        return res.status(408).send("time out!")
    });
    next();
});

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// our default array of dreams
const dreams = [
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  // response.sendFile(__dirname + "/views/index.html");
  // response.redirect('/loginto')
  response.sendFile(__dirname + "/views/loginPage.html");
});


// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



//for db
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://a3:${process.env.DBPASSWORD}@cluster0.yb7yq.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null
client.connect(err => {
  collection = client.db("mgdb").collection("tester");
});

app.post('/add', bodyparser.json(), function( req, res ){
  console.log('body:',req.body)
  collection.insertOne( req.body)
    .then( dbresponse=>{
       console.log( dbresponse.insertedId )
       res.json(dbresponse.insertedId)
  })
})

app.get('/getId', bodyparser.json(), function( req, res ){
  res.json(userId)
})

app.post('/delete', bodyparser.json(), function( req, res ){
  console.log('delete body:',req.body)
  collection.deleteOne({_id:mongodb.ObjectID(req.body.id)})
     .then(result=>res.json(result))
})
app.post('/modify', bodyparser.json(), function( req, res ){
  console.log('modify body:',req.body)
  collection.replaceOne({_id:mongodb.ObjectId(req.body.id)},{yourname:req.body.yourname,gender:req.body.gender,
                                                            currentYear:req.body.currentYear, expectedYear:req.body.expectedYear
                                                            ,userId:req.body.userId})
     .then(result=>{
    res.json(result)
  })
  console.log("got it")
})
app.post('/populate', bodyparser.json(), function( req, res ){
  res.setHeader("Content-Type", "application/json")
  
  collection.find({userId:userId}).toArray()
  .then(items=>{
    res.end(JSON.stringify(items))
  })
  // .then(result=>{
  //   res.json(result)
  // })
})

app.get('/loginto', function( req, res ){
  console.log('redirected')
  // res.sendFile(__dirname + "/views/index2.html");
  res.redirect('/auth/github')
})
//





//for oauth
var GitHubStrategy = require('passport-github').Strategy;
var userId = ""
passport.use(new GitHubStrategy({
    clientID: "d70e4e4826279be1640f",
    clientSecret: "d6de1c8caa0c9f0cd0e20af4ff7c5b9ed9bc33e0",
    callbackURL: "https://a3-xchen0326.glitch.me/user/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   process.nextTick(function () {
    
    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
     console.log('profile',profile.id)
     userId = profile.id
    // and return that user instead.
    return done(null, profile);
  });
  }
));


app.get('/auth/github',
  passport.authenticate('github'));

app.get('/user/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
  console.log('user id',userId)
    res.redirect('/main');
  });
app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    req.logout()
    res.redirect('/'); //Inside a callback… bulletproof!
  });
  // delete req.session
  // res.redirect('/logoutMessage');
});

app.get('/main', function (req, res){
  res.sendFile(__dirname + "/views/main.html");
});
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/logoutMessage',(req,res)=>{
  res.send("You've logged out.")
})
//