const bodyParser = require( 'body-parser' );    // 1. middleware for JSON parsing
// const cookieSession = require( 'cookie-session' )
const timeout = require( 'connect-timeout') // 2. middleware for checking for timeouts
const { request } = require('express');
const express = require( 'express' )
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID
const app = express()

app.set('trust proxy', 1 )




const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://project4:B58Hustler@cluster0.gmbny.mongodb.net/datatest?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
//   console.log( collection )
});

app.use( ( req, res, next ) => {    // 2. middleware for checking network connection
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

app.use( timeout( '7s' ) )
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
    // .insertOne( request.body )
    // .then( dbresponse => {
    //     response.json( dbresponse ) 
    // })
    .find( {id:1}).toArray()
    // .then( dbresponse => {
    //     console.log( dbresponse )
    // } )
    incomingLogin = request.body
    // console.log( incomingLogin )

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
    // console.log(request.body )
    updatedListing = request.body
    updatedListing.lister = currentUser
    collection
    .findOne( {id:parseInt(request.body.id), lister:currentUser})
    .then( dbresponse => {
        dbID = dbresponse._id
        collection
        .deleteOne({_id:ObjectID( dbID )})
        // .then( dbresponse => {
        //     console.log( dbresponse )
        // })
     } )
    collection  
        .insertOne( updatedListing )
        // .then( dbresponse => console.log( dbresponse ) )
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
    // console.log( request.body )
    // console.log( "request ID: " + request.body.id + ", lister: " + currentUser )
    collection
    .findOne( {id:parseInt(request.body.id), lister:currentUser})
    .then( dbresponse => {
        dbID = dbresponse._id

        collection
        .deleteOne({_id:ObjectID( dbID )})
        // .then( dbresponse => {
        //     console.log( dbresponse )
        // })
     } )
     collection
     .find( {lister: currentUser} ).toArray()
     .then( dbresponse => {
     console.log( "Loading user listings..." )

     listings[currentUser] = dbresponse
 })
    // .deleteOne( {lister:"tom", id:parseInt(request.id)})

    // .deleteOne({ _id:mongodb.ObjectID( dbID )})
    // .then( result => response.json( result ))

    response.json( listings[currentUser] )
    
})

// const dataIterator = function( incomingData, user, isUpdate, isDelete ) {
//     let dbID = null
//     for( var i = 0; i < listings[user].length; i++ ){
//         // console.log( "Listing ID: " + listings[i].id + " Delete ID: " + request.body.id )

//         if( listings[user][i].id === parseInt( incomingData.body.id ) ){
//             if( isDelete === true ){
//                dbID = listings[user][i].dbid
//                listings[user].splice( i, 1 )
//                console.log( "Removed Listing with ID: " + incomingData.body.id )
//                break
//             }
//             else
//             {
//                 listings[user][i] = incomingData.body
//                 console.log( "Updated Listing with ID: " + incomingData.body.id )
//                 dbID = listings[user][i].dbid
//                 break
//             }
//         }
//     }
//     // console.log( listings[user] )
//     return dbID
// }


// default data
const listings = {}
    //  "jobo": [
    // { cameramake: "Canon", cameramodel: "A-1", cameraformat: "35mm", price: 150, condition: 76, bargain: false, delete: false, id: 1 },
    // { cameramake: "Nikon", cameramodel: "FTn", cameraformat: "35mm", price: 95, condition: 90, bargain: true, delete: false, id: 2 },
    // { cameramake: "Yashica", cameramodel: "Mat124G", cameraformat: "6x6", price: 50, condition: 100, bargain: true, delete: false, id: 3 } ],
    // "zingo": [
    //     { cameramake: "Mamiya", cameramodel: "7", cameraformat: "6x7", price: 500, condition: 90, bargain: false, delete: false, id: 1 },
    //     { cameramake: "Nikon", cameramodel: "FT2", cameraformat: "35mm", price: 95, condition: 95, bargain: true, delete: false, id: 2 } ],
    //     "tom": [
    //         { cameramake: "Lomo", cameramodel: "Diana", cameraformat: "6x6", price: 10, condition: 25, bargain: false, delete: false, id: 1 } ]


//   const users = {}
    //   admin: "admin",
    //   jobo: "1234",
    //   zingo: "5555",
    //   tom: "tom"




app.listen(3000)