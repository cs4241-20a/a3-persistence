const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      express = require( 'express' ),
      bodyparser = require( 'body-parser' ),
      app = express(),
      port = 3000;

app.use( express.static( 'public' ) )


app.get( '/', (request, response) => response.sendFile( __dirname + '/views/index.html' ) )

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

app.get( '/appdata', bodyparser.json(), (request, response) => {
  var array = [];
  collection.find().forEach( doc => {
    //console.log(doc);
    array.push(doc);
  })
  .then(() => {
    //console.log(array)
    response.json(array)
  })
})

app.post( '/submit', bodyparser.json(), (request, response) => {
  collection.insertOne( request.body )
  .then( dbresponse => {
    //console.log( dbresponse.ops[0] )
    response.json( dbresponse.ops[0] )
  })
})

app.post( '/delete', bodyparser.json(), (request, response) => {
  //console.log( request.body._id );

  collection.deleteOne( { _id:mongodb.ObjectID( request.body._id ) } ) 
  .then( () => {
    var array = [];
    collection.find().forEach( doc => {
      //console.log(doc)
      array.push(doc)
    })
    .then( () => {
      //console.log(array)
      response.json( array );
    })
  })
})

app.post( '/edit', bodyparser.json(), (request, response) => {
  
  const json = { vehiclemake: request.body.vehiclemake, vehiclemodel: request.body.vehiclemodel, vehicleyear: request.body.vehicleyear, vehicleage: request.body.vehicleage };
  const id = request.body._id;
  const newVal = { $set: json }
  collection.updateOne( {_id:mongodb.ObjectID( request.body._id )}, newVal, (error, response) => {
    if (error) throw error;
    return
  })

  var array = [];
  collection.find().forEach( doc => {
    array.push(doc)
  })
  .then( () => response.json( array ))

  
})

app.listen( process.env.PORT || port )
