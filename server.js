// JavaScript source code
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const responseTime = require('response-time');
const compression = require('compression');
const app = express(),
const port = 3000;
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(compression());
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

passport.use(new LocalStrategy(
    function (username, userPassword, done) {
        const userColl = client.db("bilbo").collection("william");
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

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.post("/submit", bodyParser.json(), function (request, response) {
    //write post request code for a new item here
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
    //Editing items here
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
    //Deleted items here
    collection.deleteOne({ _id: new mongodb.ObjectID(request.body.id) }, function (err, obj) {
        if (err) {
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    })
})

app.post("/data", bodyParser.json(), function (request, response) {
    //Get all user data
    collection.find({ username: request.body.username }).toArray().then(result => response.json(result));
})

app.post("/newuser", bodyParser.json(), function (request, response) {
    //Creating new user account
    const userColl = client.db("bilbo").collection("william");
    userColl.insertOne(request.body)
        .then(() => response.sendStatus(200));
})

app.post('/login', bodyParser.json(),
    passport.authenticate('local', { failureFlash: false }), function (request, response) {
        response.json({ username: request.user });
    }
);


let server = null;
waitForElement();

//Wait for the database connection to be made before the server
function waitForElement() {
    if (collection !== null) {
        console.log("Server started");
        server = app.listen(process.env.PORT || 3000);
    }
    else {
        setTimeout(waitForElement, 500);
    }
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    console.log("Shutting down");
    client.close();
    server.close()
}

app.listen(process.env.PORT || port)
