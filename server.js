// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var helmet = require("helmet");
var compression = require("compression")
const morgan = require("morgan")
const errorhandler = require("errorhandler")

// our default array of dreamss
const tasks = [
];

app.use(compression());


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://pdm:${process.env.dbpwd}@cluster0.blnob.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
let userCollection = null;
client.connect(err => {
  collection = client.db("assignment3").collection("tasks");
  userCollection = client.db("assignment3").collection("users");
  // perform actions on the collection object
});

// add a task
app.post("/add", bodyParser.json(), function(request, response) {
  // tasks.push(request.body)
  console.log("body:", request.body);
  console.log(collection);
  // response.json(request.body);

  // return a promise, it will sh ow the data with the unique id
  collection.insertOne(request.body).then(dbresponse => {
    let newtask = dbresponse.ops[0];
    console.log(dbresponse.ops[0])
    if (newtask["priority"] === "med_priority") {
      newtask["priority"] = "Medium";
      newtask["message"] =
        "Finish your high priority tasks first and then get to this!";
    }
    if (newtask["priority"] === "high_priority") {
      newtask["priority"] = "High";
      newtask["message"] = "Finish this task first!";
    }
    if (newtask["priority"] === "low_priority") {
      newtask["priority"] = "Low";
      newtask["message"] =
        "Make sure you finish this task but also take out some time for yourself :D";
    }
    response.json(newtask);
  });
});

// delete a task
app.post("/delete", bodyParser.json(), function(request, response) {
  console.log("This is the id: " + request.body.id);
  collection
    .deleteOne({ _id: mongodb.ObjectID(request.body.id) })
    .then(result => response.json(result));
});

// modify a task
app.post("/update", (request, response) => {
  collection
    .updateOne(
      { _id: mongodb.ObjectID(request.body._id) },
      {
        $set: {
          yourtask: request.body.yourtask,
          date: request.body.date,
          priority: request.body.priority
        }
      }
    )
    .then(result => response.json(result));
});

app.post("/adduser", bodyParser.json(), function(request, response) {
  console.log(request)
  userCollection.insertOne(request.body).then(dbresponse => {
    response.json(dbresponse.ops[0]);
  });
});

app.post("/tasks", bodyParser.json(), function(req, res) {
  collection.find({ "account": req.body.account }).toArray()
    .then(dbresponse => {
    console.log(dbresponse)
    res.json(dbresponse);
  })
})

app.use( function( req, res, next) {
  morgan('tiny');
  next()
})
app.use(helmet());
