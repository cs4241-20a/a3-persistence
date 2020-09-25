const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	// id: {
	// 	type: String,
	// 	required: true
	// },
	name: {
		type: String,
		required: true
	}
	// email: {
	// 	type: String,
	// 	required: true
	// },
	// dob: {
	// 	type: Date,
	// 	required: true
	// },
	// age: {
	// 	type: Number,
	// 	required: true
	// }
});

module.exports = User = mongoose.model("user", UserSchema);