

const express = require( 'express' )
const fs = require( 'fs' )
const path = require( 'path' )
const bodyParser = require( 'body-parser' )
const mongodb = require('mongodb')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const MongoClient = mongodb.MongoClient;
app     = express()

app.use(passport.initialize())
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `https://a3-truman-larson.herokuapp.com/auth/github/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, {profile})
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) { 
    done(null, user);
  });


app.use(passport.session())

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user.profile.username)
    res.redirect(`/views/index.html?username=${req.user.profile.username}&newUser=false`);
  });


var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('tiny', { stream: accessLogStream }))

app.use(compression())
app.use(helmet())

const uri = `mongodb+srv://tlarson:${process.env.MONGOPASS}@cluster0.wh7oc.mongodb.net/a3db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("a3db").collection("pickems");
  // perform actions on the collection object

});


app.use( express.static('./'))

app.get( "/", (request, response) => {
    response.sendFile(__dirname + "/views/login.html")
})

app.post( "/db", bodyParser.json(), (request, response) => {
    collection.findOne({username:request.body.username}).then(dbresponse=>{
        response.json(dbresponse)
    }).catch(err=>console.error(err))
})

app.post( "/verify", bodyParser.json(), (request, response) => {
    console.log(request.body)
    collection.findOne({username: request.body.username}).then(result =>{
        //console.log(result)
        // Response Codes: -1:Password incorrect, 0:User not found, 1:Password Correct
        let responseCode = -1
        if (result == null){
            responseCode = 0
            collection.insertOne(request.body).then(newResult => result = newResult)
        }
        else if (result.password == request.body.password){
            responseCode = 1
        }
        response.json({responseCode, result})
    }).catch(err => console.error(err))
    
})

app.post( "/add", bodyParser.json(), (request, response) => {
    collection.findOneAndUpdate({username:request.body.username}, 
                                {$set: {pickem:request.body.pickdata}})
        .then(dbresponse => {
            response.json(dbresponse)
    }).catch(err=>console.error(err))
})

app.post( "/delete", bodyParser.json(), (request, response)=>{
    collection.findOneAndUpdate({username:request.body.username}, 
                                 {$unset: {pickem:1}})
        .then(dbresponse => {
        response.json(dbresponse)
    }).catch(err=>console.error(err))
})

const listener = app.listen(process.env.PORT, () => {
    console.log("Listening on port " + listener.address().port)
})