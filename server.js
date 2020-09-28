
const express = require('express'),
      moment = require('moment'),
      mongodb = require('mongodb'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      serveStatic = require('serve-static'),
      responseTime = require('response-time'),
      helmet = require("helmet"),
      passport = require("passport"),
      GitHubStrategy = require("passport-github").Strategy;
      app     = express()

app.use(function(req, res, next){
  next()
})

// Middlewares to be used by the express server
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(serveStatic('public'))
app.use(responseTime())
app.use(helmet({contentSecurityPolicy: false}))
app.use(passport.initialize())

// Port information
app.listen(3000)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port" + listener.address().port)
})

// Global variables for the MongoDb connections and who is logged in
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGO_DB_URI
var client = null
var currentUser = ""
var isGithubUser = null

// Function used to create a new client and start a connection to MongoDB
async function startDBConnection(){
  client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect()
}

// Serialize and deserialize functions needed for passport-github
passport.serializeUser(function(user, done) { done(null, user) })
passport.deserializeUser(function(user, done) { done(null, user) })

// Implementation of the passport GitHubStrategy based on the documentation
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK
  },
    // Connect to the DB, access the githib users and add a new entry if the
    // current user does not exist in the db. Then set the user global variables and call cb
    async function(accessToken, refreshToken, profile, cb) {
      await startDBConnection()
      const collection = await client.db("tasksDB").collection("githubCollection");
      const githubUser = await collection.find({userName: profile.username}).toArray();

      if (githubUser.length == 0) {
        await collection.insertOne({userName: profile.username});
      }
      await client.close();

      currentUser = profile.username
      isGithubUser = true

      cb(null, currentUser);
    })
  )

// Get request for logging into github that sends the user to Githibs website to authenticate
app.get('/auth/github', passport.authenticate('github'));

// Get request for the githib callback that redirects to either the main screen or the login screen based on authentication results
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/index.html')
})

// Get request for the login screen / starting screen
app.get('/', function (req, res){
  if(currentUser != ""){
      res.sendFile(__dirname + '/views/index.html')
  } else {
      res.sendFile(__dirname + '/views/login.html')
  }
})

// Get request for the main screen / todo screen
// If the user is not logged in, send a 403 and lock them out of accessing the page
app.get('/index.html', function (req, res){
  if(currentUser == ""){
    res.sendStatus(403)
  }
  else {
    res.sendFile(__dirname + '/views/index.html')
  }
})

// Get request to check if a user is logged in
// send a 500 if not so that the user is sent back to the login screen
app.get('/loggedIn', function (req, res){
  if(currentUser == ""){
    res.sendStatus(500)
  }
  else{
    res.sendStatus(200)
  }
})

// Get request to logout which logs the user out of github and
// resets the user global varriables. Sends 200 status to redirect to login screen
app.get('/logout', function (req, res){
  if(isGithubUser == true){
    req.logout()
  }
  currentUser = ""
  isGithubUser = null
  res.sendStatus(200)
})

// Get request to get the current user's name and github boolean
app.get('/getUser', function (req, res){
  res.json({user: currentUser, githubUser: isGithubUser});
})

// Get request that gets all the data from the DB for the current user and the type of account
app.get('/appData', async function (req, res){
  await startDBConnection()
  const collection = await client.db("tasksDB").collection("tasksCollection");
  const allTasks = await collection.find({userName: currentUser, githubUser: isGithubUser}).toArray()
  await client.close()
  res.json(allTasks)

  return res.end()
})

// Post request to login a user normally / without GitHub
app.post("/login", async function (req, res){
  // if a user is already signed in, redirect to that users page instead
  if (currentUser != "") {
    res.sendStatus(206)
    return res.end()
  }
  else {
    await startDBConnection()
    var userData = req.body
    var userName = userData.userName
    var password = userData.password
    isGithubUser = false

    const collection = await client.db("tasksDB").collection("usersCollection");
    const user = await collection.find({userName}).toArray()

    // if there is no user with that username, add the user to the db and send 200 status for login
    if(user.length == 0){
      await collection.insertOne(userData)
      await client.close()
      currentUser = userName
      res.sendStatus(200)
    }
    // if the user exists, check if the password is correct
    else {
      await client.close()
      if(user[0].password == password){
        currentUser = userName
        res.sendStatus(200)
      }
      else {
        currentUser = ""
        res.sendStatus(500)
      }
    }

  }
  return res.end()
})

