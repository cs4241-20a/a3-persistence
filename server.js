// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require('body-parser')
const app = express();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://wying_glitch:${process.env.DBPASSWORD}@cluster0.zhrg2.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test");
  // perform actions on the collection object
  
  
  //client.close();
});

app.post("/add", bodyParser.json(), (request, response) => {
  collection.insertOne(request.body)
    .then(dbresponse => {
    response.json(dbresponse.ops[0])
  })
})

app.post("/delete", bodyParser.json(), (request, response) => {
  collection
    .deleteOne({_id:mongodb.ObjectID(request.body.id)})
    .then(result => response.json(result))
})

/*
// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
*/

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
//app.use(bodyParser.json())

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  let dreams = []
  let cursor = collection.find();
  let res = null;
  cursor.each(function(err, item) {
    if (item == null) {
      response.send(dreams);
    }
    dreams.push(JSON.stringify(item));
  })
  
  console.log(res)
  // express helps us take JS objects and send them as JSON
  
});



// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
