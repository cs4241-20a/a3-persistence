const express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express();

app.use(express.static("public")); // middleware
app.use(bodyParser.json()); // middleware?

const uri = "mongodb+srv://first_test:Hudson1234@cluster0.iqi3u.mongodb.net/Webware?retryWrites=true&w=majority"

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null; // acts as my DBClient

client.connect()
    .then(() => {
        return client.db('Webware').collection('reviews');
    })
    .then(__collection => {
        collection = __collection;
        // blank query returns all documents
        return collection.find({}).toArray();
    })
    .then(console.log("Connected!"))


passport.use(new LocalStrategy(
    function (userName, passWord, done) {
        // finding the username and password in user collection
        const userNameColumn = client.db('Webware').collection('users');
        userNameColumn.find({
            username: userName,
            password: passWord
        }).toArray()
        .then(function(result) {
            // successful login
            if (result.length >= 1) {
                return done(null, userName)
            
            } else {
                // failed login
                return done(null, false, {
                    message: "Incorrect username or password!"
                });
            }
        });
    }
));

app.use(passport.initialize());

app.use((request, response, next) => { //middleware
    if (collection !== null) {
        next();

    } else {
        response.status(503).send();
    }
});

// when just getting the "/"
app.get("/", (request, response) => {
    console.log("Got request for webpage");
    response.sendFile(__dirname + "/public/login.html")
});


app.post("/signUp", bodyParser.json(), (request, response) => {
    console.log("Got request for main webpage");

    if (request.body.signUp === true) {
        const checkUserName = client.db('Webware').collection('users');
        checkUserName.find({
            username: request.body.username
        }).toArray()
        .then(function(result) {
            if (result.length < 1) {
                console.log("New User!")
                response.sendStatus(200)
                res.redirect('http://localhost:3000/main.html');
            
            } else {
                console.log("Existing User!")
                response.sendStatus(401)
            }
        })
    
    } else {
        console.log("check username and password")
        response.sendStatus(412)
        response.send()
    }
    //response.redirect(__dirname + "/public/main.html")
});



app.post('/submit', bodyParser.json(), (request, response) => {
    console.log("Got Submit");
    collection.countDocuments()
        .then((count) => {
            console.log(count);
        });

    console.log(request.body);
});


app.post('/modify', bodyParser.json(), (request, response) => {
    console.log("Got Modify");
    console.log(request.body);
});

app.post('/deletion', bodyParser.json(), (request, response) => {
    console.log("Got Deletion");
    console.log(request.body);
});



// listen for requests :)
app.listen(3000);
