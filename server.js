const express = require("express");
const bodyParser = require("body-parser");
const slash = require("express-slash");

const app = express();

app.enable("strict routing");
app.use(slash());

// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("views"));

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

const uri = `mongodb+srv://${process.env.DBACC}:${process.env.DBPASSWORD}@persistence.9btm7.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("data");
  // perform actions on the collection object

  //client.close();
});

app.post("/add", bodyParser.json(), function(req, res) {
  console.log(req.body);
  collection.insertOne(req.body).then(dbresponse => {
    console.log(dbresponse);
    res.json(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyParser.json(), function(req, res) {
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});
