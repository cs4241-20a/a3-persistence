// IMPORTANT: you must run `npm install` in the directory for this assignment
// to install the a library used in the following lines of code

// init express
const express = require("express");
const favicon = require("serve-favicon");
const mongodb = require("mongodb")
const env = require("dotenv/config");
const app = express();
const port = 3000;

app.use(express.static("public"));

//middleware
const bodyParser = require("body-parser");
const passport = require("passport");

//Define mongo variables
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://hezi:${process.env.MONGO_PASS}@footballcluster.luqk2.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

let collection = null


client.connect(err => {
  collection = client.db("test").collection("pleaseWork");
  // perform actions on the collection object
  console.log(collection);
});

//Handle requests from client
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/login.html");
});

app.post("/index.html", bodyParser.json(), (request, response) => {
  console.log(request.body)
});

app.post("/submit", bodyParser.json(), async (request, response) => {
  console.log("body of server request:", request.body)
  collection.insertOne(request.body)
  .then( dbresponse => {
    console.log(dbresponse)
  })
});


// listen for requests :)
const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log(process.env.DEMON_DAYS);
});


/*

app.post("/index.html", bodyParser.json(), (request, response) => {
  consloe.log(request.body)
});


const mime = require( 'mime' ),
      dir  = 'public/',

app.use( function(request, response, next) {
  console.log(request.url)
  next()
});

app.use(express.static("public"));




const appdata = [
  { id: 0, username: "Hezi", Password: "hello", Foot: "left", Position: "def", dateJoined: "2020-9-21" }
];



let playerPage = null;
fs.readFile("public/players.html", function(err, content) {
  playerPage = content;
});

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )
  }else if( request.method === 'POST' ){
    handlePost( request, response )
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 )
  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }
  else if( request.url === "/players") {
    sendFile( response, "public/players.html")
  }
  else if( request.url === "/game") {
    sendFile( response, "public/game.html");
  }
  else if(request.url === "/style.css") {
    sendFile( response, "public/css/style.css");
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data
  })

  request.on( 'end', function() {
    console.log( JSON.parse( dataString ) )

    // ... do something with the data here!!!

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end()
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename )

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )

*/
