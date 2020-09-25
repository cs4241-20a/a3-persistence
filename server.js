const url = require("url");
const path = require("path");
const querystring = require("querystring");
const express = require("express");
const moment = require("moment");
const {v4: uuid} = require("uuid");

const PORT = process.env.PORT || 3000;

const app = express();

let users = [
	{id: uuid(), name: "John Smith", email: "jsmith@gmail.com", dob: "11/26/1992", age: "27"}
];

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.use("/", express.static(path.join(__dirname, "public")));

// TODO: cleanup API routes

app.get("/api/users", (req, res) => {
	handleSuccess(res);
})

app.post("/api/users", (req, res) => {
	let dataString = "";
	req.on("data", (data) => dataString += data);

	req.on("end", () => {
		if (req.url === "/api/users") {
			let user = JSON.parse(dataString);
			user = {id: uuid(), ...user};
			user.dob = moment(new Date(user.dob)).add(1, "days").format("MM/DD/YYYY");
			user.age = calculateUserAge(user.dob);
			users.push(user);
			handleSuccess(res);
		} else {
			handleResourceNotFound(res);
		}
	});
})

app.patch("/api/users", (req, res) => {
	let dataString = "";
	req.on("data", (data) => dataString += data);

	req.on("end", () => {
		let userEdits = JSON.parse(dataString);
		const parsedUrl = url.parse(req.url);
		const query = querystring.parse(parsedUrl.query);
		if (parsedUrl.pathname === "/api/users") {
			const {id} = query;
			const userIndex = users.findIndex(user => user.id === id);
			if (userIndex != null) {
				const {name, email, dob} = userEdits;
				const userIndex = users.findIndex(user => user.id === id);
				const user = users[userIndex];
				users[userIndex] = {...user, name, email, dob, age: calculateUserAge(dob)};
				handleSuccess(res);	
			} else {
				handleResourceNotFound(res);
			}
		} else {
			handleResourceNotFound(res);
		}
	});
})

app.delete("/api/users", (req, res) => {
	const parsedUrl = url.parse(req.url);
	const query  = querystring.parse(parsedUrl.query);

	if (parsedUrl.pathname === "/api/users") {
		const {id} = query;
		if (users.some(user => user.id === id)) {
			users = users.filter((user) => user.id != id);
			handleSuccess(res);
		} else {
			handleResourceNotFound(res);
		}
	} else {
		handleResourceNotFound(res);
	}
})

const handleSuccess = (res) => {
	res.writeHeader(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(users));
}

const handleResourceNotFound = (res) => {
	res.writeHeader(404);
	res.end("Error 404 Not Found.");
}

const calculateUserAge = (dob) => {
	return moment().diff(moment(dob, "MM/DD/YYYY"), "years");
}