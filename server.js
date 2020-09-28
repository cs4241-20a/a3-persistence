// server.js // where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const errorhandler = require("errorhandler");
const responseTime = require("response-time");
const optimus = require("connect-image-optimus");

app.use(cookieParser());
app.use(errorhandler());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://user123:${process.env.DBPASSWORD}@cluster0.i7qnb.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
  console.log(collection);
});

app.post("/add", bodyparser.json(), function(req, res) {
  console.log("body:", req.body);
  collection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyparser.json(), function(req, res) {
  console.log("delete-body:", req.body);
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.post("/update", bodyparser.json(), (req, res) => {
  collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body.id) },
      { $set: { task: req.body.task } }
    )
    .then(result => res.json(result));
});

/*app.post('/signup', function(req, res) {
    User.register(new User({ username }), 
            password, function (err, user) { 
        if (err) { 
            console.log(err); 
            return res.render("register"); 
        } 
  
        passport.authenticate("local")( 
            req, res, function () { 
            res.render("secret"); 
        }); 
    listofusers.push(username);
      
    res.sendFile(path.join(__dirname + "/form.html"))
});
*/

/*
app.post( '/createUser', bodyparser.json(), (req,res) => {
  collection
    .createUser(
      {
        user: req.body.user,
        pwd: req.body.pwd
      }
    collection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
})
*/

app.post("/login", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});
