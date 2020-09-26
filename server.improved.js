const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      express = require( 'express' ),
      bodyparser = require( 'body-parser' ),
      compression = require( 'compression' ),
      responseTime = require( 'response-time' ),
      fetch = require( 'node-fetch' ),
      cookieSession = require( 'cookie-session' ),
      app = express(),
      port = 3000;

app.use( cookieSession({
  name: 'cooooookie krisps',
  keys: ['i want steak for dinner tonight'],
  secret: process.env.COOKIE_SECRET
}))
app.use( express.static( 'public' ) )
app.use( compression() )
app.use( responseTime( (request, response, time) => console.log( request.method, request.url, time + 'ms' ) ) )
app.use( bodyparser.json() )

// DB STUFF //
require('dotenv').config()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.lm4cx.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null
client.connect(err => {
  collection = client.db("assignment3").collection("db1");
});

app.get( '/', (request, response) => {
  if(request.session.GHid) {
    response.sendFile( __dirname + '/public/inv.html' ) 
  } else {
    response.sendFile( __dirname + '/public/login.html' )
  }
  //response.send("test: "+request.session.GHid)
})

// GITHUB LOGIN STUFF //
app.get('/geturl', (request, response) => {
  const path = request.protocol + '://' + request.get('host');
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GHID}&redirect_uri=${path}/login/github/callback`;
  response.json(url);
})

async function getAccessToken(code, client_id, client_secret) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      client_id,
      client_secret,
      code
    })
  })
  .then( response => response.text() );
  
  const params = new URLSearchParams(response);
  return params.get('access_token');
}

async function getGHUser(accessToken) {
  const request = await fetch('https://api.github.com/user', {
    headers: { Authorization: `bearer ${accessToken}`}
  })
  .then ( request => request.json() )

  return request;
}

app.get('/login/github/callback', async (request, response) => {
  const accessToken = await getAccessToken(request.query.code, process.env.GHID, process.env.GHSECRET);
  const GHData = await getGHUser(accessToken);
  
  if(GHData) {
    //console.log("GHData.id: "+GHData.id)
    request.session.GHid = GHData.id;
    request.session.token = GHData.token;
    response.redirect("/")
  } else {
    console.log('Error in login');
    response.redirect("/login.html")
  }
})

app.get( '/appdata', (request, response) => {
  var array = [];
  collection.find({"GHid": request.session.GHid}).forEach( doc => {
    array.push(doc);
  })
  .then(() => {
    response.json(array)
  })
})

app.get( '/logout', (request, response) => {
  request.session = null
  response.clearCookie()
  response.redirect('/')
})

app.post( '/submit', (request, response) => {
  json = { GHid: request.session.GHid, vehiclemake: request.body.vehiclemake, vehiclemodel: request.body.vehiclemodel, vehicleyear: request.body.vehicleyear, vehicleage: request.body.vehicleage }
  collection.insertOne( json )
  .then( dbresponse => {
    response.json( dbresponse.ops[0] )
  })
})

app.post( '/delete', (request, response) => {
collection.deleteOne( { _id:mongodb.ObjectID( request.body._id ) } ) 
  .then( () => {
    var array = [];
    collection.find({"GHid": request.session.GHid}).forEach( doc => {
      array.push(doc)
    })
    .then( () => {
      response.json( array );
    })
  })
})

app.post( '/edit', (request, response) => {
  
  const json = { GHid: request.session.GHid, vehiclemake: request.body.vehiclemake, vehiclemodel: request.body.vehiclemodel, vehicleyear: request.body.vehicleyear, vehicleage: request.body.vehicleage };
  const id = request.body._id;
  const newVal = { $set: json }
  collection.updateOne( {_id:mongodb.ObjectID( request.body._id )}, newVal, (error, response) => {
    if (error) throw error;
    return
  })

  var array = [];
  collection.find({"GHid": request.session.GHid}).forEach( doc => {
    array.push(doc)
  })
  .then( () => response.json( array ))

  
})

app.listen( process.env.PORT || port )
