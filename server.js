const express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  cors = require("cors"),
  compression = require("compression"),
  GHStrategy = require("passport-github").Strategy,
  bodyParser = require("body-parser"),
  MongoClient = require("mongodb").MongoClient,
  mongodb = require("mongodb"),
  app = express(),
  port = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;

const todo = [{ id: 0, text: "Do A3" }];
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(compression());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GHStrategy(
    {
      clientID: process.env.GIT_HUB_ID,
      clientSecret: process.env.GIT_HUB_SECRET,
      callbackURL: process.env.GIT_HUB_CALLBACK,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const client = new MongoClient(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();
      const collection = client.db("A3_Data").collection("users");

      const docs = await collection
        .find({ username: profile.username })
        .toArray();

      if (docs.length === 0) {
        await collection.insertMany([
          {
            username: profile.username,
          },
        ]);
      }

      const users = await collection
        .find({ username: profile.username })
        .toArray();

      await client.close();
      cb(null, users[0]);
    }
  )
);

app.get("/auth", passport.authenticate("github"));

app.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/data", async (req, res) => {
  if (!req.user) {
    return res.json({ error: "Needs Login" });
  }

  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const collection = client.db("A3_Data").collection("todo");

  const docs = await collection.find({ user: req.user._id }).toArray();

  await client.close();

  return res.json(docs);
});


app.post("/add", bodyParser.json(), async (req, res) => {
  if (!req.user) {
    return res.json({ error: "Needs Login" });
  }
  const newItem = req.body;
  console.log(newItem);

  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const collection = client.db("A3_Data").collection("todo");

  await collection.insertOne({ ...newItem, user: req.user._id });

  const todos = await collection.find({ user: req.user._id }).toArray();
  await client.close();

  return res.json(todos);
});

app.post("/update", bodyParser.json(), async (req,res) => {
  if (!req.user) {
    return res.json({ error: "Needs Login" });
  }
  const newItem = req.body;

  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const collection = client.db("A3_Data").collection("todo");

  let _id = new mongodb.ObjectID(newItem._id);

  let result = await collection.updateOne({user: req.user._id, _id}, {$set:{
    title: newItem.title,
    description: newItem.description
  }})

  console.log(result.modifiedCount)

  const todos = await collection.find({ user: req.user._id }).toArray();
  await client.close();

  return res.json(todos);
})

app.delete("/remove", bodyParser.json(), async (req, res) => {
  if (!req.user) {
    return res.json({ error: "Needs Login" });
  }

  let _id = new mongodb.ObjectID(req.body._id);

  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const collection = client.db("A3_Data").collection("todo");

  const { deletedCount } = await collection.deleteOne({
    _id,
    user: req.user._id,
  });

  const todos = await collection.find({ user: req.user._id }).toArray();
  await client.close();

  if (deletedCount >= 1) {
    return res.json(todos);
  }

  return res.json({});
});

app.listen(port, () => {
  console.log(`Example app listening at port: ${port}`);
});
