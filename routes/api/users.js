const express = require("express");
const router = express.Router();

const User = require("../../models/User");

router.get("/", (req, res) => {
	User.find().then(users => res.json(users));
});

router.post("/", (req, res) => {
	console.log(req.body);
	const newUser = new User({
		name: req.body.name
	});

	newUser.save().then(user => res.json(user));
});

module.exports = router;