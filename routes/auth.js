const router = require('express').Router()
const passport = require('passport')
const User = require('../user')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const CLIENT_ID = process.env.GOOGLE_OAUTH_ID
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_SECRET
const port = process.env.HOSTED_PORT? ':' + process.env.HOSTED_PORT : ''
// const callback_url = `http://${process.env.HOST}${port}${process.env.PREFIX || ''}/auth/callback`
const callback_url = '/auth/callback'
passport.serializeUser(function(user, done) {
	done(null, user)
})

passport.deserializeUser(function(user, done) {
	done(null, user)
})


passport.use(new GoogleStrategy({
	clientID:     CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	callbackURL: callback_url,
	passReqToCallback   : true
},
async function(request, accessToken, refreshToken, params, profile, cb) {
	User.findOne({google_id: profile.id}).then(result => {
		if(result == null) {
			const user = new User({google_id: profile.id, email: profile.emails[0].value, name: (profile.displayName || 'Unnamed User')})
			user.save().then(result => {
				return cb(null, result)
			}).catch(err => {return cb(err)})
		}
		else {
			return cb(null, result)}
	}).catch(err => {return cb(err)})
}))

router.get('/', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email']}))
router.get('/callback', passport.authenticate('google', {
	successRedirect: '/',
	failureRedirect: '/auth/fail'
}))

router.get('/signout', function(req, res){
	req.session.destroy()
	res.redirect('/')
})

// router.get('/callback', function(req, res){
// 	passport.authenticate('google', function(err, user){
// 		if(err){
// 			res.redirect('fail')
// 			return
// 		}
// 		req.session.cooki
// 		res.cookie('connect.sid', req.session.id, {'path': `${process.env.HOST}${port}${process.env.PREFIX || ''}/`})
// 	})
// })

router.get('/success', function(req, res){
	res.render('result', {title: 'Success!', message: 'Authenticated with Google Successfully!'})
})

router.get('/fail', function(req, res){
	res.render('result', {title: 'Error', message: 'Failed to autenticate with Google :('})
})

router.get('/user', function(req, res) {
	if(req.user) {
		res.json({user: req.user})
	}
	else{
		res.status(404).json({})
	}
})
module.exports = router