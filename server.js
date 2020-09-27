const { response, request } = require('express');

require('dotenv').config();
const express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    ObjectID = require('mongodb').ObjectID,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cookieSession = require('cookie-session'),
    helmet = require('helmet'),
    favicon = require('serve-favicon'),
    path = require('path'),
    GitHubStrategy = require('passport-github2').Strategy,
    app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))) // middleware
app.use(express.static("public")); // middleware
app.use(bodyParser.json()); // middleware
app.use(helmet()); //middleware

app.use(cookieSession({ // middleware
    name: 'session',
    keys: ['key1']
}));

let user = process.env.DBUSER;
let password = process.env.DBPASSWORD;

const uri = "mongodb+srv://" + user + ":" + password + "@cluster0.iqi3u.mongodb.net/Webware?retryWrites=true&w=majority"

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


passport.use(new LocalStrategy( //middleware
    function (userName, passWord, done) {
        // finding the username and password in user collection
        const userNameColumn = client.db('Webware').collection('users');
        userNameColumn.find({
            username: userName,
            password: passWord
        }).toArray()
            .then(function (result) {
                // successful login
                if (result.length >= 1) {
                    console.log("Successful Login!")
                    return done(null, userName)

                } else {
                    // failed login
                    console.log("Login Failed!")
                    return done(null, false, {
                        message: "Incorrect username or password!"
                    });
                }
            });
    }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {
        return done(null, profile);
    })
  }
));

// referenced: https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(passport.initialize());

app.use((request, response, next) => { //middleware
    if (collection !== null) {
        next();

    } else {
        response.status(503).send();
    }
});

function setUserSession(request, username) {
    request.session['User'] = username;
}

// when just getting the "/"
app.get("/", (request, response) => {
    console.log("Got request for webpage");
    response.sendFile(__dirname + "/public/login.html")
});

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/getData');
  });

app.post("/login", bodyParser.json(),
    passport.authenticate('local', { failureFlash: false }),
    function (request, response) {
        //response.json({ username: request.username });
        let userName = request.body.username;
        setUserSession(request, userName);
        response.redirect("/getData");
    }
);

app.post("/signUp", bodyParser.json(), (request, response) => {
    console.log("Got request for main webpage");

    const checkUserName = client.db('Webware').collection('users');
    checkUserName.find({
        username: request.body.username
    }).toArray()
        .then(function (result) {
            if (result.length < 1) {
                console.log("New User!");

                const user = client.db('Webware').collection('users');
                user.insertOne(request.body)
                    .then(() => {
                        let userName = request.body.username;
                        setUserSession(request, userName);
                        response.redirect("/getData");
                    });

            } else {
                console.log("Existing User!");
                response.sendStatus(401);
            }
        }).catch(function () {
            console.log("rejected");
        })
});


app.get("/getData", bodyParser.json(), (request, response) => {
    let currentUser = request.session['User'];
    response.sendFile(__dirname + "/public/main.html")
})

app.get("/getUser", (request, response) => {
    let currentUser = request.session['User'];

    if (currentUser == null) {
        response.sendStatus(404);
    }

    let jsonObj = {username: currentUser};

    response.send(JSON.stringify(jsonObj));
});

app.get("/reviews", (request, response) => {
    let currentUser = request.session['User'];

    if (currentUser == null) {
        response.sendStatus(404);
    }

    const userNameColumn = client.db('Webware').collection('reviews');
    userNameColumn.find({
        username: currentUser
    }).toArray()
        .then(function (result) {
            response.send(JSON.stringify(result))
        });
});

app.post('/submit', bodyParser.json(), (request, response) => {
    console.log("Got Submit");
    recievedData = request.body;

    recievedData = cleanUpJSON(recievedData)

    collection.insertOne(recievedData)
    .then(() => {
        console.log("Inserted to DB")
        response.sendStatus(200);
    });

});

app.post('/save', bodyParser.json(), (request, response) => {
    console.log("Got Save");
    recievedData = request.body;

    recievedData = cleanUpJSON(recievedData)

    let entryID = recievedData.entryID;

    console.log(recievedData)

    let findID = {_id: ObjectID(entryID)};

    let updatedValues = { 
        $set: {
            name: recievedData.name,
            deviceName: recievedData.deviceName,
            priceRating: recievedData.priceRating,
            batteryRating: recievedData.batteryRating,
            performanceRating: recievedData.performanceRating,
            feelRating: recievedData.feelRating,
            overallRating: recievedData.overallRating
        }
    };

    collection.updateOne(findID, updatedValues, function(err, res) {
        if (err) throw err;

        console.log("Updated 1 Document!");
    })
    
    response.sendStatus(200);
});

function cleanUpJSON(recievedData) {
    let priceRating = parseInt(recievedData.priceRating.charAt(0));
    let batteryRating = parseInt(recievedData.batteryRating.charAt(0));
    let performanceRating = parseInt(recievedData.performanceRating.charAt(0));
    let feelRating = parseInt(recievedData.feelRating.charAt(0));

    var overallRating = calculateOverallRating(priceRating, batteryRating, performanceRating, feelRating)

    recievedData.priceRating = priceRating;
    recievedData.batteryRating = batteryRating;
    recievedData.performanceRating = performanceRating;
    recievedData.feelRating = feelRating;
    recievedData.overallRating = parseFloat(overallRating);

    return recievedData;
}


app.post('/modify', bodyParser.json(), (request, response) => {
    console.log("Got Modify");
    console.log(request.body.entryID)
    collection.find({
        _id: ObjectID(request.body.entryID)
    }).toArray()
    .then(function (result) {
        if (result.length <= 0) {
            console.log("Not Found!")
            response.sendStatus(404);
        
        } else {
            console.log(result)
            response.send(JSON.stringify(result[0]))
        }
        
    });
    
});

app.post('/deletion', bodyParser.json(), (request, response) => {
    console.log("Got Deletion");
    recievedData = request.body;

    let entryID = recievedData.entryID;

    let findID = {_id: ObjectID(entryID)};

    collection.deleteOne(findID, function(err, obj) {
        if (err) throw err;

        console.log("Deleted 1 Document!");
    });

    response.sendStatus(200);
});


function calculateOverallRating(price, battery, performance, feel) {
    var overallRating = (price + battery + performance + feel) / 4;

    overallRating = overallRating.toFixed(2);

    return overallRating;
}


// listen for requests :)
app.listen(3000);
