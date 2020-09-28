// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport")
const GithubStrategy = require('passport-github').Strategy

const cookieSession = require('cookie-session');
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://dbUser:dbUserPassword@a3-recipe-book.xyl2m.mongodb.net/recipes?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null

client.connect(err => {
    collection = client.db("recipebook").collection("recipes");
});

// our default array of dreams
const dreams = [
    "Find and count some sheep",
    "Climb a really tall mountain",
    "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});


app.post("/add", bodyParser.json(), (request, response) => {
    collection.insertOne(request.body).then(dbresponse => {
        console.log(dbresponse);
        response.json(dbresponse.ops[0]);
    });
});

app.get('/recipes', (req, res) => {
    if( collection !== null ) {
        // get array and pass to res.json
        collection.find({ }).toArray().then( result => res.json( result ) )
    }
})

app.post("/update", bodyParser.json(), (req, res) => {
    console.log(req.body)
    collection
        .updateOne(
            { _id:mongodb.ObjectID( req.body.id ) },
            { $set:{ name:req.body.name,
                type: req.body.type,
                time: req.body.time,
                ingredients: req.body.ingredients,
                directions: req.body.directions} }
        )
        .then( result => res.json( result ) )
});

app.post("/delete", bodyParser.json(), (request, response) => {
    collection
        .deleteOne({ _id: mongodb.ObjectID(request.body.id) })
        .then(result => response.json(result));
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});

