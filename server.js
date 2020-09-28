// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://dbUsername:${process.env.DBPASSWORD}@cluster0.f6ydg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;
let auth = null
client.connect(err => {
  collection = client.db("datadb").collection("data");
  auth = client.db("datadb").collection("accounts");
});

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');

passport.use(new LocalStrategy({
    usernameField: 'sensei',
    passwordField: 'password'
    },
    function (sensei, password, done) {
        auth.find({ sensei: sensei, password: password }).toArray()
        .then(function (result) {
            if (result.length >= 1) {
                return done(null, sensei);
            } else {
                return done(null, false, { message: "Incorrect username or password" });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
  
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());

app.use(helmet());

app.use(compression());

app.use(morgan('combined'));

app.post("/add", bodyparser.json(), function(request, response) {
  console.log("body: ", request.body)
  collection.insertOne( request.body )
    .then( dbresponse => {
      console.log(dbresponse)
      response.json( dbresponse.ops[0] )
  })
})

app.post("/update", bodyparser.json(), function(request, response) {
  console.log("body: ", request.body)
  collection.updateOne({ _id:mongodb.ObjectID( request.body.id )}, 
    { $set: {"name": request.body.name, "belt": request.body.belt, 
     "age": request.body.age, "record": request.body.record } } )
    .then( dbresponse => {
      console.log(dbresponse)
      response.json( dbresponse )
  })
})

app.post("/delete", bodyparser.json(), function(request, response) {
  collection.deleteOne({ _id:mongodb.ObjectID( request.body.id )})
    .then( dbresponse => response.json( dbresponse ))
})

app.get("/results", function(request, response) {
  collection.find({ sensei: request.headers.sensei })
  .toArray()
  .then(students => {
    console.log(`Successfully found ${students.length} document(s) for Sensei ${request.headers.sensei}.`);
    response.json( students );
  })
})

app.post("/newaccount", bodyparser.json(), function (request, response) {
    auth.insertOne(request.body)
    .then(() => response.sendStatus(200));
})

app.post('/login', bodyparser.json(),
    passport.authenticate('local', {failureFlash: false}), function(request, response) {
      response.json({username: request.user});
    }
);