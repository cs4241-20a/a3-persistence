const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000
const express = require("express");
const app = express();
const bodyparser = require('body-parser');

app.use(express.static("public"));
app.use( bodyparser.json() )


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
  }else{
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

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://dbUser:${process.env.DBPASSWORD}@cluster0.lxu3a.mongodb.net/<dbname>?retryWrites=true&w=majority`;
//mongodb+srv://dbUser:<password>@cluster0.lxu3a.mongodb.net/<dbname>?retryWrites=true&w=majority
const client = new MongoClient(uri, {useNewUrlParser: true}, { useUnifiedTopology: true });

let collection = null;
client.connect(err => {
  collection = client.db("dbTest").collection("test");
  //perform actions on the collection object
  //client.close();
});

app.post( '/submit', (request, response) => {
  const json = { description: request.body.description, weight: request.body.weight, deliv_date: request.body.deliv_date, price: request.body.price }
  collection.insertOne( json )
  .then( dbresponse => {
    response.json( dbresponse.ops[0] )
  })
})

app.post('/add', bodyparser.json(), function(req, res) {
  console.log('body:', req.body)
  collection.insertOne(req.body)
    .then(dbresponse => {
      console.log(dbresponse)
      res.json(dbresponse.ops[0])
  })
})

app.post('/delete', bodyparser.json(), function(req, res) {
  collection
    .deleteOne({_id:mongodb.ObjectID(req.body.id)})
    .then(result => res.json(result))
})

app.get( '/', (request, response) => {

    response.sendFile( __dirname + '/public/index.html' ) 
})

app.listen( process.env.PORT || port )
