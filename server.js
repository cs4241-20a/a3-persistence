require("dotenv").config();

const express = require("express"),
  cookie = require("cookie-session"),
  passport = require("passport"),
  compression = require("compression"),
  mongo = require("mongodb"),
  GitHubStrategy = require("passport-github").Strategy,
  MongoClient = require("mongodb").MongoClient,
  port = 3000;

const mongoURI = process.env.MONGO_URL;
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const mongoClient = new MongoClient(mongoURI, mongoConfig);

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

app.use((req, res, next) => {
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
      //callbackURL: "http://127.0.0.1:3000/callback/github/",
      callbackURL: "/callback/github",
    },
    async (accessToken, refreshToken, profile, callback) => {
      await mongoClient.connect();

      const userCollection = mongoClient.db("simcar").collection("users");

      const users = await userCollection
        .find({ username: profile.username })
        .toArray();

      if (users.length == 0) {
        const user = {
          username: profile.username,
        };

        await userCollection.insert(user);

        const dbUser = await userCollection.find({
          username: profile.username,
        });

        await client.close();

        callback(null, dbUser);
      } else {
        await client.close();

        callback(null, users[0]);
      }
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/callback/github",
  passport.authenticate("github", { failureRedirect: "/failed" }),
  function (req, res) {
    console.log("here");
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  return res.send();
});

app.post("/submit", async (req, res) => {
  if (!req.user) {
    return res.json({ success: false, auth: false });
  }

  const object = req.body;

  object.user = req.user._id;

  if (req.headers["x-forwarded-for"]) {
    object.ip = req.headers["x-forwarded-for"].split(",")[0];
  } else {
    object.ip = "N/A";
  }

  await mongoClient.connect();

  if (object.delete) {
    await collection.deleteOne({ _id: new mongo.ObjectID(object.id) });
  } else if (object.id) {
    await collection.updateOne(
      { _id: new mongo.ObjectID(object.id) },
      { $set: { ...object, _id: new mongo.ObjectID(object.id) } }
    );
  } else {
    await collection.insert(object);
  }

  const raceCollection = mongoClient.db("simcar").collection("races");

  const races = await raceCollection.find({ user: req.user._id }).toArray();

  await client.close();

  return res.json(races);
});

app.get("/", (_, response) => {
  response.sendfile(__dirname + "/public/index.html");
});

const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
