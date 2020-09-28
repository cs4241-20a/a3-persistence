const md5 = require('md5');
const sanitize = require('mongo-sanitize');

const userModel = require('../models').User;

function auth(req, res, next) {
    userModel.findOne({'_id': sanitize(req.session.userId), 'password': sanitize(req.session.password)}, function (err, result) {
        if (result != null) {
            next();
        } else {
            res.redirect('/login');
        }
    });
}

function renderLogin(req, res) {
    res.render('login');
}

function login(req, res) {
    const user = req.body;

    userModel.findOne({username: sanitize(user.username), password: md5(user.password)}, function(err, result) {
        if (result != null) {
            req.session.userId = result._id;
            req.session.password = result.password;
            res.redirect('/');
        } else {
            res.render('login', { hasMsg: true, msg : 'Incorrect username or password. Please try again.'});
        }
    });
}

function renderRegister(req, res) {
    res.render('reg');
}

function reg(req, res) {

    if (req.body.username === "" || req.body.password === "") {
        res.redirect('/reg');
    } else {
        userModel.findOne({username: sanitize(req.body.username)}, function(err, result) {
            if (result != null) {
                res.render('reg', { hasMsg: true, msg : 'The username is already taken. Try another.'});
            } else {
                let user = {};
                user.username = sanitize(req.body.username);
                user.password = md5(req.body.password);

                let newUser = new userModel(user);
                newUser.save(function (err, docs) {
                    req.session.userId = docs._id;
                    req.session.password = docs.password;
                    res.redirect('/');
                });
            }
        });
    }
}

module.exports = {
    renderLogin: renderLogin,
    login: login,
    renderRegister: renderRegister,
    reg: reg,
    auth: auth
};
