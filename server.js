

const express = require('express'),
      mongodb = require('mongodb'),
      bodyparser = require('body-parser'),
      passport = require('passport'),
      port = 3000,
      app = express()

app.use(express.static("public"));

 // app.get('/', (req, res) => {
 //   res.sendFile(__dirname + '/public/login.html')
 // })


app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(passport.initialize());
app.use(passport.session());

let username = null;

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
  // passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.sendFile(__dirname + '/public/logins.html')
    const requestToken = req.query.code;
    axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
          accept: "application/json"
        }
      })
        .then(response => {
          accessToken = response.data.access_token;
          console.log(response.data)
          console.log(accessToken)
          return accessToken;
        })
        .then(res => {
          fetch("https://api.github.com/user", {
            headers: {
              Authorization: "token " + accessToken
            }
          })
            .then(res => res.json())
            .then(res => {
              console.log(res.login)
              console.log("that was login")
              username = res.login;
            });
        });
    });

app.get("/error", function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Login Error");
});


// Database

const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://dev4488:meow4444@cluster0.ouuiy.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

client.connect(err => {
  collection = client.db("dataset").collection("a3");
  // console.log(collection)
});

// var addFunc = function(request, response, next) {
//     let json = request.body

//     json.name = name
//     json.subject = subject
//     json.date = date

//     let tempdata = []
//     tempdata.push(json)
//     request.json = tempdata
//     next()
// }

app.get('/data', function(req, res) {
    console.log("Trying to get data from DB")

    collection.find({ user: username}).toArray().then(result => res.json(result))
})

app.post("/add", bodyparser.json(), function(req, res) {
      console.log("adding")
      console.log(req.body)
      collection.insertOne(req.body)
              .then(dbresponse => {
                  console.log(dbresponse)
                  res.json(dbresponse.ops)
              })
              .then(json => function(req, res) {
                  res.writeHead(200, "OK", { 'Content-Type': 'application/json' })
                  res.write(JSON.stringify(json))
                  res.end()
              })
});

app.delete('/delete', bodyparser.json(), function(req, res) {
    console.log("Delete.")
    console.log(req.body.id)
    collection.deleteOne({ id: req.body.id })
        .then(result => res.json(result))
        .then(json => function(req, res) {
            res.writeHead(200, "OK", { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(json))
            res.end()
        })
})

app.put('/put', bodyparser.json(), function(req, res) {
    console.log("Updating")
    collection
        .updateOne({ id: req.body.id },
        {$set: {
                name: req.body.name,
                subject: req.body.subject,
                date: req.body.date,
            }
        })
        .then(result => res.json(result))
        .then(json => function(req, res) {
            res.writeHead(200, "OK", { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(json))
            res.end()
        })
})
