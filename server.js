// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override")

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://yaru:${process.env.DBPASSWORD}@cluster0.bpic0.mongodb.net/datatest?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
let users = null;

client.connect(err => {
  console.log("error:", err);
  collection = client.db("datatest").collection("test");
  users = client.db("datatest").collection("user");

  // client.close();
});

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  async function(name) {
    return new Promise(function(res, rej) {
      users.findOne({ name: name }, function(err, user) {
        if (err) throw err;
        //console.log(user);
        res(user);
      });
    });

  },
  async function(id) {
    return new Promise(function(res, rej) {
      users.findOne({ _id: id }, function(err, user) {
        if (err) throw err;
        //console.log(user);
        res(user);
      });
    });
  }

);

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", checkAuthenticated, (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/login", checkNotAuthenticated, (request, response) => {
  // response.sendFile(__dirname + "/views/login.html");
  response.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.get("/register", (request, response) => {
  response.sendFile(__dirname + "/views/register.html");
});

app.post("/register", (request, response) => {
  bcrypt.hash(request.body.password, 10, function(err, hash) {
    if (err) {
      response.redirect("register");
      throw err;
    }
    users
      .insertOne({ name: request.body.name, password: hash })
      .then(dbresponse => {
        console.log(users);
        //response.json(dbresponse.ops);
      });
    response.redirect("login");
  });
});

app.post("/remove", bodyParser.json(), (request, response) => {
  console.log(request.body.id);
  collection
    .deleteOne({ _id: mongodb.ObjectId(request.body.id) })
    .then(result => response.json(result));
});

app.post("/edit", bodyParser.json(), (request, response) => {
  var data = request.body;
  collection
    .updateOne(
      { _id: mongodb.ObjectID(data.id) },
      {
        $set: {
          name: data.name,
          major: data.major,
          classYear: data.classYear,
          admissionYear: data.admissionYear
        }
      }
    )
    .then(result => response.json(result));
});

app.post("/submit", bodyParser.json(), function(request, response) {
  // express helps us take JS objects and send them as JSON
  var data = request.body;
  if (JSON.stringify(data) != "{}") {
    collection.insertOne(request.body).then(dbresponse => {
      response.json(dbresponse.ops);
    });
  } else {
    collection
      .find({})
      .toArray()
      .then(result => response.json(result));
  }
});

app.delete("/logout", (req, res)=>{
  req.logOut()
  res.redirect("/login")
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect("/")
  }
  next()
}

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
