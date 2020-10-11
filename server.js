const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const login = require("connect-ensure-login");
const responseTime = require("response-time");
const StatsD = require('node-statsd')
const helmet = require('helmet');
const morgan = require('morgan');

app.use(express.static("public"));

app.use(morgan('combined'));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
const stats = new StatsD();

app.use(responseTime(function (req, res, time) {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/[:.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
}))


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.em7pv.mongodb.net/datatest?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let users = null;
let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
  users = client.db("datatest").collection("Users");
});

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      username: "username",
      password: "password"
    },
    function(username, password, done) {
      users
        .find({ username, password })
        .toArray()
        .then(result => {
          if (result.length >= 1) {
            return done(null, username);
          } else {
            return done(null, false, {
              message: "incorrect username or password"
            });
          }
        });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
 done(null, user);
});

app.use(passport.initialize());

app.post("/add", bodyParser.json(), function(req, res) {
  collection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

app.post("/register", bodyParser.json(), function(req, res) {
  users.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyParser.json(), function(req, res) {
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.get("/get", (req, res) => {
  if (collection !== null) {
    collection
      .find({})
      .toArray()
      .then(result => {
        res.json(result);
      });
  }
});

app.get("/recieve", (req, res) => {
  if (users !== null) {
    users
      .find({})
      .toArray()
      .then(result => {
        res.json(result);
      });
  }
});

app.post("/update", bodyParser.json(), (req, res) => {
  collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body.id) },
      {
        $set: {
          pName: req.body.pName,
          pDesc: req.body.pDesc,
          pSDate: req.body.pSDate,
          pEDate: req.body.pEDate,
          pPrio: req.body.pPrio
        }
      }
    )
    .then(result => res.json(result));
});

app.post("/register", bodyParser.json(), function (request, response) {
    users.insertOne(request.body)
    .then(() => response.sendStatus(200));
})

app.post('/login', bodyParser.json(),
    passport.authenticate('local', {failureFlash: false}), function(req, res) {
      res.json({username: req.body.username});
    }
);
