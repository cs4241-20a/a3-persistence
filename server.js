const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const responseTime = require('response-time')
const morgan = require('morgan')
const path = require('path')
const favicon = require('serve-favicon')
const passport = require('passport')
const GitHubStrategy = require("passport-github").Strategy;

require('custom-env').env('development')

/*
const mongodb = require('mongodb');
const { request, response } = require("express")
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://rfdolan:${process.env.MONGOPASSWORD}@cluster0.jpq6i.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
*/

const mongodb = require('mongodb')
const uri = `mongodb+srv://rfdolan:${process.env.MONGOPASSWORD}@cluster0.jpq6i.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient( uri, {useNewUrlParser: true, useUnifiedTopology: true})

let collection = null
let currentUser = null
let isGithubUser = false

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'webware' ).collection( 'creatures' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

// Automatically deliver all files in the public folder
app.use( express.static('public/images'))

// get json when appropriate
app.use( bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));

app.use( responseTime())

app.use(morgan('combined'))

app.use(favicon(path.join(__dirname, 'public','favicon.ico')))

app.use(passport.initialize())

// Serialize and deserialize functions needed for passport
passport.serializeUser( (user, done) => { done(null, user) })
passport.deserializeUser( (user, done) => { done(null, user)})

// Implementation of passport GitHubStrategy based on documentation
passport.use(new GitHubStrategy( {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
},
// Connect to db, access users, and add a new entry if current does not exits
// set user global and call cb
async (accessToken, refreshToken, profile, cb) =>{
    console.log('here')
    const ghcollection = await client.db("webware").collection("githubCollection");
   const githubUser = await ghcollection.find({userName: profile.username}).toArray(); 

   if (githubUser.length == 0) {
       await ghcollection.insertOne({ userName: profile.username});
   }
   await client.close();

   currentUser = profile.username
   isGithubUser = true

   cb(null, currentUser)
})
)

// Get for logging in that sends user to github to login
app.get('/auth/github', passport.authenticate('github'));

// Get for github callback that redirects to either main screen or login based on auth result
app.get('/oauth2/github/callback', passport.authenticate('github', { failureRedirect: '/'}), (req, res) => {
    console.log('help')
    res.redirect('/index.html')
})


app.use( (req, res, next) => {
    if( collection !== null) {
        next()
    } else {
        res.status( 503 ).send()
    }
})

// Get request for login / starting screen
app.get('/', (req, res) => {
    if(currentUser !== null) {
        console.log("user:",currentUser)
        res.sendFile(path.join(__dirname,'public/index.html'));
    } else {
        console.log('where')
        res.sendFile(path.join(__dirname,'public/login.html'))
    }
});

// If the user is not logged in, send a 403 and lock them out of accessing the page
app.get('/index.html', function (req, res){
  if(currentUser === ""){
      console.log('fhdjsf')
    res.sendStatus(403)
  }
  else {
      console.log('huh')
    res.sendFile(__dirname+'public/index.html')
  }
})

// Get request to check if a user is logged in
// send a 500 if not so that the user is sent back to the login screen
app.get('/loggedIn', function (req, res){
  if(currentUser == ""){
      console.log("hfdshf")
    res.sendStatus(500)
  }
  else{
      console.log("hfdshf")
    res.sendStatus(200)
  }
})


// Get everything
app.get( '/appData', (req, res) =>{
    // get stuff from db
    if(collection !== null ) {
        collection.find({ }).toArray().then( result => res.json( result ) )
    }
})

app.post( '/add', bodyparser.json(), ( req, res )=> {
    collection.insertOne(req.body ).then( result => res.json( result ))
  })

app.post( '/remove', bodyparser.json(), (req, res) => {
    collection.deleteOne({ _id: mongodb.ObjectID( req.body._id ) })
    .then( result => res.json( result))
})







const listener = app.listen( process.env.PORT, ()=> {
  console.log( 'Your app is listening on port ' + listener.address().port )
})