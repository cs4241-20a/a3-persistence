const express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    morgan = require('morgan'),
    mongodb = require('mongodb'),
    serveStatic = require('serve-static'),
    responseTime = require('response-time'),
    passport = require('passport'),
    port = 3000

let currUserId = null

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://${process.env.DBUSER}:${process.env.DBPW}@cluster0.6usct.gcp.mongodb.net/testdatabase?retryWrites=true&w=majority';
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null
let loginCollection = null

client.connect(err => {
    collection = client.db("testdatabase").collection("cars");
});

client.connect(err => {
    loginCollection = client.db("testdatabase").collection("users");
});

// defined middleware functions
var submitFunc = function(request, response, next) {
    let json = request.body

    let priority = getPriority(json.year, json.price)
    json.priority = priority
    json.userID = currUserId

    let tempdata = []
    tempdata.push(json)
    request.json = tempdata
    next()
}

var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
        clientID: process.env.GHCLIENTID,
        clientSecret: process.env.GHCLIENTSECRET,
        callbackURL: "https://a3-maria-medina-martinez.herokuapp.com/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
        let dbresponse = await loginCollection.findOne({ username: profile.id })

        if (dbresponse != null)
            currUserId = dbresponse._id

        else {
            let dbInsertResponse = await loginCollection.insertOne({ username: profile.id })
            let json = dbInsertResponse.ops[0]
            if (json != null)
                currUserId = json._id
        }
        return cb(null, profile);
    }
));

// middleware functions to always use
app.use(serveStatic('public'))
app.use(bodyparser.json())
    // app.use(morgan('combined'))
app.use(responseTime())
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/views/index.html');
    });

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/views/login.html')
})

app.get('/data', function(request, response) {
    console.log("Trying to get data from DB")

    console.log(currUserId)

    if (collection !== null) {
        // get array and pass to res.json
        collection.find({ userID: mongodb.ObjectID(currUserId) }).toArray()
            .then(result => response.json(result))
            .then(json => function(req, res) {
                response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
                response.write(JSON.stringify(json))
                response.end()
            })
    }
})

app.post('/login', async function(request, response) {
    console.log("Logging in.")

    let dbresponse = await loginCollection.findOne({
        $and: [
            { username: request.body.username },
            { password: request.body.password }
        ]
    })

    if (dbresponse != null)
        currUserId = dbresponse._id

    response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
    response.write(JSON.stringify(dbresponse))
    response.end()
})

app.post('/logout', async function(request, response) {
    console.log("Logging out.")
    currUserId = null

    response.sendStatus(200)
    response.end()
})

app.post('/create', async function(request, response) {
    console.log("Create.")
    let dbresponse = await loginCollection.insertOne(request.body)

    let json = dbresponse.ops[0]

    if (json != null)
        currUserId = json._id

    console.log(currUserId)
    response.write(JSON.stringify(json))
    response.end()
})

app.post('/submit', submitFunc, function(request, response) {
    console.log("Submit.")
    collection.insertOne(request.body)
        .then(dbresponse => {
            console.log(dbresponse)
            response.json(dbresponse.ops)
        })
        .then(json => function(req, res) {
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
            response.write(JSON.stringify(json))
            response.end()
        })
})

app.delete('/delete', function(request, response) {
    console.log("Delete.")
    console.log(request.body.id)
    collection.deleteOne({ _id: mongodb.ObjectID(request.body.id) })
        .then(result => response.json(result))
        .then(json => function(req, res) {
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
            response.write(JSON.stringify(json))
            response.end()
        })
})

app.put('/put', function(request, response) {
    console.log("Put.")

    collection
        .updateOne({ _id: mongodb.ObjectID(request.body.id) }, {
            $set: {
                make: request.body.make,
                model: request.body.model,
                year: request.body.year,
                price: request.body.price,
                priority: request.body.priority
            }
        })
        .then(result => response.json(result))
        .then(json => function(req, res) {
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
            response.write(JSON.stringify(json))
            response.end()
        })
})

const getPriority = function(year, price) {
    let priority = 5

    if (year < 1930 && price > 45000) {
        priority = 1
    } else if (year < 1960 && price > 45000) {
        priority = 2
    } else if (year < 1970 && price > 45000) {
        priority = 3
    } else if (year < 2020 && price > 45000) {
        priority = 4
    }
    return priority
}

app.listen(process.env.PORT || port)