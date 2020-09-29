// JavaScript source code
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const responseTime = require('response-time');
const path = require('path');
const helmet = require('helmet');
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(
    responseTime((request, response, time) =>
        console.log(request.method, request.url, time + "ms")
    )
);
app.use(morgan("tiny"));
app.use(helmet());
require("dotenv").config();
const mongodb = require("mongodb");
let client_id = process.env.GITHUB_CLIENT_ID;
let client_secret = process.env.GITHUB_CLIENT_SECRET;

//connectng to mongodb
const MongoClient = mongodb.MongoClient;
const uri =
    "mongodb+srv://dbuser:${process.env.DBPASSWORD}@cluster0.rtnhc.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;
client.connect(err => {
    collection = client.db("bilbo").collection("swaggins");
    // perform actions on the collection object
});


app.get("/", (request, response) => {
    if (request.session.githubid) {
        response.sendFile(__dirname + "/public/index.html");
    } else {
        response.sendFile(__dirname + "/public/login.html");
    }
});

app.get("/geturl", (request, response) => {
    const path = request.protocol + "://" + request.get("host");
    const url =
        "https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${path}/login/github/callback";
    response.json(url);
});

async function getAccessToken(code) {
    const response = await fetch("https://github.com/login/oauth/access_token", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id,
            client_secret,
            code
        })
    });
    const data = await response.text();

    const params = new URLSearchParams(data);
    return params.get('access_token');
}

async function getGHUser(accessToken) {
    const request = await fetch("https://api.github.com/user", {
        headers: { Authorization: `bearer ${accessToken}` }
    });
    const data = await request.json();
    return data;
}

app.get('/login/github/callback', async (request, response) => {
    const accessToken = await getAccessToken(
        request.query.code,
        client_id,
        client_secret
    );
    const GHData = await getGHUser(accessToken);

    if (GHData) {
        request.session.githubid = GHData.id;
        request.session.token = GHData.token;
        response.redirect("/");
    } else {
        console.log("Error while logging in");
        response.redirect("/login.html");
    }
});

app.get("/", (request, response) => {
    request.session = null;
    response.redirect("/");
});

app.post("/submit", (request, response) => {
    const json = {
        githubid: request.session.githubid,
        studentName: request.body.studentName,
        studentID: request.body.studentID,
        studentClass: request.body.studentClass,
        timeWorked: request.body.timeWorked,
        payment: request.body.payment
    };
    collection.insertOne(json).then(data => {
        response.json(data.json[0]);
    });
});

app.post("/delete", (request, response) => {
    collection.deleteOne({ _id: mongodb.ObjectID(request.body._id) }).then(() => {
        var array = [];
        collection
            .find({ "githubid": request.session.githubid })
            .forEach(doc => {
                array.push(doc);
            })
            .then(() => {
                response.json(array);
            });
    });
});

app.post("/edit", (request, response) => {
    const json = {
        githubid: request.session.githubid,
        studentName: request.body.studentName,
        studentID: request.body.studentID,
        studentClass: request.body.studentClass,
        timeWorked: request.body.timeWorked,
        payment: request.body.payment
    };
    const id = request.body._id;
    const newVal = { $set: json };
    collection.updateOne(
        { _id: mongodb.ObjectID(request.body._id) },
        newVal,
        (error, response) => {
            if (error) throw error;
            return;
        }
    );
    var array = [];
    collection
        .find({ githubid: request.session.githubid })
        .forEach(doc => {
            array.push(doc);
        })
        .then(() => {
            response.json(array);
        });
});

app.listen(process.env.PORT || port)
