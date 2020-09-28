//server script
const express = require("express"),
  mongodb = require("mongodb"),
  bodyparser = require("body-parser"),
  app = express();

app.use(express.static("views"))
app.use(bodyparser.json());
/**
const uri =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASS +
  "@" +
  process.env.HOST +
  "/UserData" +
  process.env.DB;

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let collection = null;

client.connect().then(__collection => {
  // store reference to collection
  collection = client.db("UserData").collection("data");
  return collection.find({ }).toArray()
}).then(console.log)

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})
*/
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html"); //send login page on default
    console.log("plz2");
});

app.get("/secure", (req, res) => {
  res.sendFile(__dirname + "/views/secure.html"); //send login page on default
});

app.post("/add", (req, res) => {});

app.post("/update", (req, res) => {});

app.post("/delete", (req, res) => {});
app.post("/load", (req, res) => {
  res.writeHead(200,{ 'Content-Type': 'application/json'})
  //collection.find({}).then((data)=>res.end(JSON.stringify(data)));
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
  console.log("plz")
});
