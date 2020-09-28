const express = require("express");

const Item = require("../../models/Item");

const router = express.Router();

router.get("/", async (req, res) => {
	res.json(await Item.find().sort({date: -1}));
});

router.get("/:id", async (req, res) => {
	try {
		res.json(await Item.findById(req.params.id));
	} catch {
		res.status(404);
		res.send({error: "Item not found"});
	}
});

router.post("/", async (req, res) => {
	let {name, price, quantity} = req.body;
	price = price.replace("$", "").replace(",", "");
	const total = parseFloat(price) * quantity;
	const newItem = new Item({name, price, quantity, total});
	
	res.json(await newItem.save());
});

router.delete("/:id", async (req, res) => {
	try {
		await Item.findByIdAndDelete(req.params.id);
		res.status(204).send();
	} catch {
		res.status(404);
		res.send({error: "Item not found"});
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const item = await Item.findById(req.params.id);
		let {name, price, quantity} = req.body;
		price = price.replace("$", "").replace(",", "");
		console.log("here");

		console.log(item);

		if (name) {
			item.name = name;
		}
		if (price) {
			item.price = price;
			item.total = parseFloat(price) * quantity;
		}
		if (quantity) {
			item.quantity = quantity;
			item.total = parseFloat(price) * quantity;
		}

		console.log(item);

		res.json(await item.save());
	} catch {
		res.status(404);
		res.send({error: "Item not found"});
	}
})

module.exports = {router};