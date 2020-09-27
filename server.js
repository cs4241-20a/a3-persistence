// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express"),
  mongodb = require("mongodb"),
  bodyParser = require("body-parser"),
  app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());

let username = null;

// start at login page and then direct to homepage
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/loginPage.html");
});

// listen for requests
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  GITHUB AUTH  */

const GitHubStrategy = require("passport-github").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: `${process.env.GITHUB_CLIENT_ID}`,
      clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
      callbackURL: "https://a3-jenna-galli.glitch.me/homepage"
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

const axios = require("axios");
const fetch = require("node-fetch");

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
let accessToken = "";

// Declare the redirect route
app.get("/homepage", (req, res) => {
  // The req.query object has the query params that were sent to this route.
  res.sendFile(__dirname + "/views/index.html");
  const requestToken = req.query.code;
  //console.log(req.query.code);
  axios({
    // make a POST request
    method: "post",
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: "application/json"
    }
  })
    .then(response => {
      // Once we get the response, extract the access token from
      // the response body
      accessToken = response.data.access_token;
      //console.log(accessToken);

      return accessToken;
      // redirect the user to the welcome page, along with the access token
      //res.redirect(__dirname + `/views/index.html?access_token=${accessToken}`);
    })
    .then(res => {
      //console.log(res);

      fetch("https://api.github.com/user", {
        headers: {
          // Include the token in the Authorization header
          Authorization: "token " + accessToken
        }
      })
        // Parse the response as JSON
        .then(res => res.json())
        .then(res => {
          // Once we get the response (which has many fields)
          // Documented here: https://developer.github.com/v3/users/#get-the-authenticated-user
          // Write "Welcome <user name>" to the documents body
          //console.log(res.login)
          username = res.login;
          //const nameNode = document.createTextNode(`Welcome, ${res.name}`);
          //document.body.appendChild(nameNode);
        });
    });
});

//fail or success code

app.get("/error", function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Error Logging In!");
});

/////////////////DB CODE/////////////////////

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://jenna_galli:${process.env.DBPASS}@generatorapp.l0gsu.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let collection = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("UserData").collection("data");
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({ user: username }).toArray();
  })
  .then(arr => {
    //console.log(arr);
  
  });

app.get("/results", function(req, res) {
  if (username != null) {
    collection = client.db("UserData").collection("data");
    collection
      .find({ user: username })
      .toArray()
      .then(result => res.json(result));
  }
});

let objAdd;
app.post(
  "/add",
  bodyParser.json(),
  function(req, res, next) {
    if (username != null) {
      objAdd = rapname(req.body);
      next();
    }
  },
  function(req, res, next) {
    if (username != null) {
      // assumes only one object to insert
      console.log(objAdd);
      collection.insertOne(objAdd).then(result => {
        //console.log(result.ops[0])
        res.json(result.ops[0]);
      });
    }
  }
);

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post("/remove", bodyParser.json(), function(req, res) {
  if (username != null) {
    collection = client.db("UserData").collection("data");
    collection
      .deleteOne({ id: req.body.id })
      .then(result => res.json(result));
  }
});

app.post("/update", bodyParser.json(), (req, res) => {
  if (username != null) {
    var newName = req.body.rapname + ":)";
    res.json(newName);
    
    collection = client.db("UserData").collection("data");

    collection
      .updateOne(
        { id: req.body.id },
        { $set: { rapname: newName } }
      )
      .then(result => {
        console.log(result);
        //res.json(result);
      });
  }
});

let middle = [
  "Bopz",
  "Nasty",
  "Cake",
  "Dollaz",
  "Boss",
  "Teddy",
  "Munchkin",
  "Candy",
  "Mansion",
  "Monsta"
];

const rapname = function(obj) {
  //dervives rapper name

  var newColor = obj.color;
  var newName = "";

  let color = obj.color;
  let name = obj.name;
  let nameLength = name.length;

  //change any instances of 'e' to 'ⓔ'
  for (var i = 0; i < color.length; i++) {
    if (color.charAt(i).toLowerCase() === "e") {
      newColor = color.substr(0, i) + "ⓔ" + color.substr(i + 1);
    }
  }

  //take first and last letter of name
  for (var i = 0; i < nameLength; i++) {
    if (i === 0) {
      newName = name.charAt(0).toUpperCase();
    } else if (i === nameLength - 1 && nameLength > 1) {
      newName += name.charAt(nameLength - 1).toLowerCase();
    }
  }

  //pick a random middle part
  let randNum = Math.floor(Math.random() * 10);

  const rapname = newName + "-" + middle[randNum] + " " + newColor + "$";

  //add data to the server
  // appData.push({ name: name, color: color, rapname: rapname });

  let returnObj = {
    name: name,
    color: color,
    rapname: rapname,
    user: username
  };

  return returnObj;
};
