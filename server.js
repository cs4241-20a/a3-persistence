// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.

const express = require("express");
const fetch = require("node-fetch");
const app = express();
const morgan = require("morgan");
// const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
app.use(morgan('combined'));
// initialize for github
const GitHubStrategy = require('passport-github').Strategy;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbaron:dbaron@cluster0.7nm5r.mongodb.net/datatest?retryWrites=true&w=majority";
const bodyParser = require('body-parser');
var session = require('express-session');

app.use(express.static("public"));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET
console.log(client_id);
console.log(client_secret);


var sendjson = {}

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("datatest").collection("test");
  //console.log(collection.find())
  // perform actions on the collection object
  client.close();
});


// start github auth
passport.serializeUser(function (user, done) {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
})

passport.use(new GitHubStrategy({
  
    passReqToCallBack: true,
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "https://a3-danya-baron.glitch.me/auth/github/callback"
  },
                                
                                
  function(accessToken, refreshToken, profile, done) {
    
    done(null, profile);
    
    console.log("got token");
  }
));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/index", function(req, res) {
  res.sendFile('/views/index.html', {root : '.'});
});

// authenticate user here
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }),
    function(req,res){
    console.log("authenticate")
  });


app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), 
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('redirect #1');
    res.redirect('/index');
    console.log('redirected #2');
  
  
  })

                              
app.post('/submit', function(request, response) {
  let dataString = '';

  request.on("data", function(data) {
    dataString += data;
  })
  request.on( 'end', function() {
    var jsonData = JSON.parse(dataString)
    let action = jsonData.action
    //console.log(jsonData)
    
    if (action.includes("add")) {
      sendjson['action'] = "add"
      let name = jsonData.taskname;
      let prior = jsonData.taskpriority;
      let deadline = jsonData.taskdeadline;
      let entries = {};
      entries["Name"] = name;
      entries["Priority"] = prior;
      entries["Deadline"] = deadline;
      //console.log(entries)
    
      const client = new MongoClient(uri, { useNewUrlParser: true });
       client.connect(err => {
         const collection = client.db("datatest").collection("test");
         collection.insertOne(entries, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
         })
         client.close();
       });
    }
    
    if (action.includes("edit")) {
      let name = jsonData.taskname;
      let prior = jsonData.taskpriority;
      let deadline = jsonData.taskdeadline;
      let newEntries = {};
      newEntries["Name"] = name;
      newEntries["Priority"] = prior;
      newEntries["Deadline"] = deadline;
    
      
    }

    
    if (action.includes("delete")) {
      let name = jsonData.taskname;
      let prior = jsonData.taskpriority;
      let deadline = jsonData.taskdeadline;
      let entries = {};
      entries["Name"] = name;
      entries["Priority"] = prior;
      entries["Deadline"] = deadline;
      
      
    }

    response.writeHead( 200, "OK", {'Content-Type': 'application/json', 'charset':'UTF-8'});
       const client = new MongoClient(uri, { useNewUrlParser: true });
       client.connect(err => {
         const collection = client.db("datatest").collection("test");
         collection.find().toArray((err, items) => {
          console.log("inside")
          sendjson["test"] = items;
          response.end(JSON.stringify(sendjson));
        })
         client.close();
       });
    })
})










// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


