{
    const express = require('express');
    const passport = require('passport');
    const GitHubStrategy = require('passport-github').Strategy;
    const db = require('./public/js/db.js')
    const exphbs = require('express-handlebars');
    const multer = require('multer')
    const upload = multer()
    const bodyparser = require('body-parser')


//authentication
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.clientID,
                clientSecret: process.env.clientSecret,
                callbackURL:
                    'https://a3-herschelkrustofsky.glitch.me/auth/github/callback'
            },
            function (accessToken, refreshToken, profile, cb) {
                db.findOrCreate(profile).then(userRecord => {
                    return cb(null, userRecord);
                });
            }
        )
    );

    passport.serializeUser(function (userRecord, done) {
        let userId = userRecord.github_id
        console.log(`Serialized: ${userId}`);
        done(null, userId);
    });

    passport.deserializeUser(function (userId, done) {
        db.getUserById(userId).then(userRecord => {
            console.log(`Deserialized: ${userRecord}`);
            done(null, userRecord);
        })

    });


//create Express app
    const app = express();
    const port = 3000;


    app.use(express.static('public'));
    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');

    app.use(
        require('express-session')({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());


    app.get('/', (req, res) => {
        res.render('login', {layout: false});
    });


    app.get('/auth/github', passport.authenticate('github'));


    app.get(
        '/auth/github/callback',
        passport.authenticate('github', {failureRedirect: '/'}),
        function (req, res) {
            // Successful authentication, redirect home.
            db.getAllArtistRecords().then(userRecords => {
                console.log(userRecords)
                res.render('catalog', {records: userRecords, layout: false});
            })
        }
    );


//nav to create record page
    app.get('/createPage', (req, res) => {
        if (!req.user)
            res.render('login', {layout: false})
        res.render('create', {layout: false})
    })


//nav to create record page
    app.get('/modifyPage', (req, res) => {
        if (!req.user)
            res.render('login', {layout: false})
        db.getUserRecords(req.user.github_id).then((userRecords) => {
            res.render('modify', {records: userRecords, layout: false})
        })
    })

//nav to create record page
    app.get('/removePage', (req, res) => {
        if (!req.user)
            res.render('login', {layout: false})
        res.render('remove', {layout: false})
    })


//find record
    app.post('/findRecord', bodyparser.json(), (req, res) => {
        db.findRecord(req.user.github_id, req.body.artistName).then(artistRecord => {
            res.json(artistRecord)
        })
    })


//add record
    app.post('/addRecord', bodyparser.json(), (req, res) => {
        req.body['github_id'] = req.user.github_id
        db.addRecord(req.body)
    })

//update record
    app.post('/modifyRecord', bodyparser.json(), (req, res) => {
        req.body.new['github_id'] = req.user.github_id
        db.modifyRecord(req.body.old, req.body.new).then(() => {
                res.redirect('catalog')
            }
        )
    })


//delete record
    app.post('/removeRecord', bodyparser.json(), (req, res) => {
        db.removeRecord(req.user.github_id, req.body).then(() => {
            res.redirect('catalog')
        })

    })


//if the user is logged in show catalog
    app.get('/catalog', (req, res) => {
        if (!req.user) {
            res.render('login', {layout: false})
        } else {
            db.getAllArtistRecords().then(userRecords => {
                res.render('catalog', {records: userRecords, layout: false});
            })
        }
    })

//logout user
    app.get('/logout', (req, res) => {
        req.logout();
        req.session.destroy(function (err) {
            res.redirect('/'); //Inside a callback… bulletproof!
        });
    });


    app.listen(port, port => {
        console.log('Listening on port 3000');
    });

}