const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require( 'express' ),
      bodyparser = require( 'body-parser' ),
      compression = require( 'compression' ),
      responseTime = require( 'response-time' ),
      fetch = require( 'node-fetch' ),
      cookieSession = require( 'cookie-session' ),
      morgan = require("morgan"),
      app = express(),
      port = 3000;

//Middleware

app.use( cookieSession({secret: process.env.COOKIE_SECRET}))
app.use( express.static( 'public' ) )
app.use( compression() )
app.use(morgan("combined"))
app.use( responseTime( (request, response, time) => console.log( request.method, request.url, time + 'ms' ) ) )
app.use( bodyparser.json() )


//MongoDB Setup from video
require('dotenv').config()
const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://dbUser:${process.env.DBPASSWORD}@cluster0.lxu3a.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });

let collection = null
client.connect(err => {
  collection = client.db("dbTest").collection("test");
  
});

app.get( '/', (request, response) => {
  if(request.session.GHid) {
    response.sendFile( __dirname + '/public/home.html' ) 
  } else {
    response.sendFile( __dirname + '/public/login.html' )
  }
})

//GitHub Login from tutorial

app.get('/geturl', (request, response) => {
  const path = request.protocol + '://' + request.get('host');
  const pathL = "https://a3-lindberg-simpson-2.glitch.me";
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GHID}&redirect_uri=${pathL}/login/github/callback`;
  console.log(url);
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

//GitHub callback
app.get('/login/github/callback', async (request, response) => {
  const accessToken = await getAccessToken(request.query.code, process.env.GHID, process.env.GHSECRET);
  const GHData = await getGHUser(accessToken);
  
  if(GHData) {
    console.log("GHData.id: "+GHData.id);
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
  const json = { GHid: request.session.GHid, description: request.body.description, weight: request.body.weight, delivdate: request.body.delivdate, price: request.body.price }
  console.log(json)
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
  const json = { GHid: request.session.GHid, description: request.body.description, weight: request.body.weight, delivdate: request.body.delivdate, price: request.body.price };
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
