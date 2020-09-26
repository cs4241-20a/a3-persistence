const express = require('express'),
  app = express(),
  bodyparser = require('body-parser'),
  mongodb = require('mongodb'),
  port = 3000


const appdata = [
  { 'make': 'Ford', 'model': 'Bronco', 'year': 1976, 'price': 57000, 'priority': 3, 'id': 123456 },
  { 'make': 'Cadillac', 'model': 'LaSalle', 'year': 1938, 'price': 59000, 'priority': 2, 'id': 135426 },
  { 'make': 'Chevrolet', 'model': 'Camaro', 'year': 1969, 'price': 88900, 'priority': 1, 'id': 122543 }
]


const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://testuser:abcd1234@cluster0.6usct.gcp.mongodb.net/testdatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null

client.connect(err => {
  collection = client.db("testdatabase").collection("cars");
});

var removeDoc = function (req, res, next) {
  console.log(req.body._id)
  collection.deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result))

  next()
}

var updateDoc = function (req, res, next) {
  collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body.id) },
      { $set: { name: req.body.name } }
    )
    .then(result => res.json(result))

  next()
}

// defined middleware functions
var submitFunc = function (request, response, next) {
  let json = request.body

  let priority = getPriority(json.year, json.price)
  let id = getUniqueID()
  json.priority = priority
  json.id = id

  let tempdata = []
  appdata.push(json)
  tempdata.push(json)
  request.json = tempdata
  next()
}

var delFunc = function (request, response, next) {
  let id = request.body.id

  // find idx of data element to delete and remove from server data
  const idx = appdata.map(d => d.id.toString()).indexOf(id.toString())
  appdata.splice(idx, 1);
  next()
}

var putFunc = function (request, response, next) {
  let dataJson = request.body
  let id = dataJson.id
  const idx = appdata.map(d => d.id.toString()).indexOf(id.toString())
  appdata.splice(idx, 1, dataJson); // add modifed entry
  next()
}

// middleware functions to always use
app.use(express.static('public'))
app.use(bodyparser.json())

//
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

app.get('/data', function (request, response) {
  console.log("Trying to get data from DB")
  if (collection !== null) {
    // get array and pass to res.json
    collection.find({}).toArray()
    .then(result => response.json(result))
    .then(json => function(req, res){
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
    .then(json => function(req, res){
      response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
      response.write(JSON.stringify(json))
      response.end()
    })
})

app.delete('/delete', delFunc, removeDoc, function (request, response) {
  console.log("Delete.")
  sendData(response)
})

app.put('/put', putFunc, updateDoc, function (request, response) {
  console.log("Put.")
  sendData(response)
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

const getUniqueID = function () {
  return Math.random().toString().substr(2, 8)
}

const sendData = function (response, data = appdata) {
  response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
  response.write(JSON.stringify(data))
  response.end()
}

app.listen(process.env.PORT || port)
