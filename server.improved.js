const express = require("express");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const responseTime = require("response-time");
const timeout = require("connect-timeout");

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri =
  "mongodb+srv://root:admin@cluster0.ljo9i.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;
client.connect((err) => {
  collection = client.db("datatest").collection("test");
});

const app = express();

app.use(express.static("public"));
app.use(responseTime());
app.use(timeout("1000s"));

morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

app.get("/home", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/public/login.html");
});

app.get("/todos", (request, response) => {
  collection
    .find({})
    .toArray()
    .then((result) => {
      response.json(JSON.stringify(result));
    });
});

app.post("/delete", bodyParser.json(), (request, response) => {
  collection
    .deleteOne({ _id: mongodb.ObjectID(request.body.id) })
    .then((res) => {
      response.json(res);
    });
});

app.put("/update", bodyParser.json(), (request, response) => {
  let todoUpd = request.body;
  collection.updateOne(
    { task: todoUpd.todo.task },
    { $set: { due: todoUpd.todo.due } }
  );
  response.json(request.body.todo);
});

app.post("/add", bodyParser.json(), (request, response) => {
  collection.insertOne(request.body.todo).then((dbresponse) => {
    response.json(dbresponse.ops[0]);
  });
});

const port = process.env.PORT || 3000;
const listener = app.listen(port);
