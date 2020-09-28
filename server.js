if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const LocalStrategy = require('passport-local').Strategy
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { response } = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
let curr_user = "";

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  name => users.find(user => user.name === name),
  id => users.find(user => user.id === id)
)

let users = [];

// checks for objects in the public folder
app.use(express.static('public'));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// default
app.get("/", checkAuthenticated, (request, response) => {
  //response.sendFile(__dirname + "/views/index.ejs");
  response.render('index.ejs', { name: request.user.name });
  curr_user = request.user.name;
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render('index.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    curr_user = {
      id: Date.now().toString(),
      name:req.body.name,
      password: hashedPassword
    }
    //add curr_user to user_accounts database
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      password: hashedPassword
    })
    userdb.insertOne(curr_user);
    res.redirect('/login')
    console.log("User registered");
  } catch {
    res.redirect('/register');
    console.log("Error! User not registered");
  }
})

app.delete('/logout', checkAuthenticated, (req, res) => {
  req.logOut()
  res.redirect('/login')
})

// get data for building initial table
app.get("/data", (request, response) => {
  // express helps us take JS objects and send them as JSON
  if (collection !== null) {
    collection.find({}).toArray().then(result => response.json(result));
  }
  //response.json(dbresponse.ops);
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://Jordan:${process.env.DB_PASS}@cluster0.i1bsg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null;
client.connect(err => {
  collection = client.db("scoreboard_db").collection("user_scoreboards");
  userdb = client.db("scoreboard_db").collection("user_accounts");
  // perform actions on the collection object
});


// submits a new user to the scoreboard array from post method
app.post("/submit", bodyParser.json(), (request, response) => {
  console.log("The person is: " + request.body.name);
  collection
    .insertOne(request.body)
    .then(dbresponse => {
      response.json(dbresponse.ops[0]);
    })
  console.log("New user recorded!");
})

// deletes a user from the scoreboard array and returns new scoreboard
app.post("/delete", bodyParser.json(), (request, response) => {

  collection
    .deleteMany({ "name": request.body.name })
    .then(result => response.json(result))
})

// modifies a given user's score and generates a new CPS, returns new scoreboard.
app.post("/modify", bodyParser.json(), (request, response) => {
  console.log("Modifying person...");

  collection
    .findOneAndUpdate({ "name": request.body.name },
      { $set: { "name": request.body.name, "cps": request.body.cps, "clickcount": request.body.clickcount, "seconds": request.body.seconds, "time": request.body.time } })
    .then(result => response.json(result))
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
