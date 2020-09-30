

const express = require('express'),
      mongodb = require('mongodb'),
      bodyparser = require('body-parser'),
      passport = require('passport'),
      cookieSession = require("cookie-session"),
      helmet = require('helmet'),
      favicon = require('serve-favicon'),
      port = 3000,
      app = express()

app.use(express.static("public"));

app.use(cookieSession({
  secret: "bongocat"
}))

app.use(helmet({contentSecurityPolicy: false,}));
app.use(favicon(__dirname + '/public/assets/favicon.ico'))

 // app.get('/', (req, res) => {
 //   res.sendFile(__dirname + '/public/login.html')
 // })


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

let username = null;

async function getAccessToken(code, client_id, client_secret) {
  const request = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
    }),
  })
  const text = await request.text();
  const params = new URLSearchParams(text);
  return params.get("access_token");
}

async function fetchGitHubUser(token) {
  const request = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'token ' + token,
    },
  })
  return await request.json()
}

app.get('/auth/github/callback', async (req, res) => {
  // passport.authenticate('github', { failureRedirect: '/login' }),
  // function (req, response) {
    const code = req.query.code
    const access_token = await getAccessToken(code, clientID, clientSecret)
    const user = await fetchGitHubUser(access_token)
    if(user) {
        console.log("user logged in as " + user.id)
        req.session.userID = user.id;
        res.sendFile(__dirname + '/public/logins.html')
      }
      else {
        // reload the page
        console.log("Could not login user")
        res.sendFile(__dirname + '/public/index.html')
      }


    // axios({
    //     method: "post",
    //     url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    //     headers: {
    //       accept: "application/json"
    //     }
    //   })
    //     .then(response => {
    //       accessToken = response.data.access_token;
    //       console.log(response.data)
    //       console.log(accessToken)
    //       return accessToken;
    //     })
    //     .then(res => {
    //       fetch("https://api.github.com/user", {
    //         headers: {
    //           Authorization: "token " + accessToken
    //         }
    //       })
    //         .then(res => res.json())
    //         .then(res => {
    //           console.log(res.login)
    //           console.log("that was login")
    //           username = res.login;
    //         });
    //     });
    });

app.get("/error", function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Login Error");
});


// Database

const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://dev4488:meow4444@cluster0.ouuiy.mongodb.net/dataset?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

client.connect(err => {
  collection = client.db("dataset").collection("a3");
  // console.log(collection)
});


app.get('/data', function(req, res) {
    console.log("Trying to get data from DB")

    collection.find({ userID: req.session.userID}).toArray().then(result => res.json(result))
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

app.post('/delete', bodyparser.json(), function(req, res) {
    console.log("Delete.")
    console.log(req.body)
    console.log(req.body.id)
    collection.deleteOne({ id: req.body.id })
      .then(result => res.json(result));
    // console.log(req.body.id)
    // collection.deleteOne({ id:mongodb.ObjectID( req.body.id ) })
    //     .then(result => res.json(result))
})

app.post('/update', bodyparser.json(), function(req, res) {
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
})