// post request for adding new data to the DB
app.post("/add", async function (req, res){
  await startDBConnection()
  var postedData = req.body

  //Add the priority field and calculate its value
  var priority = await calculatePriority(postedData.dueDate, postedData.effort);
  postedData.priority = priority;

  // state which user owns this task and if its a github user or not
  postedData.userName = currentUser
  postedData.githubUser = isGithubUser

  //Add the new task and then return all the tasks for the user and their account type
  const collection = await client.db("tasksDB").collection("tasksCollection");
  await collection.insertOne(postedData)
  const allTasks = await collection.find({userName: currentUser, githubUser: isGithubUser}).toArray()
  await client.close()
  res.json(allTasks)

  return res.end()
})

// Post request for updating an entry in the db
app.post("/update", async function (req, res){
  await startDBConnection()
  var postedData = req.body
  var id = postedData.id
  delete postedData.id

  //Re-calculate the priority field
  var priority = await calculatePriority(postedData.dueDate, postedData.effort);
  postedData.priority = priority;

  // state which user owns this changed task and if its a github user or not
  postedData.userName = currentUser
  postedData.githubUser = isGithubUser

  // Update the task and then return all the tasks for the user and their account type
  const collection = await client.db("tasksDB").collection("tasksCollection");
  await collection.updateOne({ _id: new mongodb.ObjectID(id) }, {$set: { ...postedData}})
  const allTasks = await collection.find({userName: currentUser, githubUser: isGithubUser}).toArray()
  await client.close()
  res.json(allTasks)

  return res.end()
})

// Post request for deleting an entry in the db
app.post("/delete", async function (req, res){
  await startDBConnection()
  var postedData = req.body

  // Delete the task based on its unique id and then return all the tasks for the user and their account type
  const collection = await client.db("tasksDB").collection("tasksCollection");
  await collection.deleteOne({ _id: new mongodb.ObjectID(postedData.id) });
  const allTasks = await collection.find({userName: currentUser, githubUser: isGithubUser}).toArray()
  await client.close()
  res.json(allTasks)

  return res.end()
})

// calculates the priority based off hard coded inputs (number of days before due and effort determines the priority)
function calculatePriority (dueDate, effort) {
  var inputDate = new Date(moment(dueDate).format("MM/DD/YYYY"));
  var now = new Date(moment().format("MM/DD/YYYY"));
  var daysBeforeDue = (inputDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

  if(daysBeforeDue >= 14) return "Low";
  if(daysBeforeDue >= 7 && (effort == '1' || effort == '2')) return "Low";
  if(daysBeforeDue >= 7 && effort == '3') return "Medium-Low";
  if(daysBeforeDue >= 7 && effort == '4') return "Medium";
  if(daysBeforeDue >= 7 && effort == '5') return "Medium-High";
  if(daysBeforeDue < 0) return "PAST DUE";
  if(daysBeforeDue == 0 && effort == '5') return "I'm So Screwed";
  if(daysBeforeDue == 0) return "High";
  if((daysBeforeDue == 1) && (effort == '5' || effort == '4')) return "High";
  if((daysBeforeDue == 1) && (effort == '3' || effort == '2' || effort == '1')) return "Medium-High";
  if((daysBeforeDue == 2) && (effort == '5' || effort == '4')) return "High";
  if((daysBeforeDue == 2) && (effort == '3')) return "Medium-High";
  if((daysBeforeDue == 2) && (effort == '2' || effort == '1')) return "Medium";
  if(daysBeforeDue == 3 && (effort == '5' || effort == '4')) return "High";
  if(daysBeforeDue == 3 && (effort == '3' || effort == '2')) return "Medium";
  if(daysBeforeDue == 3 && (effort == '1')) return "Medium-Low";
  if((daysBeforeDue == 4 || daysBeforeDue == 5) && (effort == '5')) return "High";
  if((daysBeforeDue == 4 || daysBeforeDue == 5) && (effort == '4')) return "Medium-High";
  if((daysBeforeDue == 4 || daysBeforeDue == 5) && (effort == '3')) return "Medium";
  if((daysBeforeDue == 4 || daysBeforeDue == 5) && (effort == '2')) return "Medium-Low";
  if((daysBeforeDue == 4 || daysBeforeDue == 5) && (effort == '1')) return "Low";
  if(daysBeforeDue == 6 && (effort == '5' || effort == '4')) return "Medium-High";
  if(daysBeforeDue == 6 && (effort == '3' || effort == '2')) return "Medium-low";
  if(daysBeforeDue == 6 && (effort == '1')) return "Low";
  else return "Cannot Decide"
}
