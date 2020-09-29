// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const bodyparser = require("body-parser");
const morgan = require("morgan");
// require the database
const mongodb = require("mongodb");
// require passport
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
var errorhandler = require('errorhandler');
var responseTime = require('response-time');

app.use(responseTime())

// for response time
// app.get('/', function (req, res) {
//   res.send('hello, world!')
// })



app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.use(errorhandler());

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// mongodb -> connect to 2 databases
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://admin:${process.env.DBPASSWORD}@cluster0.gi2wv.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useUnifiedTopology: true});
let collection = null;
let acc = null;

client.connect(err => {
  collection = client.db("students").collection("stats");
  console.log(collection)
  acc = client.db("student").collection("info");
   console.log(acc)
});


// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));
passport.use(new LocalStrategy({
    usernameField: 'admin',
    passwordField: 'password'
    },
    function (admin, password, done) {
        acc.find({ admin: admin, password: password }).toArray()
        .then(function (result) {
            if (result.length < 1) {
                return done(null, false);
            } else {
                return done(null, admin);
            }
        });
    }
));

app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user);
});
  
passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.post("/newaccount", bodyparser.json(), function (request, response) {
    acc.insertOne(request.body)
    .then(() => response.sendStatus(200));
})

app.post('/login', bodyparser.json(),
    passport.authenticate('local', {failureFlash: false}), function(request, response) {
      response.json({username: request.user});
    }
);


app.post("/add", bodyparser.json(), function(request, response) {
  console.log("body: ", request.body)
  collection
    .insertOne( request.body )
    .then( dbresponse => {
      console.log( dbresponse + "is added")
      response.json( dbresponse.ops[0] )
  })
})

app.post("/edit", bodyparser.json(), function(request, response) {
  console.log("body: ", request.body)
  collection
    .updateOne({ _id:mongodb.ObjectID( request.body.id )}, 
    { $set: {"name": request.body.name, "game": request.body.game, 
     "cost": request.body.cost, "hour": request.body.hour} } )
    .then( dbresponse => {
      console.log(dbresponse)
      response.json( dbresponse )
  })
})

app.get("/results", function(request, response) {
  collection.find({ admin: request.headers.admin })
  .toArray()
  .then(students => {
    console.log(`Successfully found ${students.length} document(s) for Sensei ${request.headers.sensei}.`);
    response.json( students );
  })
})

app.post("/delete", bodyparser.json(), function(request, response) {
  collection.deleteOne({ _id:mongodb.ObjectID( request.body.id )})
    .then( dbresponse => response.json( dbresponse ))
})
