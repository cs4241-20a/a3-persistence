// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyparser = require("body-parser");

/* PASSPORT ADDITIONS */
const passport = require('passport');

/*favicon addtions */
var favicon = require('serve-favicon')
var path = require('path')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
/* end of favicon additions */

/*compression additions */
var compression = require('compression')
// compress all responses
app.use(compression())
/*end of compression additions */

/*morgan additions */
app.use(require('morgan')('combined'));
/* end of morgan additions */

/* LOCAL AUTH*/
// var LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//     function(username, password, cb) {
//       collection.users.findByUsername(username, function(err, user) {
//         if (err) { return cb(err); }
//         if (!user) { return cb(null, false); }
//         if (user.password != password) { return cb(null, false); }
//         return cb(null, user);
//       });
//     }));

// passport.serializeUser(function(user, done) {
// 	done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
// 	User.loadOne({ _id: id }).then(function(user) {
//         done(null, user);
//     }).catch(function(err) {
//         done(err, null);
//     });
// });

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

/*LOCAL AUTH END */
const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: "688884ca4b9f79df989c",
    clientSecret: "99992c13b5dc0c95d2d30aff167d632066c4b28f",
    callbackURL: "https://a3-ahjicha.herokuapp.com/return"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
      return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.get('/auth/github',
passport.authenticate('github'));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', 
(req, res) => res.sendFile('/views/auth.html', { root : __dirname, user: req.user}),
require('connect-ensure-login').ensureLoggedIn(),
);

app.get('/home', 
(req, res) => res.sendFile('/views/index.html', { root : __dirname, user: req.user}),
require('connect-ensure-login').ensureLoggedIn(),
);

  app.get('/auth/github',
  passport.authenticate('github'));

let userID;
app.get('/error', (req, res) => res.send("error logging in"));

app.get('/return',
  passport.authenticate('github', { failureRedirect: '/error' }),
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    userID = req.user.id
    // console.log("user ID:", userID);
    res.redirect('/home');
  });

/* END OF PASSPORT ADDITIONS */



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// listen for requests :)
const listener = app.listen(process.env.PORT ||3000 , () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

DBPASSWORD = "9PYnye8sGzxBISC4"
// const uri = `mongodb+srv://test-user:${process.env.DBPASSWORD}@cluster0.ys3tz.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const uri = `mongodb+srv://test-user:9PYnye8sGzxBISC4@cluster0.ys3tz.mongodb.net/datatest?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
});


/* get all dreams on initial load */
app.get("/dreams", (request, response) => {
  collection.find({ user: userID }).toArray((err, docs) => {
    if (err) {
      // if an error happens
      response.send("Error in GET req.");
    } else if (docs.length == 0){
        response.send("new user");
    } else {
      // if all works
      console.log(docs);
      response.send(JSON.stringify(docs)); // send back all users found with the matching username
    }
  });
});

app.get("/dreamsTotal", (request, response) => {
    collection.find().toArray((err, docs) => {
      if (err) {
        // if an error happens
        response.send("Error in GET req.");
      } else if (docs.length == 0){
          response.send("new user");
      } else {
        // if all works
        console.log(docs);
        response.send(JSON.stringify(docs)); // send back all users found with the matching username
      }
    });
  });

app.post("/add", bodyparser.json(), function(req, res) {
  console.log("body: ", req.body);
  req.body.user = userID;
  console.log("body: ", req.body);

  collection.insertOne(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
    console.log(dbresponse.ops[0]);
  });
});

app.post("/delete", bodyparser.json(), function(req, res) {
  console.log("body: ", req.body);
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
    .then(result => res.json(result));
});

app.post("/update", bodyparser.json(), function(req, res) {
  console.log("body: ", req.body);
  // collection
  //   .deleteOne({ _id: mongodb.ObjectID(req.body.id) })
  //   .then(result => res.json(result));
  collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body.id) },
      { $set: { dream: req.body.dream } }
    )
    .then(result => res.json(result));
  console.log("json", res);
});

