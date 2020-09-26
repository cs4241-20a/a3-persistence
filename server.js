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
dotenv.config()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(cookieParser())
app.use(express.json()) // add with mongodb
app.use(morgan('tiny'))
app.use(passport.initialize())
app.use(passport.session())


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

var GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log("profile: " + profile);
        cb(null, profile);
    }
));

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('../../index.html');
    });




// Mongo
const uri = 'mongodb+srv://' + process.env.USERNAME + ':' + process.env.PASS + '@' + process.env.HOST + '/' + process.env.DB
const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let userCollection = null
let billCollection = null

client.connect(err => {
    userCollection = client.db('billtracker').collection('users')
    billCollection = client.db('billtracker').collection('bills')
    //billCollection.deleteMany({})

    if (userCollection !== null) {
        // Pass array to res.json
        userCollection.find({}).toArray().then(result => {
            console.log("USERS")
            console.log(result)
        })
    }

    if (billCollection !== null) {
        // Pass array to res.json
        billCollection.find({}).toArray().then(result => {
            console.log("BILLS")
            console.log(result)
        })
    }
})


// Serve files to index.html
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/node_modules'))

// Set default path as index.html
app.get('/', (req, res) => {

    //res.cookie('name', 'test').send('cookie set')
    //res.send(req.cookies)

    res.sendFile(__dirname + '/views/index.html')
})

app.get('/read', (req, res) => {
    console.log("HERE")
    console.log(req.cookies.user)
    res.send(req.cookies.user)
})

// Route to insert user
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


// Route to remove user ****** USE FOR BILLS *********
app.post('/removeUser', (req, res) => {
    userCollection
        .deleteOne({
            _id: mongodb.ObjectID(req.body._id)
        })
        .then(result => res.json(result))
})

// // Update entry
// app.post('/update', (req, res) => {
//     billCollection
//         .updateOne({
//             _id: mongodb.ObjectID(req.body._id)
//         }, {
//             $set: {
//                 name: req.body.name
//             }
//         })
//         .then(result => res.json(result))
// })

// Send results to server
app.post('/results', (req, res) => {
    console.log(req.body)
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

// Add new entry to appdata 
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

// app.post('/login', (req, res) => {
//     res.cookie("user", req.body)
//     return res.redirect('/index.html')
// })

app.post('/login', passport.authenticate('local', {
        failureRedirect: 'login.html'
    }),
    function (req, res) {
        res.cookie("user", req.body)
        res.redirect('/');
    });


// app.get( '/auth/google/callback', 
//     passport.authenticate( 'google', { 
//         successRedirect: '/auth/google/success',
//         failureRedirect: '/auth/google/failure'
// }));

app.post('/delete', (req, res) => {
    for (bill in req.body) {
        console.log(req.body[bill])
        billCollection.deleteOne(req.body[bill])
    }
})


app.post('/edit', (req, res) => {
    billCollection.deleteMany({
        'billUser': currentUser
    })
    billCollection.insertMany(req.body)


    // for (bill in req.body) {

    // }
    // Can i just edit instead of wiping?
    // let nameArr = []
    // let amtArr = []
    // let dateArr = []
    // let paidArr = []
    // let priArr = []

    // for (bill in req.body){
    //     nameArr.push(req.body[bill].billName)
    //     amtArr.push(req.body[bill].billAmt)
    //     dateArr.push(req.body[bill].billDate)
    //     paidArr.push(req.body[bill].billPay)
    //     priArr.push(req.body[bill].priority)
    // }
    // console.log(nameArr)
    // console.log(amtArr)
    // console.log(dateArr)
    // console.log(paidArr)
    // console.log(priArr)

    // let query = {
    //     'billName': {$in: nameArr}, 
    //     'billAmt': {$in: amtArr}, 
    //     'billDate': {$in: dateArr}, 
    //     'billPay': {$in: paidArr}, 
    //     'priority': {$in: priArr} 
    // }

    // query = {}
    // let update = {$set: {'billAmt': '44444'}}
    // billCollection.updateMany(query, update)
    // .then(result => {
    //     const { matchedCount, modifiedCount } = result;
    //     console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
    //     return result
    //   })
    //.then(result => console.log(result))

    // res.writeHead(200, "OK")
    // res.end()
})


// function addUser(bills) {
//     //bills["user"] = "user1"
//     bills.user = "user1"
//     return bills
// }

function isDuplicate(data, dbData) {
    // Iterate over appdata to search for matching entries 
    for (obj in dbData) {
        // Object is a match if first four fields match 
        if (dbData.user == data.user && dbData[obj].billName == data.billName && dbData[obj].billAmt == data.billAmt && dbData[obj].date == data.date && dbData[obj].billPay == data.billPay) {
            return true
        }
    }
    return false
}

// Calculate bill priorty on a scale of 1-3 based on amount, date, and if it has been paid
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