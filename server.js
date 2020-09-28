const express = require("express"),
    app = express(),
    mongodb = require("mongodb"),
    bodyparser = require("body-parser"),
    passport = require("passport"),
    session = require("cookie-session"),
    timeout = require("connect-timeout");
var GitHubStrategy = require("passport-github").Strategy;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
var userID;

// make all the files in 'public' available
require('dotenv').config()
app.use(timeout('5s'))
app.use(session({
    name: 'session',
    maxAge: 24*60*60*1000,
    keys: [process.env.COOKIE_KEY]
}));
app.use(timeOutHalt);
app.use(express.static("public"));
app.use(timeOutHalt);
app.use(passport.initialize());
app.use(passport.session());
app.use(timeOutHalt);

app.get("/login_github", (req, res) => {
    //const path = req.protocol + '://' + req.get('host');
    //const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${path}/github/callback`;
    res.json("https://a3-jialin-song.glitch.me/github/callback");
});

app.get("/yourdata", (request, response) =>{
    response.sendFile(__dirname + "/views/yourdata.html");
});
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});
app.get("/allresults", (request, response) => {
    response.sendFile(__dirname + "/views/showresults.html");
});


//mongodb
let collection = null;
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://jsong:${process.env.DB_PASSWORD}@cluster0.2sdqv.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    collection = client.db("datatest").collection("test");
});

app.post('/add', bodyparser.json(), function(req, res){
    let findExist = collection.find({name: req.body.name}).sort({name:1})
        .toArray()
        .then(items => {
            if(items.length === 0){
                collection.insertOne(req.body)
                    .then(dbresponse => {
                        res.json(dbresponse.ops[0])
                    })
            }else{
                res.json(null)
            }
        })
        .catch(err => console.error(`Failed to find: ${err}`));
})

app.post('/login', bodyparser.json(), function(req, res){
    let findExist = collection.find({name: req.body.name})
        .toArray()
        .then(items => {
            if(items.length !== 1){
                res.json(null)
            }else{
                if(items[0].password === req.body.password){
                    res.json(req.body)
                    userID = items[0]._id;
                }else{
                    res.json(null)
                }
            }
        })
        .catch(err => console.error(`Failed to find documents: ${err}`));
})

//github login
passport.use(new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://a3-jialin-song.glitch.me/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            if(profile.id !== undefined && profile.username !== undefined){
                collection.find({id:profile.id, name:profile.username}).toArray()
                    .then(exist => {
                        if(exist === undefined || exist.length === 0){
                            collection.insertOne({id:profile.id, name:profile.username, mt:[]});
                            userID = exist._id;
                        }else{
                            userID = exist._id;
                        }
                    })}
            return done(null, profile);
        });
    }
));
app.get('/github',
    passport.authenticate('github'));

app.get('/github/callback',
    passport.authenticate('github', {failureRedirect:'/'}),
    function(req, res) {
        res.sendFile(__dirname + "/views/yourdata.html");
    });

app.get('/logout', function (req, res){
    req.session = null;
    res.clearCookie();
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

//other
app.get('/myname', function(req,res){
    if(userID === undefined){
        res.json(req.session.passport.user.username)
    }else{
        collection.find({_id:userID}).toArray()
            .then(item => {
                if(item[0] !== undefined){
                    res.json(item[0].name)
                }
            })
    }
})

app.get('/appdata', function(req,res){
    if(!userID){
        collection.findOne({id:req.session.passport.user.id},
            {_id:0, id:0, name:0})
            .then(dbres => res.json(dbres.mt));
    }else{
        collection.findOne({_id:userID},
            {_id:0, id:0, name:0})
            .then(dbres => res.json(dbres.mt));
    }
});

app.post('/addMilktea', bodyparser.json(), function(req, res){
    if(!userID){
        collection.updateOne({id:req.session.passport.user.id}, {
            $push: {'mt': req.body}
        })
            .then(dbres => res.json(dbres.modifiedCount))
    }else{
        collection.updateOne({_id:userID}, {
            $push: {'mt': req.body}
        })
            .then(dbres => res.json(dbres.modifiedCount))
    }
})

app.post('/delete', bodyparser.json(), function(req, res){
    if(!userID){
        collection.update({id:req.session.passport.user.id}, {
            $pull: {'mt': req.body}
        })
            .then(dbres => res.json(dbres.modifiedCount))
    }else{
        collection.update({_id:userID}, {
            $pull: {'mt': req.body}
        })
            .then(dbres => res.json(dbres.modifiedCount))
    }
})

app.get('/alldata', function(req, res){
    collection.find().toArray()
        .then(dbres => res.json(dbres))
})

function timeOutHalt(req, res, next){
    if(!req.timedout) next()
}

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
