"use strict";

require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const helmet = require('helmet')
const path = require('path')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;


let user = process.env.USERNAME;
let password = process.env.PASSWORD;
let dbname = process.env.DBNAME;

const uri = "mongodb+srv://" + user + ":" + password + "@prod.npojt.mongodb.net/" + dbname + "?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;
client.connect()
    .then(() => client.db("a3").collection("meals"))
    .then(__collection => {
        collection = __collection;
        console.log("Connected");
    })

passport.use(new LocalStrategy(
    function (username, userPassword, done) {
        const userColl = client.db("a3").collection("users");
        userColl.find({ username: username, password: userPassword }).toArray()
        .then(function (result) {
            if (result.length >= 1) {
                return done(null, username);
            } else {
                return done(null, false, { message: "Incorrect username or password" });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

app.use(passport.initialize());

app.use(helmet())

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(express.static('public', {extensions: 'html'}))

app.post("/submit", bodyParser.json(), function (request, response) {
    //write post request code for a new item here
    console.log("Submit");
    let data = request.body;

    collection.insertOne(data, function (err, obj) {
        if (err) {
            response.sendStatus(500);
        } else {
            response.json(data);
        }
    })
})

app.post("/update", bodyParser.json(), function (request, response) {
    //write post request code for an edited item here
    console.log("Edit");

    let keys = Object.keys(request.body);
    let temp = {};
    for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        if (element !== "id") {
            temp[element] = request.body[element];
        }
    }

    collection.updateOne({ _id: new mongodb.ObjectID(request.body.id) }, { $set: temp }, function (err, obj) {
        if (err) {
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    })
})

app.post("/delete", bodyParser.json(), function (request, response) {
    //write post request code for a deleted item here
    console.log("Delete");
    collection.deleteOne({ _id: new mongodb.ObjectID(request.body.id) }, function (err, obj) {
        if (err) {
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    })
})

app.post("/data", bodyParser.json(), function (request, response) {
    //write post request code for getting all data for a user
    console.log("Get Data");
    collection.find({ username: request.body.username }).toArray().then(result => response.json(result));
})

app.post("/newuser", bodyParser.json(), function (request, response) {
    console.log("New User");
    console.log(request.body);
    const userColl = client.db("a3").collection("users");
    userColl.insertOne(request.body)
    .then(() => response.sendStatus(200));
})

app.post('/login', bodyParser.json(),
    passport.authenticate('local', {failureFlash: false}), function(request, response) {
        response.json({username: request.user});
    }
);


let server = app.listen(3000)

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


function shutDown() {
    console.log("Shutting down");
    client.close();
    server.close()
}