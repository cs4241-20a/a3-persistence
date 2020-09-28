const express = require("express");
const session = require("express-session");
const app = express();
const bodyparser = require('body-parser');
const passport = require('passport');
const GHStrategy = require('passport-github').Strategy;
const dotenv = require('dotenv');
const appdata = [];

dotenv.config();
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: {secure: false}})),

app.use(express.static("public"));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

console.log(`${process.env.PORT}`);

const listener = app.listen(process.env.PORT);
console.log("Your app is listening on port " + process.env.PORT);

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://mjgulbin:${process.env.DBPASSWORD}@webwareclustermjg.fxz67.mongodb.net/<dbname>?retryWrites=true&w=majority`;

passport.use( new GHStrategy({ 
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, cb) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    let collection = null;

    await client.connect();
    collection = client.db("WWProject3").collection("userdata");

    const userdata = await collection.find({username: profile.username}).toArray();

    if(userdata.length === 0){
      await collection.insertMany([
        {
          username: profile.username
        }
      ]);
    }

    const user = await collection.find({username: profile.username}).toArray();

    await client.close;
    cb(null, user[0]);

  }
))

app.get("/auth/github", passport.authenticate("github"));

app.get("/auth/github/callback",
  passport.authenticate('github', { failureRedirect: "/" }), 
  function (req, res) {
    console.log("successful login")
    res.redirect("/");
  })

app.post( '/load', async(req, res) => {
  if (!req.user) {
    return res.json({ error: "Please log in first" });
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  let collection = null;

  await client.connect();

  collection = client.db("test").collection("testing");
  
  const data = await collection.find({ user: req.user._id }).toArray();

  await client.close();

  return res.json(data);
})



app.post( '/add', bodyparser.json(), async(req, res) => {
  console.log(req.user);
  if (!req.user) {
    return res.json({ error: "Please log in first"});
  }
  
  console.log(req.body);
    
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  let collection = null;

  await client.connect();

  collection = client.db("WWProject3").collection("scoredata");
  console.log(collection);

  await collection.insertOne( {...req.body, user: req.user._id} );
  
  const data = await collection.find({user: req.user._id}).toArray();
  console.log(data);

  await client.close();

  return res.json(data);
    
});

app.delete( '/remove', bodyparser.json(), async(req, res) => {
  if (!req.user){
    return res.json({})
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  let collection = null;

  await client.connect();
  collection = client.db("WWProject3").collection("scoredata");

  await collection.deleteOne({ _id:mongodb.ObjectID( req.body._id ), user: req.user._id});

  console.log(collection);
  
  const data = await collection.find( {user: req.user._id} ).toArray();
  console.log(data);

  await client.close();

  return res.json(data);

}); 

app.post( '/update', bodyparser.json(), async(req,res) => {

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  let collection = null;

  await client.connect();
  collection = client.db("WWProject3").collection("scoredata");

  await collection.updateOne(
    { user: req.user._id, _id:mongodb.ObjectID( req.body._id )},
    { $set:{ yourname:req.body.yourname, score:req.body.score, location:req.body.location } }
  )

  console.log(collection);
  
  const data = await collection.find( {user: req.user._id}).toArray();
  console.log(data);

  await client.close();

  return res.json(data);

}); 

