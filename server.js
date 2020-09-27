const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
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
      clientID: 'dd9393658d4a9f7850a2',
      clientSecret: '36e30e1d6af47e17f1b416b6cc18410307acc110',
      callbackURL: "http://127.0.0.1:3000/auth/github",
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log("fuck")
      return cb(null,profile)    
    }
  )
);

app.get("/login/github",passport.authenticate("github"));



app.get(
  "/auth/github",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("we did it", req.user);
    //res.username =
    res.redirect("/mylists.html");
    
  }
);

app.use(express.static("./"));

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.vilmh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true },{ useUnifiedTopology: true });

let collection = null;
client.connect(err => {
  collection = client.db("Webware").collection("users");
  //console.log(collection);
  // perform actions on the collection object
});

app.post("/add", bodyparser.json(), function(req, res) {
  console.log("body:", req.body);
});

app.post("/login/account", bodyparser.json(), function(request, response) {
  console.log(
    "Login attempted with: " + request.body.email + " " + request.body.password
  );
  var email = request.body.email;
  var password = request.body.password;

  var presentAccount = collection
    .find({ email: email, password: password })
    .toArray()
    .then(result => {
      if (result.length > 0) {
        console.log(result.length + " accounts found matching");
        return true;
      } else {
        var newUser = {
          email: email,
          password: password
        };
        collection
          .insertOne(newUser)
          .then(result => console.log("New User Added: " + result));
      }
    });
  response.redirect("./");
  return presentAccount;
});

client.close();


app.listen(3000);
