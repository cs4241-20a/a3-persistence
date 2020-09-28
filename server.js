const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const cookieParser = require("cookie-parser");
var session = require("express-session");
app.use(cookieParser());

app.use(
  require("express-session")({
    secret: "12345678",
    saveUninitialized: true,
    resave: true
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "dd9393658d4a9f7850a2",
      clientSecret: "36e30e1d6af47e17f1b416b6cc18410307acc110",
      callbackURL: "https://a3-mario-castro.glitch.me/auth/github"
    },
    async (accessToken, refreshToken, profile, cb) => {
      var email = profile.username;
      var password = null;
      var github = true;
      const mongodb = require("mongodb");
      const MongoClient = mongodb.MongoClient;
      const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.vilmh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
      const client = new MongoClient(
        uri,
        { useNewUrlParser: true },
        { useUnifiedTopology: true }
      );
      await client.connect();
      var collection = await client.db("Webware").collection("users");
      var results = await collection
        .find({ email: email, github: true })
        .toArray();
      var presentAccountID = null;

      if (results.length > 0) {
        console.log(results.length + " accounts found matching");
        console.log(results[0]);
        presentAccountID = results[0]._id;
        //return true;
      } else {
        var newUser = {
          email: email,
          password: password,
          github: true
        };
        var newAccount = await collection.insertOne(newUser);
        presentAccountID = newAccount.insertedId;
        console.log(
          "New Account Created for ",
          email,
          password,
          "and ID: ",
          presentAccountID
        );
      }
      console.log("The account used for logging in is", presentAccountID);

      return cb(null, presentAccountID);
    }
  )
);

app.get("/login/github", passport.authenticate("github"));

app.get(
  "/auth/github",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("we did it", req.session.passport.user);
    req.session.accountSession = req.session.passport.user;
    //res.username =

    res.redirect("/mylists.html");
  }
);

app.use(express.static("./"));

app.post("/login/account", bodyparser.json(), async function(
  request,
  response
) {
  console.log(
    "Login attempted with: " + request.body.email + " " + request.body.password
  );
  var email = request.body.email;
  var password = request.body.password;

  const mongodb = require("mongodb");
  const MongoClient = mongodb.MongoClient;
  const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.vilmh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
  const client = new MongoClient(
    uri,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  );
  await client.connect();
  var collection = await client.db("Webware").collection("users");
  var results = await collection
    .find({ email: email, password: password })
    .toArray();
  var presentAccountID = null;

  if (results.length > 0) {
    console.log(results.length + " accounts found matching");
    console.log(results[0]);
    presentAccountID = results[0]._id;
    //return true;
  } else {
    var newUser = {
      email: email,
      password: password
    };
    var newAccount = await collection.insertOne(newUser);
    presentAccountID = newAccount.insertedId;
    console.log(
      "New Account Created for ",
      email,
      password,
      "and ID: ",
      presentAccountID
    );
  }
  console.log("The account used for logging in is", presentAccountID);
  request.session.accountSession = presentAccountID;
  response.redirect("./");

  client.close();
});

app.get("/userdata", async function(req, res) {
  console.log(
    req.session.accountSession,
    "is the current ID requesting userdata"
  );
  const mongodb = require("mongodb");
  const MongoClient = mongodb.MongoClient;
  const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.vilmh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
  const client = new MongoClient(
    uri,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  );
  await client.connect();
  var collection = await client.db("Webware").collection("tasks");
  var results = await collection
    .find({ userID: req.session.accountSession })
    .toArray();
  console.log("Found", results.length, " tasks for the specified user");

  var nameCollection = await client.db("Webware").collection("users");
  var ObjectID = require("mongodb").ObjectID;
  var userAccountName = await nameCollection
    .find({ _id: new ObjectID(req.session.accountSession) })
    .toArray();
  //var userAccountName = await nameCollection.find({email: "o", password: "p"}).toArray()

  console.log("Welcome,", userAccountName[0]);
  var body = { tasks: results, email: userAccountName[0].email };
  res.body = res.json(body);
  //res.name = userAccountName[0].email;
  client.close();
});

app.get("/logout", async function(req, res) {
  req.session.destroy();
  res.redirect("/index.html");
});

app.post("/add", bodyparser.json(), async function addToDatabase(req, res) {
  console.log("body:", req.body, req.session.accountSession);

  const mongodb = require("mongodb");
  const MongoClient = mongodb.MongoClient;
  const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.vilmh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
  const client = new MongoClient(
    uri,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  );
  await client.connect();
  var collection = await client.db("Webware").collection("tasks");
  var newtask = {
    userID: req.session.accountSession,
    taskText: req.body.text
  };
  collection.insertOne(newtask);
  res.body = res.json(newtask);
});

//app.get("")

app.listen(3000);
