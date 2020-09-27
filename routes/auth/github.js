const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get('/', passport.authenticate("github", {
	scope: ["user:email"]
}));

router.get("/callback", passport.authenticate("github", {
	failureRedirect: "/login" 
}), (req, res) => res.redirect('account'));

router.get('/account', ensureAuthenticated, (req, res) => {
	res.send(`Hello, ${req.user.displayName}!`);
});

router.get('/login', (req, res) => {
	res.send("Please login");
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/");
}

module.exports = {router, passport};