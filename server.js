const express = require('express'),
      bodyParser = require('body-parser'),
      mongodb = require('mongodb'),
      MongoClient = mongodb.MongoClient,
      dotenv = require('dotenv').config(),
      morgan = require('morgan'),
      app = express();

const uri = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.lkq2d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {  useNewUrlParser: true, useUnifiedTopology: true  });

let collection = null
client.connect(err => {
  collection = client.db(`${process.env.DB_NAME}`).collection("tasks");
});

app.use(express.static("public"));

app.use(morgan('combined'))

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

/* Whenever a client requests the /tasks route we send the 
* JSON object back down to the client.
*/
app.get('/tasks', bodyParser.json(), function(request, response){
  collection.find({}).toArray(function(err, result){
    if (err) throw err;
    console.log(result);
    response.json(result);
  })
})

/* Handles a POST request from the client and then bodyParser will be 
* called in between the request and the response will push the data to
* the database on mongodb and return the response
*/
app.post('/add', bodyParser.json(), function(request, response) {
  console.log( 'add body:', request.body )
  collection.insertOne( request.body ).then( dbresponse => {
    response.json( dbresponse.ops[0] )
  })
})

app.post('/delete', bodyParser.json(), function(request, response){
  console.log('delete body:', request.body)
  collection.deleteOne({ _id:mongodb.ObjectID( request.body._id ) })
  .then( result => response.json( result ) )
})

/* Setting the port manually so that it doesn't randomize on my local machine 
*/
process.env.PORT = 3000;
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
