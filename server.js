/* Copyright Zach Hilman - All Rights Reserved
 * -------------------------------------------
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and Confidential.
 *
 *
 *
 * Written By Zach Hilman <zachhilman@gmail.com>, September 2020
 */

const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const helmet = require('helmet');
const rid = require('connect-rid');
const morgan = require('morgan');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const app = express();

app.use(helmet({contentSecurityPolicy: false}));
app.use(rid({headerName: 'X-RID'}));
app.use(morgan('combined'));

const DB_SERVER = process.env.DB_SERVER;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(`mongodb://${DB_SERVER}/${DB_NAME}`)
    .then(() => console.log('MongoDB Connection Successful'));

const item_schema = new mongoose.Schema({
    id: Number,
    text: String,
});

const list_schema = new mongoose.Schema({
    user_id: {type: String, index: true, unique: true},
    next_id: Number,
    items: [item_schema],
});

const list_model = mongoose.model('List', list_schema);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://todo.zhdev.app/auth/github/callback'
}, (access, refresh, profile, done) => {
    list_model.findOneAndUpdate({user_id: profile.id}, {
        $setOnInsert: {
            next_id: 0,
            items: [],
        }
    }, {upsert: true}).then(() => done(null, profile));
}));

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({secret: 'a3', resave: false, saveUnitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.render('login', {user: req.user});
});

app.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}));

app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/'}), (req, res) => {
        res.redirect('/');
    });

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('index', {user: req.user});
});

app.get('/app', ensureAuthenticated, (req, res) => {
    res.render('app', {user: req.user});
});

app.get('/app/items', (req, res) => {
    list_model.findOne({
        user_id: req.user.id,
    }).then(document => {
        res.send(JSON.stringify(document.items));
    }).catch(error => console.log(error));
});

app.post('/app/item', body_parser.text(), (req, res) => {
    list_model.findOne({
        user_id: req.user.id,
    }).then(document => {
        let id = document.next_id++;
        document.items.push({
            id: id,
            text: req.body,
        });
        document.markModified('next_id');
        document.markModified('items');
        document.save();
    }).catch(error => console.log(error));
    res.end();
});

app.put('/app/item/:id', body_parser.text(), (req, res) => {
    list_model.findOne({
        user_id: req.user.id,
    }).then(document => {
        for (let index in document.items) {
            let object = document.items[index];
            if (object.id === parseInt(req.params.id)) {
                object.text = req.body;
            }
        }
        document.markModified('items');
        document.save();
    }).catch(error => console.log(error));
    res.end();
});

app.delete('/app/item/:id', (req, res) => {
    list_model.findOne({
        user_id: req.user.id,
    }).then(document => {
        document.items = document.items.filter(o => o.id !== parseInt(req.params.id));
        document.markModified('items');
        document.save();
    }).catch(error => console.log(error));
    res.end();
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Listening Started " + listener.address().port);
});
