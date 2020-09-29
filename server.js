// server.js
// where your node app starts
// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const mongodb = require('mongodb');
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const MongoClient = mongodb.MongoClient;
const bcrypt = require('bcrypt')
const ejs = require('ejs');
const flash = require('express-flash')
const uri = "mongodb+srv://jcybul:jcybul123@cluster0.gnipe.mongodb.net/log1?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
app.use(bodyparser.json())
app.set('view-engine',ejs);
const saltRounds = 10;
let collection = null
let users = null
let name = "";
var rjson =""
//////////////////////////////////////
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy


client.connect(err => {
   collection = client.db("log1").collection("Fishing_log");
    users = client.db("log1").collection("UserInfo");
//   let s = "jcybul"
//     users.find({uname:"jcybul"}).toArray().then(result=>{
//       console.log(result[0].uname)} )
  
//   users.count({uname: s}).then(r =>{
//   if(r > 0){
//     console.log("True");
//   }
//   })
});


app.use(express.static("public"));
app.use(express.urlencoded({extended: false}))

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.redirect("/login")
});



app.get("/loggedIn",(req,res)=>{
  console.log("user has logged in")
  if(name == "" || name == "3"){
    res.redirect("/")
  }
 res.render(__dirname + "/views/index.ejs",{name});
})
// register get route 
app.get("/register", (req,res)=>{
 res.render(__dirname + "/views/register.ejs");
})

app.get("/logout", (req,res)=>{
 console.log('in log out')
 name = ""
 res.redirect("/")
})

// register a new user post rout 
app.post("/register",async (request, response) => {
  let message = ""
  try{
    users.count({uname:request.body.uname }).then(r =>{
  if(r > 0){
    message = "Fail"
    response.json(message);
  }
  else{
    bcrypt.hash(request.body.password, saltRounds, (err, hash) => {
      console.log(hash);
    users.insertOne({uname:request.body.uname,password: hash})
    });
    message= "Succes";  
    response.json({body:message})
    console.log("succesful registration")
  }
  })
  }
  catch{
    console.log("failed to register")
    response.redirect('/register');
  }
});

//user login check with password hashing 
app.post("/login" ,async(request,response) => {
  try{
    let uin = request.body.uname;
    let pin = request.body.password;
    console.log(uin)
    console.log(pin)
    //check a user with that uname exist- username are unique 
    users.count({uname: uin}).then(r =>{
  if(r > 0){
    console.log(r)
    users.find({uname:uin}).toArray().then(c =>{  
      console.log(c[0].password)
        bcrypt.compare(pin,c[0].password, function(err, res) {
          if(res == true){
          console.log("Autenticated")
            response.json("succes")
          name = uin;
        }
          else{
        let m = "Fail"
        console.log(m)
        response.json(m);
        }
       
      });
   
  })
  }
  else{
    let m = "Fail"
    console.log(m)
    response.json(m);
  }
    })
    
  }
  catch(e){
    console.log(e)
  }
  
})

app.get("/login", (request,response)=>{
  response.render(__dirname + "/views/login.ejs");
})

// send the default array of dreams to the webpage
app.get("/load", (request, response) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({anglername:name }).toArray().then( result => {
    response.json(result)} )
  }
    //response.json(JSON.stringify(data));
});

app.post('/add',bodyparser.json(),function(req,res){
  collection.insertOne({anglername: name,fishtype:req.body.fishtype,fishweight: req.body.fishweight,lineclass:req.body.lineclass,date: req.body.date})
  .then(dbresponse => {
    res.json(dbresponse.ops[0]);
  })
  })
app.post('/deleteAll',bodyparser.json(),function(req,res){
  console.log("deleted all")
  collection.deleteMany({anglername:name})
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
