

const express = require('express'),
      mongodb = require('mongodb'),
      bodyparser = require('body-parser'),
      passport = require('passport'),
      port = 3000,
      app = express()

// app.use(express.static("public"));

 app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/login.html')
 })


const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://dev4488:meow4444@cluster0.ouuiy.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("sample_airbnb").collection("listingsAndReviews");
  // console.log(collection)
  // perform actions on the collection object
  client.close();
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Github Authentication

const GitHubStrategy = require('passport-github').Strategy

passport.use(
  new GitHubStrategy(
    {
      clientID: "93e5d1c2defd1ad0486d",
      clientSecret: "5df94e2a06f11fd8ec8881945d0be0c63d404028",
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

const axios = require("axios");
const fetch = require("node-fetch");

const clientID = "93e5d1c2defd1ad0486d";
const clientSecret = "5df94e2a06f11fd8ec8881945d0be0c63d404028";
let accessToken = "";

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/public/index.html');
    res.sendFile(__dirname + '/public/index.html')
  });

// app.get("/auth/github/callback", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
//     const requestToken = req.query.code;
//     axios({
//         method: "post",
//         url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
//         headers: {
//           accept: "application/json"
//         }
//     })
//     .then(res => {
//           fetch("https://api.github.com/user", {
//             headers: {
//               Authorization: "token " + accessToken
//             }
//           })
//           .then(res => res.json())
//           .then(res => {
//                 username = res.login;
//           });
//     });
// });

app.get("/error", function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Login Error");
});
