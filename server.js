"use strict";

require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;


let user = process.env.USERNAME;
let password = process.env.PASSWORD;
let dbname = process.env.DBNAME;

const uri = "mongodb+srv://" + user + ":" + password + "@prod.npojt.mongodb.net/" + dbname + "?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let collection = null;
client.connect()
.then(() => client.db("a3").collection("meals"))
.then(__collection => {
    collection = __collection;
    console.log("Connected");
})


app.use(express.static('public'))

app.post("/submit", bodyParser.json(), function(request, response) {
    //write post request code for a new item here
    console.log("Submit");
    let data = request.body;

    collection.insertOne(data, function(err, obj) {
        if (err) {
            response.sendStatus(500);
        } else {
            response.json(data);
        }
    })
})

app.post("/update", bodyParser.json(), function(request, response) {
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

    collection.updateOne({_id: new mongodb.ObjectID(request.body.id)}, {$set: temp}, function(err, obj) {
        if (err) {
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    })
})

app.post("/delete", bodyParser.json(), function(request, response) {
    //write post request code for a deleted item here
    console.log("Delete");
    collection.deleteOne({_id: new mongodb.ObjectID(request.body.id)}, function(err, obj) {
        if (err) {
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    })
})

app.post("/data", bodyParser.json(), function(request, response) {
    //write post request code for getting all data for a user
    console.log("Get Data");
    collection.find({username: request.body.username}).toArray().then(result => response.json(result));
})

app.listen(3000)