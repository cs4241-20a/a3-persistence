const express = require("express");
const moment = require("moment");

const User = require("../../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
	res.json(await User.find());
});

router.get("/:id", async (req, res) => {
	try {
		res.json(await User.findById(req.params.id));
	} catch {
		res.status(404);
		res.send({error: "User not found"});
	}
});

router.post("/", async (req, res) => {
	let {name, email, dob} = req.body;
	//? Consider moving to frontend
	dob = moment(new Date(dob)).add(1, "days").format("MM/DD/YYYY");
	const age = calculateUserAge(dob);
	const newUser = new User({name, email, dob, age});
	
	res.json(await newUser.save());
});

router.delete("/:id", async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(204).send();
	} catch {
		res.status(404);
		res.send({error: "User not found"});
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const {name, email, dob} = req.body;

		if (name) {
			user.name = name;
		}
		if (email) {
			user.email = email;
		}
		if (dob) {
			user.dob = dob;
			user.age = calculateUserAge(dob);
		}

		res.json(await user.save());
	} catch {
		res.status(404);
		res.send({error: "User not found"});
	}
})

const calculateUserAge = dob => moment().diff(moment(dob, "MM/DD/YYYY"), "years");

module.exports = {router, calculateUserAge};