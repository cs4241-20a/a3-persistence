const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const moment = require("moment");
const compression = require("compression");
const errorhandler = require("errorhandler");

const users = require("./routes/api/users");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to db"))
.catch(err => console.error(err));

app.use(compression());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
	//app.use(morgan("combined"));
}

app.use("/api/users", users.router);
app.use("/", express.static(path.join(__dirname, "public")));

app.use((err, req, res, next) => {
	console.log("here");
	console.error(err);
	res.status(500).send("Sum Ting Wong");
});


/*app.get("/api/users", (req, res) => {
	handleSuccess(res);
})

app.post("/api/users", (req, res) => {
	let user = req.body;
	const dob = moment(new Date(user.dob)).add(1, "days").format("MM/DD/YYYY");
	const age = calculateUserAge(dob);
	user = {id: uuid(), ...user, dob, age};
	users.push(user);
	handleSuccess(res);
})

app.patch("/api/users/:id", (req, res) => {
	const id = req.params.id;
	const userIndex = users.findIndex(user => user.id === id);
	if (userIndex != null) {
		const {name, email, dob} = req.body;
		const user = users[userIndex];
		users[userIndex] = {...user, name, email, dob, age: calculateUserAge(dob)};
		handleSuccess(res);	
	} else {
		handleResourceNotFound(res);
	}
})

app.delete("/api/users/:id", (req, res) => {
	const id = req.params.id;
	if (users.some(user => user.id === id)) {
		users = users.filter((user) => user.id != id);
		handleSuccess(res);
	} else {
		handleResourceNotFound(res);
	}
})

const handleSuccess = res => {
	res.writeHeader(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(users));
}

const handleResourceNotFound = res => {
	res.writeHeader(404);
	res.end("Error 404 Not Found.");
}*/

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));