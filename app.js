const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const swig = require('swig');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const { body } = require('express-validator');
const config = require('./config');

const app = new express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.engine('.html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


// middleware

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

const csrfProtection = csrf({ cookie: {
    httpOnly: true
}});

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || config.session.secret,
    name: 'sessionId',
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000 * 24 * 30)
    }
}));

mongoose.connect(process.env.MONGODB_URL || config.db.url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const conn = mongoose.connection;
conn.on('connected', function () {
    console.log('Mongodb connected');
});


// routes

const user = require('./routes/user');
const list = require('./routes/list');

app.get('/', user.auth, csrfProtection, index);
app.get('/list', user.auth, list.list);
app.get('/user/:id', list.userList);
app.get('/del/:id', user.auth, csrfProtection, list.del);
app.post('/add', [user.auth, csrfProtection, body('name').escape(), body('date').escape()], list.add);
app.post('/edit/:id', [user.auth, csrfProtection, body('name').escape(), body('date').escape()], list.edit);

app.get('/login', user.renderLogin);
app.post('/login', user.login);
app.get('/reg', user.renderRegister);
app.post('/reg', body('username').trim().escape(), user.reg);

app.use(function (req, res, next) {
    res.status(404);
    res.send('404 Not Found');
});

app.use(function (err, req, res, next) {
    res.status(403);
    res.send('Forbidden');
});

function index(req, res) {
    res.render('index', { csrf_token: req.csrfToken(), public_url: req.protocol + '://' + req.get('host') + '/user/' + req.session.userId });
}

if (!module.parent) {
    app.listen(process.env.PORT || 3000, () => {
        console.log('Started on port 3000');
    });
}

module.exports = app;
