// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express"),
      mongodb = require( 'mongodb' ),
      app = express();
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var morgan = require('morgan');

// our default array of dreams
var data = [
  "Patrick Star Freshman 4 2020 B-",
  "Spongebob Squarepants Junior 45 2019 F",
  "Sandy Cheeks Sophmore 0 2021 A+",
  "Plankton Lawrence Senior 4 2020 B+",
  "Eugene Krabs Senior 1 2020 C",
  "Pearl Krabs Freshman 0 2023 A-",
  "Squidward Tentacles Junior 2 2021 C-"
];

const login = [];

const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) {
    next();
  }
}

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(cookieParser());
app.use(morgan('combined'));

app.use(timeout('8s'));
app.use( bodyParser.json() );
app.use(haltOnTimedout);

var collection;


const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://rorysully:jiSdvf4Kq5TCxANa@cluster0.btzeq.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  collection = client.db("PuffsBoatingSchool").collection("UserData");
  
  
  collection.findOne({_id: mongodb.ObjectId('5f7281b84146de20dcfa8b91')}).then(response => {
    data = response.data;
  });
  
  //collection.insertOne({data:data}).then( result => ( result ) );
  // perform actions on the collection object
  // client.close();
});

function update(){
  try{
  collection.updateOne({_id: mongodb.ObjectId('5f7281b84146de20dcfa8b91')}, 
                      {$set: {data: data}});
  }
  catch(e){
    console.log(e);
  }

}


// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  setTimeout(() => {
    // Cookies that have not been signed
  console.log('Cookies: ', request.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', request.signedCookies);
    
  request.session.views = (request.session.views || 0) + 1

  response.sendFile(__dirname + "/views/index.html");
    
  // Write response
  console.log(request.session.views + ' views');
    
  }, Math.random() * 7000);
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(data);
});

app.post("/add", bodyParser.json(), (request, responce) => {
  data.push( request.body.dream );
  update();
  responce.json(request.body);
});

app.post("/login", bodyParser.json(), (request, responce) => {
  var returnVal = [...login];
  console.log(login.length)
  if(login.length == 0){
    var res = request.body.dream.split(" ");
    var newRes = request.body.dream.split(" ");
    login.push(res);
    newRes.push("New User");
    returnVal.push(newRes);
  }
  console.log(returnVal);
  responce.json(returnVal);
});

app.delete("/remove", (request, responce) => {
  for(var i = 0; i < data.length; i++){
    var res = data[i].split(" ");
    if(res[0] + " " + res[1] == request.body.dream){
      if (i > -1) {
        data.splice(i, 1);
      }
    }
  }
  update();
  responce.json(data);
});

app.post("/modify", bodyParser.json(), (request, responce) => {
  var result = request.body.dream.split(" : ");
  var i;
  for(i = 0; i < data.length; i++){
    var res = data[i].split(" ");
    console.log(res[0] + " " + res[1]);
    console.log(res);
    if(res[0] + " " + res[1] == result[0]){
      if (i > -1) {
        console.log("HERE");
        data.splice(i, 1);
        data.splice(i, 0, result[1]);
      }
    }
  }
  update()
  responce.json(data);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
