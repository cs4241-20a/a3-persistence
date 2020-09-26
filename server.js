const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const mongodb = require('mongodb')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(passport.initialize())
app.use(passport.session())

dotenv.config()
var currentUser = {username: ""}
  


/***** Passport setup *****/
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
})

// Set strategy
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"   // CHANGE TO GLITCH
    },
    function (accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }
));

// Set routes
app.get('/auth/github',
    passport.authenticate('github'))

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Set username
        currentUser.username = req.user.displayName
        //res.cookies.user = undefined
        // Successful authentication, redirect home
        res.redirect('../../index.html')
    })



/***** MongoDB Setup *****/
const uri = 'mongodb+srv://' + process.env.USERNAME + ':' + process.env.PASS + '@' + process.env.HOST + '/' + process.env.DB
const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let userCollection = null
let billCollection = null

// Connect to DB
client.connect(err => {
    userCollection = client.db('billtracker').collection('users')
    billCollection = client.db('billtracker').collection('bills')
    //billCollection.deleteMany({})     // Wipe DB
})



/***** Application Routes *****/
// Serve files 
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/node_modules'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

// Read cookies from user login 
app.get('/read', (req, res) => {
    if (req.cookies.user != undefined){
        currentUser = req.cookies.user
    }
    res.json(currentUser)
})

// Route to insert user into database
app.post('/addUser', (req, res) => {
    userCollection.insertOne(req.body)
        .then(result => {
            res.json(result.ops[0])
        })
})

// Get all users from database
app.get('/getAllUsers', (req, res) => {
    userCollection.find({}).toArray(function (err, result) {
        res.json(result)
    })
})

// Get all bills for a user from the database
app.post('/results', (req, res) => {
    billCollection.find({
        'billUser': req.body.user
    }).toArray(function (err, result) {
        res.setHeader("Content-Type", "application/json")
        res.json(result)
        if (err) {
            console.log(err)
        }
    })
})

// Add new bill to database
app.post('/add', (req, res) => {
    let bills = req.body
    billCollection.find({}).toArray(function (err, result) {
        if (!isDuplicate(bills, result)) {
            bills = addPriority(bills)
            billCollection.insertOne(bills)
            res.writeHead(200, "OK")
            res.end(JSON.stringify(bills))
        } else {
            res.writeHead(200, "DUPLICATE", {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify(bills))
        }
    })
})

// Login users
app.post('/login', (req, res) => {
    // Set cookie and redirect
    res.cookie("user", req.body)
    return res.redirect('/index.html')
})

// Delete bills for a user from database 
app.post('/delete', (req, res) => {
    for (bill in req.body) {
        billCollection.deleteOne(req.body[bill])
    }
})

// Psuedo "edit" bills for a user
app.post('/edit', (req, res) => {
    // Delete and replace all with new versions
    billCollection.deleteMany({
        'billUser': currentUser.username          
    })
    billCollection.insertMany(req.body)
})



/***** Helper functions *****/

// Check if bill already exists for user in database
function isDuplicate(data, dbData) {
    for (obj in dbData) {
        // Object is a match if first four fields + user matches 
        if (dbData.user == data.user && dbData[obj].billName == data.billName && dbData[obj].billAmt == data.billAmt && dbData[obj].date == data.date && dbData[obj].billPay == data.billPay) {
            return true
        }
    }
    return false
}

// Calculate bill priority on a scale of 1-3 based on amount, date, and if it has been paid
function addPriority(data) {

    // If data is single entry (not in an array), add prioirty to JSON obj
    if (data.length == undefined) {
        // If bill has been paid already
        if (data.billPay) {
            data.priority = '1'
        } else {
            // Calculate days since bill was issued
            var today, date;
            today = new Date();
            date = new Date(data.billDate);
            var res = Math.abs(today - date) / 1000;
            var daysSinceBill = Math.floor(res / 86400);

            // If bill was issued over 3 weeks ago, set to level 2
            if (daysSinceBill > 21) {
                data.priority = '3'
            } else {
                data.priority = '2'
            }
        }
    }
    // If data has length (aka multiple entries in an array)
    else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].billPay) {
                data[i].priority = '1'
            } else {
                var today, date;
                today = new Date();
                date = new Date(data[i].billDate);
                var res = Math.abs(today - date) / 1000;
                var daysSinceBill = Math.floor(res / 86400);
                if (daysSinceBill > 21) {
                    data[i].priority = '3'
                } else {
                    data[i].priority = '2'
                }
            }
        }
    }
    return data
}

app.listen(3000)