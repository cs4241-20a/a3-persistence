const bodyParser = require( 'body-parser' );    // 1. middleware for JSON parsing
// const cookieSession = require( 'cookie-session' )
const timeout = require( 'connect-timeout') 
const responseTime = require( 'response-time' )
const StatsD = require( 'node-statsd' )
const { request } = require('express');
const express = require( 'express' )
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID


const app = express()
const stats = new StatsD()

stats.socket.on( 'error', function( error ) {
    console.error( error.stack )
})

app.set('trust proxy', 1 )




const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://project4:<pass>@cluster0.gmbny.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
//   console.log( collection )
});

app.use( responseTime( function ( req, res, time ) {
    var stat = (req.method + req.url).toLowerCase()
    .replace(/[:.]/g, '')
    .replace(/\//g, '_')
    stats.timing(stat, time)
}))

app.use( ( req, res, next ) => {    // 2. middleware for checking connection to the server
    if( collection !== null ) {
        next()
    } else {
        res.status( 503 ).send()
    }
})


var GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000"
    // callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
      console.log( "Successful authentication, redirect home.")
    res.redirect('/');
  });



let currentUser = null


app.use( function( req, res, next ) {
    console.log( "Incoming request for " + req.url )
    next()
} )
app.use( express.static( "public" ) );          // 3. more middleware 

app.use( timeout( '7s' ) )                      // middleware: setting timeouts for requests
// app.use(cookieSession({
//     name: 'session',
//     keys: ['key1', 'key2']
// }))

// app.use( bodyParser.json() )

app.get( "/", ( request, response ) => {
    response.sendFile(__dirname + "/views/login.html" );
} );

app.get( "/index", ( request, response ) => {
    response.sendFile(__dirname + "/views/index.html");
});

app.get( "/listings", ( request, response ) => {
    collection
    .find( {lister: currentUser} ).toArray()
    .then( dbresponse => {
        console.log( "Loading user listings..." )
        listings[currentUser] = dbresponse
    })
    response.json( listings[currentUser] )
});

app.post( "/logout", (request, response) => response)

app.post( "/login", bodyParser.json(),( request, response ) => {
    collection

    .find( {id:1}).toArray()

    incomingLogin = request.body


    var loginAttempt = { login: "bad" }
    collection
    .findOne( { username: incomingLogin.username }, {"_id" : 1} )
    .then( dbresponse => {
            // console.log( dbresponse )
            if( dbresponse === null ){
                collection.insertOne( incomingLogin )
                console.log( "adding user with username: " + incomingLogin.username )
                currentUser = incomingLogin.username
                loginAttempt.login = "good"
                listings[currentUser] = []
                response.json( loginAttempt )
            }else {
                if( dbresponse.password === incomingLogin.password ){
                    console.log( "all good" )
                    currentUser = incomingLogin.username
                    loginAttempt.login = "good"

                    // now let's track down their listings too
                    collection.find( {lister: currentUser} ).toArray()
                    .then( dbresponse => {
                        console.log( "Loading user listings..." )
                        listings[currentUser] = dbresponse
                        response.json( loginAttempt )
                    })

                }else{
                    console.log( "no")
                    loginAttempt.login = "bad"
                    response.json( loginAttempt )
                }
    } 
    } )
})

app.post( "/submit", bodyParser.json(), ( request, response ) => {
    // console.log(request.body )
    incomingData = request.body
    incomingData.lister = currentUser
    listingsLength = listings[currentUser].length
    // console.log( listingsLength )
    if( listingsLength === 0 ){
        incomingData.id = 1
        // listings[currentUser].push( incomingData )
    } else if( listings[currentUser][listingsLength - 1].id === listings[currentUser].length ){
        // the last ID and length matches!å
        incomingData.id = listings[currentUser].length + 1
        // listings[currentUser].push( incomingData )
      }else{
        for( var i = 0; i < listings.length; i++ ){
          if( listings[currentUser][i].id != i + 1 ){
            incomingData.id = i + 1
            // listings[currentUser].splice( i, 0, incomingData )
            break
          }
        }
      }
      collection
      .insertOne( incomingData )
      .then( dbresponse => {
        listings[currentUser].push( incomingData )
      })
      collection
      .find( {lister: currentUser} ).toArray()
      .then( dbresponse => {
          console.log( "Loading user listings..." )
          listings[currentUser] = dbresponse
      })
      response.json( listings[currentUser] )
})

app.post( "/update", bodyParser.json(), ( request, response ) => {

    updatedListing = request.body
    updatedListing.lister = currentUser
    collection
    .findOne( {id:parseInt(request.body.id), lister:currentUser})
    .then( dbresponse => {
        dbID = dbresponse._id
        collection
        .deleteOne({_id:ObjectID( dbID )})

     } )
    collection  
        .insertOne( updatedListing )

    collection
        .find( {lister: currentUser} ).toArray()
        .then( dbresponse => {
        console.log( "Loading user listings..." )

        listings[currentUser] = dbresponse
    })
    response.json( listings[currentUser] )

})

app.post( "/delete", bodyParser.json(), (request, response ) => {
    
    let dbID = null
    collection
    .findOne( {id:parseInt(request.body.id), lister:currentUser})
    .then( dbresponse => {
        dbID = dbresponse._id

        collection
        .deleteOne({_id:ObjectID( dbID )})

     } )
     collection
     .find( {lister: currentUser} ).toArray()
     .then( dbresponse => {
     console.log( "Loading user listings..." )

     listings[currentUser] = dbresponse
 })


    response.json( listings[currentUser] )
    
})

const listings = {}



app.listen(3000)