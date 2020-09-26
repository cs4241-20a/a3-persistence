require("dotenv").config();

const express = require("express"),
  cookie = require("cookie-session"),
  passport = require("passport"),
  compression = require("compression"),
  mongo = require("mongodb"),
  GitHubStrategy = require("passport-github").Strategy,
  MongoClient = require("mongodb").MongoClient,
  port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URL;
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.use(
  cookie({
    name: "session",
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(express.json());
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.use(compression());

app.use((_req, _res, next) => {
  // log stuff here
  next();
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL:
        "https://3000-d3e10579-b991-4946-a9d3-5c35c3e9b444.ws-us02.gitpod.io/callback/github",
      //callbackURL: "https://a3-rmanky.herokuapp.com/callback/github",
    },
    async (_accessToken, _refreshToken, profile, callback) => {
      const mongoClient = new MongoClient(mongoURI, mongoConfig);

      await mongoClient.connect();

      const userCollection = mongoClient.db("simcar").collection("users");

      const user = {
        username: profile.username,
      };

      const users = await userCollection.find(user).toArray();

      if (users.length == 0) {
        await userCollection.insertOne(user);

        const dbUser = await userCollection.find(user).toArray();

        await mongoClient.close();

        callback(null, dbUser[0]);
      } else {
        await mongoClient.close();

        callback(null, users[0]);
      }
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/callback/github",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (_, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/auth/user", async (req, res) => {
  if (req.user) {
    return res.json(req.user);
  } else {
    return res.json({ failed: true });
  }
});

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post("/submit", async (req, res) => {
  if (!req.user) {
    return res.json({ failed: true });
  }

  const object = req.body;

  object.username = req.user.username;

  const mongoClient = new MongoClient(mongoURI, mongoConfig);

  await mongoClient.connect();

  const raceCollection = mongoClient.db("simcar").collection("races");

  await raceCollection.insertOne(object);

  console.log(req.user.username + " requested submission of " + object._id);

  const raceResults = await raceCollection
    .find()
    .sort({ laptime: 1 })
    .toArray();

  await mongoClient.close();

  raceResults.forEach((entry) => {
    appendDateAndMine(entry, req.user);
  });

  return res.json({ failed: false, results: raceResults });
});

app.get("/results", async (req, res) => {
  const mongoClient = new MongoClient(mongoURI, mongoConfig);

  await mongoClient.connect();

  const raceCollection = mongoClient.db("simcar").collection("races");

  const raceResults = await raceCollection
    .find()
    .sort({ laptime: 1 })
    .toArray();

  await mongoClient.close();

  raceResults.forEach((entry) => {
    appendDateAndMine(entry, req.user);
  });

  return res.json({ failed: false, results: raceResults });
});

const appendDateAndMine = function (entry, user) {
  if (!user) {
    entry.mine = false;
  } else if (entry.username === user.username) {
    entry.mine = true;
  } else {
    entry.mine = false;
  }
  let date = entry._id.getTimestamp();
  entry.settime = date;
};

app.post("/update", async (req, res) => {
  if (!req.user) {
    return res.json({ failed: true });
  }

  const object = req.body;

  const mongoClient = new MongoClient(mongoURI, mongoConfig);

  await mongoClient.connect();

  const raceCollection = mongoClient.db("simcar").collection("races");

  await raceCollection.updateOne(
    { _id: new mongo.ObjectID(object.id) },
    { $set: { ...object, _id: new mongo.ObjectID(object.id) } }
  );

  console.log(req.user.username + " requested update of " + object.id);

  const raceResults = await raceCollection
    .find()
    .sort({ laptime: 1 })
    .toArray();

  await mongoClient.close();

  raceResults.forEach((entry) => {
    appendDateAndMine(entry, req.user);
  });

  return res.json({ failed: false, results: raceResults });
});

app.post("/delete", async (req, res) => {
  if (!req.user) {
    return res.json({ failed: true });
  }

  const object = req.body;

  const mongoClient = new MongoClient(mongoURI, mongoConfig);

  await mongoClient.connect();

  const raceCollection = mongoClient.db("simcar").collection("races");

  await raceCollection.deleteOne({ _id: new mongo.ObjectID(object.lapID) });

  console.log(req.user.username + " requested removal of " + object.lapID);

  const raceResults = await raceCollection
    .find()
    .sort({ laptime: 1 })
    .toArray();

  await mongoClient.close();

  raceResults.forEach((entry) => {
    appendDateAndMine(entry, req.user);
  });

  return res.json({ failed: false, results: raceResults });
});

app.get("/", (_, response) => {
  response.sendfile(__dirname + "/public/index.html");
});

const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
