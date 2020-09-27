const express = require('express')
const User = require('../models/User')
const passport = require('passport');
const router = express.Router()
const { forwardAuthenticated } = require('../config/auth')

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'))

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'))

router.post('/register', async(req, res) => {
    const errors = []
    const { email, user, password, confirmPassword } = req.body

    if(confirmPassword !== password) errors.push({ msg: 'Error, passwords do not match' })


    if(errors.length > 0) {
        res.render(
            'register', {
                errors,
                user,
                email,
                password,
                confirmPassword
            }
        )
    } else {
        User.findOne({ email: email }).then(data => {
            if(data) {
                errors.push({ msg: 'Email already exist' })
                res.render('register', {
                    errors,
                    user,
                    email,
                    password,
                    confirmPassword
                })
            } else {
                const newUser = new User({
                    user,
                    email,
                    password
                })
                console.log(newUser)
                newUser.save()
                .then(user => {
                    req.flash(
                        'successmsg',
                        'You are now registered'
                    )
                    res.redirect('/users/login')
                })
                .catch(error => {
                    errors.push({ msg: error })
                    res.render('register', {
                        errors
                    })
                })
            }
        })
    }

})


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next)
})

router.get('/login/github', passport.authenticate('github'))

// user will be redirect to this route after OAuth succeed
router.get('/login/github/callback', (req, res, next) => {
    passport.authenticate('github', { 
        failureRedirect: '/users/login',
        successRedirect: '/home'
    })(req, res, next)
})

module.exports = router