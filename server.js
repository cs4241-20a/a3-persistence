// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var passport = require('passport');
var Strategy = require('passport-local');
const bodyParser = require('body-parser');
var csrf = require('csurf')

const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb')
const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB
const client = new MongoClient(uri, { useNewUrlParser: true });
var responseTime = require('response-time')
var compression = require('compression')
var cookieParser = require('cookie-parser')
let collection = null
let database = null
let reports = null


client.connect()
  .then( () => {
    // will only create collection if it doesn't exist   
    database = client.db( 'access' )
    collection = database.collection('users')
    reports = database.collection('reports')
  })

// Configure the local strategy for use by Passport. 


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw()); 
app.use(responseTime())
app.use(compression())
app.use(cookieParser())
// setup route middlewares
var csrfProtection = csrf({ cookie: true })

app.set("view engine", "ejs");
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);

// https://expressjs.com/en/starter/basic-routing.html 
app.get("/", (request, response) => {
  response.render(__dirname + "/views/index.html", {incorrect: ""})
});

app.post( '/dashboard', function( request, response ) {
  let currentUser = request.body.user;
  console.log('post was made to dashboard')
  console.log(request.body)
  
  if(request.body.hasOwnProperty("remove")) {
    //remove
    console.log("REMOVE REQUESTED FOR ID=" + request.body.remove);
    database.collection("reports").deleteOne({_id: new mongodb.ObjectID(request.body.remove)}).then(result => {
      var allResults = null;
      var query = { user: currentUser };
      console.log(query)
      database.collection("reports").find(query).toArray(function(err, result) {
      if (err) throw err;
      allResults = result
      response.writeHead( 200, { 'Content-Type': 'application/json'})
      console.log(JSON.stringify(allResults))
      response.write(JSON.stringify(allResults))
      response.end()
      });
    })
  }
  else if(request.body.time != '')
  {
     database.collection("reports").insertOne(request.body).then(result => {
      console.log(`Successfully inserted item with _id: ${result.insertedId}`)
      var allResults = null;
      var query = { user: currentUser };
      console.log(query)
      database.collection("reports").find(query).toArray(function(err, result) {
        if (err) throw err;
        allResults = result
        response.writeHead( 200, { 'Content-Type': 'application/json'})
        console.log(JSON.stringify(allResults))
        response.write(JSON.stringify(allResults))
        response.end()
      });
     })
  }
  else {
    var allResults = null;
       var query = { user: currentUser };
       console.log("*****CAUGHT ERROR*****");
       database.collection("reports").find(query).toArray(function(err, result) {
         if (err) throw err;
         allResults = result
         response.writeHead( 200, { 'Content-Type': 'application/json'})
         console.log(JSON.stringify(allResults))
         response.write(JSON.stringify(allResults))
         response.end()
       });
  }
})

function findUser(user,pass,res) {
  console.log(user)
  collection.findOne({username:user}, function(err, item) {
      if(item == null) {
        console.log("Username not found. Creating account...")
          var myobj = { username: user, password: pass };
          database.collection("users").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Username did not exist, user created");
          });
        res.render(__dirname + "/views/dashboard.html", {username: user, noexist: "(Username did not exist, account created)"})
      }
      else {
        console.log("Found " + user)
        console.log("Stored password: " + item.password)
        console.log("Given password: " + pass)
        if(pass === item.password){
          console.log("***Login Success***")
          res.render(__dirname + "/views/dashboard.html", {username: user, noexist: ""})
        }
        else {
          res.render(__dirname + "/views/index.html", {incorrect: "User found, password incorrect"})
          console.log("Wrong password")
          return null
        }
      }
  })
} 

app.post('/', 
  function(req, res) {
    console.log(req.body)
    findUser(req.body.username, req.body.password,res)
  });

app.listen( 3000 )