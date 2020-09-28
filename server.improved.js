const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  port = 3000;

const express = require("express");
const app = express();
const session = require("express-session"),
  passport = require("passport"),
  Local = require("passport-local").Strategy,
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  helmet = require("helmet");

const dir = "public/";

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const appdata = [
  {
    name_id: "Pooja Patel",
    flowertype: "None",
    instructions: "None",
    flower: 0,
    bouquet: 0,
    price: 0
  },
  {
    name_id: "Pooja Patel",
    flowertype: "Rose",
    instructions: "None",
    flower: 2,
    bouquet: 0,
    price: 2
  },
  {
    name_id: "Pooja Patel",
    flowertype: "Tulips",
    instructions: "None",
    flower: 0,
    bouquet: 20,
    price: 20
  },
  {
    name_id: "Pooja Patel",
    flowertype: "Orchids",
    instructions: "None",
    flower: 2,
    bouquet: 20,
    price: 22
  }
];

const users = [
  { username: "username", password: "password" },
  { username: "pooja", password: "patel" }
];

db.defaults({ appdata: appdata, users: users }).write();
//db.defaults({ appdata: appdata, users: users }).write()

app.use(express.static(dir));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());


app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/", function(req, res) {
  console.log("Cookies: ", req.cookies);

  console.log("Signed Cookies: ", req.signedCookies);
});

app.get("/bookings", (req, response) => {
  let data = db.get("appdata").value();
  console.log("dt", data);
  response.send(data);
});

app.post("/submit", function(req, response) {
  console.log("This is submit");

  console.log(req.body);
  const booking = req.body;
  const price = addingServices(
    parseInt(booking.flower),
    parseInt(booking.bouquet)
  );

  const newbooking = {
    name_id: booking.name_id,
    flowertype: booking.flowertype,
    instructions: booking.instructions,
    flower: parseInt(booking.flower),
    bouquet: parseInt(booking.bouquet),
    price: price
  };

  db.get("appdata")
    .push(newbooking)
    .write();

  response.writeHead(200, "OK", { "Content-Type": "application/json" });
  response.end(JSON.stringify(appdata));
});

app.post("/update", function(req, response) {
  const bookingToUpdate = req.body;
  let index = bookingToUpdate.index;

  const editedPrice = addingServices(
    parseInt(bookingToUpdate.flower),
    parseInt(bookingToUpdate.bouquet)
  );

  const updatedbooking = {
    parent_id: bookingToUpdate.parent_id,
    name_id: bookingToUpdate.name_id,
    flowertype: bookingToUpdate.flowertype,
    instructions: bookingToUpdate.instructions,
    flower: parseInt(bookingToUpdate.flower),
    bouquet: parseInt(bookingToUpdate.bouquet),
    price: editedPrice
  };

  db.get("appdata[" + index + "]")
    .assign(updatedbooking)
    .write();

  response.writeHead(200, "OK", { "Content-Type": "application/json" });
  response.end(JSON.stringify(appdata));
});

app.post("/delete", function(req, response) {
  const bookingToDelete = req.body;
  let index = req.body.bookingNumber;
  console.log(bookingToDelete);
  console.log(index);
  const indexVal = db.get("appdata[" + index + "]").value();
  console.log(indexVal);
  db.get("appdata")
    .remove(indexVal)
    .write();
  response.writeHead(200, "OK", { "Content-Type": "application/json" });
  response.end();
});

const addingServices = function(wantsflower, wantsBouquet) {
  const baseGroomingPrice = 0;
  const price = baseGroomingPrice + wantsflower + wantsBouquet;
  return price;
};

const myLocalStrategy = function(username, password, done) {
  const user = users.find(__user => __user.username === username);

  if (user === undefined) {
    return done(null, false, { message: "user not found" });
  } else if (user.password === password) {
    return done(null, { username, password });
  } else {
    return done(null, false, { message: "incorrect password" });
  }
};

passport.use(new Local(myLocalStrategy));
passport.initialize();

app.post("/login", passport.authenticate("local"), function(req, res) {
  console.log("user:", req.user);
  res.json({ status: true });
});
passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
  const user = users.find(u => u.username === username);
  console.log("deserializing:", name);

  if (user !== undefined) {
    done(null, user);
  } else {
    done(null, false, { message: "user not found; session not restored" });
  }
});

app.use(
  session({ secret: "cats cats cats", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.post("/test", function(req, response) {
  console.log("authenticate with cookie?", req.user);
  response.json({ status: "success" });
});

app.get("/register", (req, res) => {
  let data = db.get("users").value();
  res.send(data);
});

app.post("/register", (req, res) => {
  let data = req.body;
  db.get("users")
    .push(data)
    .write();
  res.status(200).send("User added to DB!");
});

app.listen(process.env.PORT || 3000);
