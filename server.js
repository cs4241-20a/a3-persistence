//server script
const express = require("express"),
  mongodb = require("mongodb"),
  bodyparser = require("body-parser"),
  responseTime = require("response-time"),
  compression = require("compression"),
  passport = require("passport"),
  GitHubStrategy = require("passport-github").Strategy,
  fetch = require("node-fetch"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  app = express(); //start app

app.use(express.static(__dirname + "/public")); //serve public
app.use(bodyparser.json()); //parse everything we get as jsons since that's what we use
app.use(responseTime());
app.use(compression());

//**********OAuth**********

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: true,
    resave: true
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "a80535eaf0e5c2922f66",
      clientSecret: "0f2757ddcdca72733893876511f10b9b742fb87f",
      callbackURL: "https://a3-afsimoneau.glitch.me/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    req.session.login = req.user.username;
    res.redirect("/home");
  }
);

app.get("/error", (req, res) => res.send("Login failed"));

app.get("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});

//**********OAuth**********

//----------MONGO----------
let connection = null;
let UserData = null;
let dataCollection = null;

let currentUser = null;

const uri =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASS +
  "@" +
  process.env.HOST +
  "/UserData" +
  process.env.DB;

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect().then(__connection => {
  // store reference to collection
  connection = __connection;
  UserData = connection.db("UserData");
  dataCollection = connection.db("UserData").collection("data");
});
/**
app.use((req, res, next) => {
  if (connection !== null) {
    next();
  } else {
    res.status(503).send();
    console.log("503"); //no database
  }
});
*/
//.then(console.log);
//----------MONGO----------

//----------POST METHODS----------
app.post("/add", (req, res) => {
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then(arr => {
      if (arr.some(row => row.route === req.body.route)) {
        console.log("sending not adding :/");
      } else {
        dataCollection.insertOne(fromClient).then(result => {
          console.log(result.ops[0]);
          dataCollection
            .find({ username: fromClient.username })
            .toArray()
            .then(r => res.json(r)); //send table
        });
      }
    });
});

app.post("/update", (req, res) => {
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then(arr => {
      if (!arr.some(row => row.route === req.body.route)) {
        console.log("nothing to delete :/");
      } else {
        dataCollection
          .updateMany(
            {
              //going to delete something
              _id: mongodb.ObjectID(
                arr.find(record => record.route === req.body.route)._id //find the first record in array and get id
              )
            },
            {
              $set: {
                //set multiple fields
                time: req.body.time,
                distance: req.body.distance,
                fitness: req.body.fitness
              }
            }
          )
          .then(result => {
            dataCollection
              .find({ username: fromClient.username })
              .toArray()
              .then(r => res.json(r)); //send updated table
          });
      }
    });
});

app.post("/delete", (req, res) => {
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then(arr => {
      if (!arr.some(row => row.route === req.body.route)) {
        console.log("nothing to delete :/");
      } else {
        dataCollection
          .deleteOne({
            //going to delete something
            _id: mongodb.ObjectID(
              arr.find(record => record.route === req.body.route)._id //find the first record in array and get id
            )
          })
          .then(result => {
            dataCollection
              .find({ username: fromClient.username })
              .toArray()
              .then(r => res.json(r)); //send table
          });
      }
    });
});

app.post("/load", (req, res) => sendTable(req, res));

const sendTable = function(req, res) {
  let fromClient = req.body;
  fromClient.username = req.session.login;
  /*res.writeHead(200, { "Content-Type": "application/json" });
  connection
    .db("UserData")
    .collection("data")
    .find({})
    .toArray()
    .then(data => {
      res.end(JSON.stringify(data));
    });*/
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then(r => res.json(r)); //send table
};

//----------POST METHODS----------

app.get("/home", (req, res) => {
  if (req.session.login) {
    res.sendFile(__dirname + "/public/home.html"); //send login page on default
    console.log("home page event"); //log as page event when we send default page
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
  console.log("login page event");
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
