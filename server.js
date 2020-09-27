// TODO: re-order imports
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
const GitHubStrategy = require("passport-github2").Strategy;
const users = require("./routes/api/users");
const githubAuth = require("./routes/auth/github");
const passport = githubAuth.passport;

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
passport.use(new GitHubStrategy({
	clientID: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	//TODO: change for deployment
	callbackURL: "http://127.0.0.1:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => process.nextTick(() => done(null, profile))));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(methodOverride());
app.use(session({
	//! change secret and move to env
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", users.router);
app.use("/auth/github", githubAuth.router);
app.use("/", express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));