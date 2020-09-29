"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	username: {
		type: String,
		required: true	
	},
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	total: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("item", ItemSchema);