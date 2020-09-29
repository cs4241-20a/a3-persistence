// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
var users = [];
//const login = document.getElementById("login");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const helmet = require("helmet");
var timeout = require('connect-timeout');
//const cookieParser = require("cookie-parser");
//var csurf = require('csurf');
const morgan = require("morgan");
const compression = require("compression");
//responsetime //node
//csurf
//cookieparser
const app = express();
// client.connect(err => {
//   collection = client.db("datadb").collection("data");
//   auth = client.db("datadb").collection("accounts");
// });
//const secret = 'secret';
// let dataSet = []


// our default array of dreams
const tasks = [
  {
    yourtask: "Find and count some sheep",
    priority: "High",
    creationdate: "09/15/2020"
    // advice: "Do it ASAP"
  },
 

  // {
  //   yourtask: "Climb a really tall mountain",
  //   date: "23/1/2005",
  //   priority: "Low"
  //   // advice: "Chill"
  // },
  // {
  //   yourtask: "Wash the dishes",
  //   date: "23/1/2005",
  //   priority: "Low"
  //   // advice: "Chill"
  // }
];

//app.use(cookieParser())

// app.get('/', function (req, res) {
//  //Cookies that have not been signed
// console.log('Cookies: ', req.cookies)

// //Cookies that have been signed
//  console.log('Signed Cookies: ', req.signedCookies)
// })

//app.use(csurf());
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(timeout('5s'));
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/task", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(tasks);
  //console.log(request.body)
  console.log(tasks)
});

// app.post("/add", bodyParser.json(), (request, response) => {
//   tasks.push(request.body);
//   response.json(request.body);
// });

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://cngilmore:${process.env.password}@cluster0.isdvh.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
let auth = null;
client.connect(err => {
  collection = client.db("Assignment3").collection("ToDo");
  auth = client.db("Assignment3").collection("Users");
  // perform actions on the collection object
});

app.use(helmet());

app.use(compression());

app.use(morgan('combined'));

app.post("/add", bodyParser.json(), function(request, response) {
  //tasks.push(request.body)
  console.log("body:", request.body);
  console.log(collection);
  //response.json(request.body);
  // return a promise, it will sh ow the data with the unique id
  collection.insertOne(request.body).then(dbresponse => {
    // console.log("This printed")
    console.log(dbresponse);
    
    let createdField = dbresponse.ops[0];
    if(createdField["priority"] == "Medium Priority"){
      createdField["duedate"] = "Complete no later than 3 days before assigned due date";
    }else if(createdField["priority"] == "High Priority"){
      createdField["duedate"] = "Complete no later than 7 days before assigned due date";
    }else if(createdField["priority"] == "Low Priority"){
      createdField["duedate"] = "Due date = do date it's ok to wait till the last minute XD";
    }
    
    response.json(createdField);
    
  });
});

app.post('/delete', bodyParser.json(), function(request, response) {
  console.log("This is the id: " + request.body.id)
  collection
    .deleteOne({_id:mongodb.ObjectID(request.body.id)})
    .then(result=>response.json(result))
})

app.post( '/update', bodyParser.json(), (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectID( req.body.id ) },
      { $set:{ "yourtask":req.body.yourtask, 
               "priority": req.body.priority,
               "creationdate": req.body.creationdate
             } }
    )
    .then( result => res.json( result ) )
    // .then(dbresponse =>{
    // console.log(dbresponse)
    // res.json(dbresponse)
    
 // })
})

app.post('/addUser', bodyParser.json(), function(req,res){
  
  auth.insertOne(req.body).then(dbresponse => {
  res.json(dbresponse.ops[0]);
  })
  console.log("User should be added")
})

app.get("/users", function(req, res) {
  auth.find().toArray().then(dbresponse => {
    res.json(dbresponse);
    console.log("Searching through list of users")
  })
})

// app.post('/login', bodyParser.json(),
//     passport.authenticate('local', {failureFlash: false}), function(request, response) {
//       response.json({username: request.user});
//     }
// );

// app.get("/results", function(request, response) {
//   collection.find({ username: request.headers.username })
//   .toArray()
//   .then(tasks => {
//     console.log(`Successfully found ${tasks.length} document(s) for Sensei ${request.headers.tasks}.`);
//     response.json( tasks );
//   })
