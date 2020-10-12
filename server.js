let express = require("express");
let mongoDB = require('mongodb');
let app = express();

//current author
let currentAuthor = null;

// middleware imports
let bodyParser = require('body-parser');
let morgan = require('morgan');
let compression = require('compression');
let helmet = require('helmet')
let passport = require('passport')
let GitHubStrategy = require('passport-github').Strategy;

// middlware usages
app.use(express.static("./public"));
app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());

// constants and variable related to establishing a connection to the cluster
const uri = "mongodb+srv://webserver:webserver1@cluster0.gswqr.mongodb.net/website-data?retryWrites=true&w=majority";
const client = new mongoDB.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null;

// passport stuff
passport.use(new GitHubStrategy({
        clientID: '847470238063eb7674e1',
        clientSecret: '927ebede89f357d6f737ed7142dd51948275abcf',
        callbackURL: "https://cjburri-a3-persistence-1.glitch.me/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));
passport.serializeUser(function(user, cb) {
    currentAuthor = user['id'];
    cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
    console.log("deserialized");
    cb(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());


// connect to the MongoDB cluster
client.connect().then( () => {
    // will only create collection if it doesn't exist
    return client.db('website-data').collection('guests');
}).then( __collection => {
    // store reference to collection
    collection = __collection
    return "Connected to guests collection on website-data DB";
}).then( console.log )

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/guestList.html');
    }
);

// add a guest
app.post('/add', bodyParser.json(), (request, response) => {
    // get the data
    let data = request.body;

    //constructing the document to be stored in the DB
    let document = {
        author: currentAuthor,
        fullName: getFullName(data['firstName'], data['middleName'], data['lastName']),
        gender: data['gender'],
        birthday: data['birthday'],
        ableToDrink: getDrinkingValidity(data['birthday'])
    }

    // insert the document into the DB
    collection.insertOne(document).then(result => {
        collection.find({'author': currentAuthor}).toArray(function (err, results) {
            response.json(results);
            console.log("INSERTED: " + document['fullName']);
        });
    });
});

// delete a guest
app.post('/delete', bodyParser.json(), (request, response) => {
    // get the data
    let data = request.body;

    // delete the record
    collection.deleteOne(data).then(() => {
        collection.find({'author': currentAuthor}).toArray(function (err, results) {
            response.json(results);
        });
    });
});

// load all of the records
app.post('/load', (request, response) => {
    // get all of the records
    collection.find({'author': currentAuthor}).toArray(function(err, results) {
        response.json(results);
    });
});

// modify a record
app.post('/modify', bodyParser.json(), (request, response) => {
    // get the data from the request
    let data = request.body;

    collection.find({'fullName': data['fullName'], 'author': currentAuthor}).toArray().then((document) => {
        return document[0];
    }).then((document) => {
        let newVal = !document['ableToDrink'];
        collection.updateOne({'fullName': document['fullName'], 'author': currentAuthor}, {$set: {'ableToDrink': newVal}});
    }).then(() => {
        collection.find({"author": currentAuthor}).toArray(function (err, results) {
            response.json(results);
        });
    })
});

// helper method to get full name of the guest
let getFullName = function( fName, mName, lName) {
    return fName + " " + mName + " " + lName;
};

// helper method to get the validity of the drinking age of the guest
let getDrinkingValidity = function (birthday) {
    let birthdayComponents = birthday.split("-");
    let birthDate = new Date(birthdayComponents[0], birthdayComponents[1], birthdayComponents[2]);
    let ageDifMs = Date.now() - birthDate.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch

    let ageYears = Math.abs(ageDate.getUTCFullYear() - 1970);

    return ageYears >= 21;
};

// set port to listen
let listener = app.listen(process.env.PORT, () => {
    console.log("App is listening on port: " + listener.address().port);
});