const http = require( 'http' ),
      fs   = require( 'fs' ),
      moment = require('moment'),
      bodyParser = require('body-parser'),
      express = require('express'),
      serveStatic = require('serve-static'),
      morgan = require('morgan'),
      passport = require("passport"),
      dotenv   = require('dotenv').config({ path: 'dev.env' }),
      GitHubStrategy = require("passport-github").Strategy,
      mongodb = require('mongodb'),
      app     = express(),
      dir     = 'public/';

app.use(serveStatic('public'))
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session());

app.listen(3000)

const MongoClient = mongodb.MongoClient;
const uri = process.env.DB_URI;
let github = null;
let account = "";

app.get("/index.html", (request, response) => {
  if(account.length == 0){
    response.sendFile(__dirname + "/views/login.html")
  } else {
    response.sendFile(__dirname + "/views/index.html")
  }
});

app.get("/", (request, response) => {
  if(account != null){
    response.sendFile(__dirname + "/views/login.html")
  } else {
    response.sendFile(__dirname + "/views/index.html")
  }
});

app.get("/api/getData", async (request, response) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  await client.connect()
  const collection = client.db("TaskDatabase").collection("Tasks");
  const tasks = await collection.find({username: account}).toArray();
  await client.close()
  return response.json(tasks)
})

app.post("/login", async (request, response) => {
  github = false
  var userInfo = request.body
  console.log(userInfo)
  var username = userInfo.username
  var password = userInfo.password

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect()
  const collection = client.db("TaskDatabase").collection("Users");
  const user = await collection.find({username: username}).toArray()
  if(user.length === 0){
    await collection.insertOne(userInfo)
    await client.close()
    account = username
    response.ok = true;
  }
  else {
    await client.close()
    if(user[0].password == password){
      account = username
      response.ok = false;
    }
    else {
      account = ""
      response.ok = false;
    }
  }
  return response.end()
});

app.get('/logout', function (request, response){
  if(github == true){
    request.logout()
  }
  account = ""
  github = null
  response.ok = true;
  return response.end()
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, cb) => {
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
      await client.connect();
      const collection = client.db("TaskDatabase").collection("Users");
      const existingUser = await collection.find({username: account, github: true}).toArray()

      const newUser = {
        username: profile.username,
        password: null,
        github: true,
      };

      if (existingUser.length == 0) {
        await collection.insertMany([newUser]);
      };

      const userJSON = await collection.find({ username: profile.username, github: true }).toArray();
      await client.close();
      github = true;
      account = profile.username
      cb(null, userJSON[0]);
    }
));

app.get("/auth/github", passport.authenticate("github"));

app.get('/auth/github/callback', passport.authenticate("github", { failureRedirect: "/" }), function (request, response) {
    response.redirect("/index.html");
});

app.post("/submit", async (request, response) => {
    const object = request.body

    if(object.hasOwnProperty('delete')){
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
      await client.connect()
      const collection = client.db("TaskDatabase").collection("Tasks");
      console.log(object)
      await collection.deleteOne({_id: new mongodb.ObjectID(object.val)});
      const appdata = await collection.find({username: account}).toArray()
      await client.close()
      response.json(appdata)
      return response.end()
    }

    if(object.hasOwnProperty('tempID')){
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect()
      const collection = client.db("TaskDatabase").collection("Tasks");
      console.log(object)
      await collection.updateOne({ _id: new mongodb.ObjectID(object.tempID) }, {$set: { ...object, _id: new mongodb.ObjectID(object.tempID)}})
      const appdata = await collection.find({username: account}).toArray()
      await client.close()
      response.json(appdata)
      return response.end()
    }

    console.log(object)
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect()
    const collection = client.db("TaskDatabase").collection("Tasks");
    object.username = account;
    console.log(object.username)
    await collection.insertOne(object)
    const appdata = await collection.find({username: account}).toArray()
    await client.close()
    response.json(appdata)
    return response.end()
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
