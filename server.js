"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const session = require("express-session");

const items = require("./routes/api/items");
const githubAuth = require("./routes/auth/github-auth");

const app = express();
const passport = githubAuth.passport;

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

githubAuth.setupPassport();

try {
	mongoose.connect(MONGO_URI, {
		useNewUrlParser: true, 
		useUnifiedTopology: true
	}).then(() => console.log("Connected to db"));
} catch (err) {
	console.error(err);
}

if (NODE_ENV === "development") {
	app.use(morgan("dev"));
} else if (NODE_ENV === "production") {
	app.use(morgan("common", {
		skip: (req, res) => res.statusCode < 400,
		stream: fs.createWriteStream(path.join(__dirname, "access.log"), {flags: "a"})
	}));
}

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(methodOverride());
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/items", items.router);
app.use("/auth/github", githubAuth.router);

app.get("/css/style.css", (req, res) => {
	res.sendFile(path.join(__dirname, "public/css/style.css"));
})
app.get("/js/login.js", (req, res) => {
	res.sendFile(path.join(__dirname, "public/js/login.js"));
})

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "public/login.html"));
});
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});
app.use("/", githubAuth.ensureAuthenticated, express.static(path.join("public")));
app.get("*", (req, res) => {
	res.status(404).send("Error 404. Not found.");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));