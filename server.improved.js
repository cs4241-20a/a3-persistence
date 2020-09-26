const express = require('express'),
  app = express(),
  bodyparser = require('body-parser'),
  morgan = require('morgan'),
  mongodb = require('mongodb'),
  serveStatic = require('serve-static'),
  responseTime = require('response-time'),
  passport = require('passport'),
  port = 3000

const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://testuser:abcd1234@cluster0.6usct.gcp.mongodb.net/testdatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null

client.connect(err => {
  collection = client.db("testdatabase").collection("cars");
});

// defined middleware functions
var submitFunc = function (request, response, next) {
  let json = request.body

  let priority = getPriority(json.year, json.price)
  json.priority = priority

  let tempdata = []
  tempdata.push(json)
  request.json = tempdata
  next()
}

// middleware functions to always use
app.use(serveStatic('public'))
app.use(bodyparser.json())
app.use(morgan('combined'))
app.use(responseTime())
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

app.get('/data', function (request, response) {
  console.log("Trying to get data from DB")
  if (collection !== null) {
    // get array and pass to res.json
    collection.find({}).toArray()
      .then(result => response.json(result))
      .then(json => function (req, res) {
        response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
        response.write(JSON.stringify(json))
        response.end()
      })
  }
})

app.post('/submit', submitFunc, function (request, response) {
  console.log("Submit.")
  collection.insertOne(request.body)
    .then(dbresponse => {
      console.log(dbresponse)
      response.json(dbresponse.ops)
    })
    .then(json => function (req, res) {
      response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
      response.write(JSON.stringify(json))
      response.end()
    })
})

app.delete('/delete', function (request, response) {
  console.log("Delete.")
  console.log(request.body.id)
  collection.deleteOne({ _id: mongodb.ObjectID(request.body.id) })
    .then(result => response.json(result))
    .then(json => function (req, res) {
      response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
      response.write(JSON.stringify(json))
      response.end()
    })
})

app.put('/put', function (request, response) {
  console.log("Put.")

  collection
    .updateOne(
      { _id: mongodb.ObjectID(request.body.id) },
      {
        $set: {
          make: request.body.make,
          model: request.body.model,
          year: request.body.year,
          price: request.body.price,
          priority: request.body.priority
        }
      }
    )
    .then(result => response.json(result))
    .then(json => function (req, res) {
      response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
      response.write(JSON.stringify(json))
      response.end()
    })
})

const getPriority = function (year, price) {
  let priority = 5

  if (year < 1930 && price > 45000) {
    priority = 1
  } else if (year < 1960 && price > 45000) {
    priority = 2
  }
  else if (year < 1970 && price > 45000) {
    priority = 3
  }
  else if (year < 2020 && price > 45000) {
    priority = 4
  }
  return priority
}

app.listen(process.env.PORT || port)
