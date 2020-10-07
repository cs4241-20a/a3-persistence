// IMPORTANT: you must run `npm install` in the directory for this assignment
// to install the a library used in the following lines of code

// init express
const express = require("express");
//const favicon = require("serve-favicon");
const mongodb = require("mongodb")
const env = require("dotenv/config");
const GitHubStrategy = require('passport-github').Strategy;
const app = express();
const port = 3000;

//middleware
const bodyParser = require("body-parser");
const passport = require("passport");
const morgan = require("morgan")
const helmet = require("helmet")
const responseTime = require("response-time")


app.use(express.static("public"));
app.use(passport.initialize());
app.use(morgan("combined"))
app.use(responseTime())
app.use(helmet())
app.use(bodyParser.json())

//Define mongo variables
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://hezi:${process.env.MONGO_PASS}@footballcluster.luqk2.mongodb.net/A3-Database?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let currentUser = ""
let isGitUser = null

let playerCollection = null
let userCollection = null
let gitCollection = null


client.connect(err => {
  gitCollection = client.db("A3-Database").collection("git_info");
  playerCollection = client.db("A3-Database").collection("player_info");
  userCollection = client.db("A3-Database").collection("user_info");
  //console.log(collection)
  //client.close()
});


// Serialize and deserialize functions needed for passport-github
passport.serializeUser(function(user, done) { done(null, user) })
passport.deserializeUser(function(user, done) { done(null, user) })

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
  },                      
                                
   async function(accessToken, refreshToken, profile, cb) {
  
    const githubUser = await gitCollection.find({githubUsername: profile.id}).toArray();
    
    gitCollection.insertOne({githubUsername: profile.username})
  
    currentUser = "profile.username"
  
    isGitUser = true
  
    cb(null, profile)
    
  
  }));

app.get("/auth/github", passport.authenticate("github"))

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/public/teamSheet.html');
  });

//Handle requests from client
app.get("/", (request, response) => {
  if(currentUser != "") {
    response.sendFile(__dirname + "/public/teamSheet.html");
  }else {
    response.sendFile(__dirname + "/public/login.html");
  }
  
});

app.get('/public/teamSheet.html', (request, response) => {
  if(currentUser == ""){
    response.sendStatus(403)
  }
  else {
    response.sendFile(__dirname + '/public/teamSheet.html')
  }
})

app.get('/isLoggedIn', (request, response) => {
  if(currentUser == ""){
    response.sendStatus(500)
  }
  else{
    response.sendStatus(200)
  }
})

app.get('/logout', (request, response) => {
  if(isGitUser == true){
    request.logout()
  }
  currentUser = ""
  isGitUser = null
  response.sendStatus(200)
})

app.get('/appdata',(request, response) => {
  
  let playerArray = []
  
  playerCollection.find({"account": currentUser}).forEach( doc => {
    playerArray.push(doc)
  })
  .then( () => {
    response.json(playerArray)
  })
  
})

app.get("/getCurrentUser", (request, response) => {
  
  const json = { 
    user: currentUser
  }
  
  response.json(json)
  
})

app.post("/login", bodyParser.json(), async (request, response) => {
  //console.log("body of request", request.body)
  
  if (currentUser != "") {
    response.sendStatus(206)
    return response.end()
  }
  else { 
  
    let userData = request.body
    let user_name = userData.username
    let user_pass = userData.password
    
    //console.log(user_name)
    //console.log(user_pass)
    //console.log(currentUser)
    
    isGitUser = false
    
    let user = await userCollection.find(user_name).toArray()
    
    //console.log(user)
    
    if(user.length == 0) {
      userCollection.insertOne(userData)
      currentUser = user_name
      response.sendStatus(200)
    }
    else {
      if(user[0].password == user_pass){
        currentUser = user_name
        response.sendStatus(200)
      }
      else {
        currentUser = ""
        response.sendStatus(500)
      }
    }
  
  }
  
  return response.end()
  
})

app.post("/submit", bodyParser.json(), (request, response) => {
  //console.log("body of server client:", request.body)
  //console.log(currentUser)
  //console.log(isGitUser)
  
  let addedPlayer = request.body
  
  addedPlayer.account = currentUser
  addedPlayer.gitUser = isGitUser
  
  //console.log(addedPlayer)
  
  playerCollection.insertOne(addedPlayer)
    .then( dbresponse => {
      response.json(dbresponse.ops[0])
  })
});

app.post("/delete", bodyParser.json(), (request, response) => {
  //console.log("body of server client:", request.body._id)
  playerCollection.deleteOne({ _id:mongodb.ObjectID( request.body._id ) })
    .then( () => {
      let playerArray = []
      
      playerCollection.find({"account": currentUser}).forEach( doc => {
        playerArray.push(doc)
      })
    .then( () => {
        response.json(playerArray)
      })
  })
});

app.post("/edit", bodyParser.json(), (request, response) => {
  
  const json = { 
    nick: request.body.nick,
    foot: request.body.foot,
    pos: request.body.pos,
    dateAdded: request.body.dateAdded
  }
  
  const id = request.body._id
  
  const newVal = { $set: json}
  
  playerCollection.updateOne( {_id:mongodb.ObjectID(request.body._id)}, newVal, (error, response) => {
    if(error) throw error;
    return
  })
  
  let playerArray = []
  
  playerCollection.find({"account": currentUser}).forEach( doc => {
    playerArray.push(doc)
  })
  .then( () => {
    response.json(playerArray)
  })

})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log(process.env.DEMON_DAYS);
});

