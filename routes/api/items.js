"use strict"; 

const express = require("express");

const Item = require("../../models/Item");
const githubAuth = require("../auth/github-auth");

const router = express.Router();

router.get("/", githubAuth.ensureAuthenticated, async (req, res) => {
	res.json(await Item.find({username: req.user.username}).sort({date: -1}));
});

router.get("/:id", githubAuth.ensureAuthenticated, async (req, res) => {
	try {
		res.json(await Item.find({username: req.user.username, _id: req.params.id}));
	} catch {
		res.status(404);
		res.send({error: "Item not found"});
	}
});

router.post("/", githubAuth.ensureAuthenticated, async (req, res) => {
	let {name, price, quantity} = req.body;
	price = parseFloat(price.replace("$", "").replace(",", ""));
	quantity = parseInt(quantity);
	const total = price * quantity;
	const newItem = new Item({username: req.user.username, name, price, quantity, total});
	
	res.json(await newItem.save());
});

router.delete("/:id", githubAuth.ensureAuthenticated, async (req, res) => {
	try {
		await Item.findOneAndDelete({username: req.user.username, _id: req.params.id});
		res.status(204).send();
	} catch {
		res.status(404);
		res.send({error: "Item not found"});
	}
});

router.patch("/:id", githubAuth.ensureAuthenticated, async (req, res) => {
	try {
		const item = await Item.findOne({username: req.user.username, _id: req.params.id});
		const {name, price, quantity} = req.body;

		if (name) {
			item.name = name;
		}
		if (price) {
			item.price = price;
		}
		if (quantity) {
			item.quantity = quantity;
		}
		item.total = item.price * item.quantity;

		res.json(await item.save());
	} catch {
		res.status(404);
		res.send({error: "Item not found"});
	}
})

module.exports = {router};