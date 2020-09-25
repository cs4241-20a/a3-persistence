const express = require('express')
const User = require('../models/User')
const passport = require('passport');
const router = express.Router()


router.post('/register', async(req, res) => {
    const errors = []
    const { email, username, password, confirmPassword } = req.body

    const usedEmail = await User.findOne({ email: email })
    console.log(usedEmail)
    const usedUsername = await User.findOne({ user: username })
    if(usedEmail) errors.push({ msg: 'Error, email must be unique' })
    if(usedUsername) errors.push({ msg: 'Error, username must be unique' })
    if(confirmPassword !== password) errors.push({ msg: 'Error, passwords do not match' })

    if(errors.length > 0) {
        return res.send(errors)
    }

    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).redirect('/loginpage')
    } catch(e) {
        const temp = [...e.message.replace('users validation failed: ', '').split('., ')]
        temp.forEach(err => errors.push({ msg: err }))
        res.status(400).send(errors)
    }
})


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/homepage',
      failureRedirect: '/loginpage',
      failureFlash: true
    })(req, res, next)
})

router.get('/login/github', passport.authenticate('github'))

// user will be redirect to this route after OAuth succeed
router.get('/login/github/callback', (req, res, next) => {
    passport.authenticate('github', { 
        failureRedirect: '/loginpage',
        successRedirect: '/homepage'
    })(req, res, next)
})

module.exports = router