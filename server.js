const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

const users = require("./routes/api/users");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

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

app.use("/api/users", users.router);
app.use("/", express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));