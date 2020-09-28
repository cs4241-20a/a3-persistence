const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

var bodyParser = require("body-parser");
var morgan = require("morgan");
var errorhandler = require("errorhandler");

const express = require("express");
const helmet = require("helmet"); //https://github.com/helmetjs/helmet
const app = express();
//var logResponseTime = require("response-time");
app.use(express.static("public"));

app.use(helmet());

//data Array
let appdata = [];

//app.use(logResponseTime);
app.listen(process.env.PORT || port);

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://Sammy3197:${process.env.DBPassword}@clustera3.zxjh9.mongodb.net/A3Todo1?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
var notifier = require("node-notifier");
function errorNotification(err, str, req) {
  var title = "Error in " + req.method + " " + req.url;
  notifier.notify({
    title: title,
    message: str
  });
}


let collection = null;
client.connect(err => {
  collection = client.db("A3Todo1").collection("A3Todos");
  console.log("error? ", err);
  app.use(errorhandler({ log: errorNotification }));
  //perform actions on the collection object
  //client.close();
});


app.use(morgan("tiny"));


app.post("/add", bodyParser.json(), function(req, res) {
  console.log("body:", req.body);
  collection.insertOne(req.body).then(dbresponse => {
    //console.log(dbresponse);
    app.use(errorhandler({ log: errorNotification }));
    res.json(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyParser.json(), function(req, res) {
  collection
    .deleteOne({ _id: mongodb.objectID(req.body.id) })
    .then(result => res.json(result));
});
