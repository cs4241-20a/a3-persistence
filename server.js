
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)
const mongoose = require('mongoose')
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Types = mongoose.Types;
var ObjectId = Types.ObjectId;
// MongoDB
const MongoClient = require('mongodb').MongoClient;
const User = require(__dirname+"/models/user.js")
const WarCrime = require(__dirname + "/models/warcrimes.js")

    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
const pass = process.env.MONGO_PASS;
const uri = "mongodb+srv://admin:" + pass + "@cluster0.ainmo.mongodb.net/test?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose.connect(uri);
var col;
let information = null;
const acc = new MongoClient(uri, { useNewUrlParser: true });
acc.connect(error => {
  col = acc.db("test").collection("WarCrime");
  console.log(col);
  // perform actions on the collection object
}).catch(err => console.log(err));
/*MongoClient.connect(uri, function(err, db) {
  information = db.collection("WarCrime");
      col = db.collection("WarCrime").find({});
  //console.log(col);
      //var cursor = db.collection("crimes").find();
  //db.collection('crimes').insertOne({});
      //cursor.each(function(err, doc) {
        //console.log(doc);
     // })
      console.log("Connected");                
    });

   mongoose.connect(uri, {useNewUrlParser : true })
  .then(console.log(`mongoDB Connected ${uri}`))
  .catch(err => console.log(err));

    //const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        //await client.connect();
         console.log("success");
        // Make the appropriate DB calls
 
    } catch (e) {
        console.error(e);
    } finally {
        //await client.close();
    }*/

//main().catch(console.error);
// Passport

app.use(session({
    secret: "temp",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection : mongoose.connection})
  
}));


const passport = require('passport');



app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
    cb(null, id);
});

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

//Github
var GitHubStrategy = require('passport-github').Strategy;
const CLIENT_ID = "a894571b6846c058fd0d";
const CLIENT_SECRET = "5a8438f625641479127dd4507d6853aa1967a821";

const ghStr = new GitHubStrategy({
    //authorizationURL: 'http://github.com/login/oauth/authorize',
    //tokenURL: 'https://github.com/login/oauth/authorize',
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
  },
  function(accessToken, refreshToken, profile, cb) {
  //User.update({id: profile.id}, obj, {upsert: true, setDefaultsOnInsert: true}, cb);
 
  return cb(null, profile);
    //User.findById(profile.id)
     // .then(user => {
     /* if(!user) {
        const newUser = new User({name: profile.displayName, id: profile.id});
        
      } else {
        // user already exists
      }
    }).catch(err => {
      return cb(null, false, { message: err});
    });
    var searchQuery = {
      name: profile.displayName
    };

    var updates = {
      name: profile.displayName,
      someID: profile.id
    };

    var options = {
      upsert: true
    };
*/
  }
);
require('https').globalAgent.options.rejectUnauthorized = false;
passport.use(ghStr);


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/home", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
  //main();
});



// send the default array of dreams to the webpage
app.get("/crimes", (request, response) => {
  WarCrime.find({}, function(err, crimes) {
    var crimeMap = {};

    crimes.forEach(function(crime) {
      crimeMap[crime._id] = crime;
    });
    console.log(crimeMap);
    response.send(crimeMap);  
  });
  //response.redirect("/home");
});

app.post('/remove', function (req, res) {
  console.log("Request: ", req);
  MongoClient.connect(uri, function(err, db) {
      db.collection("crimes").deleteOne({
          "_id": req.id,
      });});
      res.redirect('/home')
});

app.post('/add', bodyParser.json(), function (req, res) {
  console.log("body: ", req.body);
  var data = new WarCrime(req.body);
  
  data.save()
    .then(item => {
      //res.send("item saved to database");
      res.redirect('/home')
    })
    .catch(err => {
      res.status(400).send(err.message);
    
    });
  
  /*MongoClient.connect(uri, function(err, db) {
      db.collection("crimes").insert({
          "country": req.country,
          "year" : req.year,
          "description" : req.description,
      });});
  res.redirect('/home')*/
})

app.post('/update', function (req, res) {
  MongoClient.connect(uri, function(err, db) {
      db.collection("crimes").insert({
          "country": req.country,
          "year" : req.year,
          "description" : req.description,
      });});
  
    res.redirect('/home')
})



// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

