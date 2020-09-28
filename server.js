const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");
const cookieSession = require("cookie-session"); //tried it but ended up not using it 
const session = require("express-session")
var passport = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;

const app = express();

app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "checkbox.ico")));
app.use(
  session({
    secret: "my secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    maxAge: 1000*60*60*24, //24hours,
  })
);
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, profile.username)
    }
  )
)

app.use(passport.initialize())
app.use(passport.session())


app.get('/auth', passport.authenticate("github"))

app.get("/getAuth", (request, response) => {
    if(!request.user){
      return response.json({user: false});
    }else{
      return response.json({user: request.user});
}
});

app.get(
  "/githubLogin",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/")
  }
)


/*app.post("/localLogin", bodyParser.json(), (req, res) => {
  collection
    .find({ user: req.body.user })
    .toArray()
    .then(result => {
      if (result.length < 1) {
        //no user yet
        collection.insertOne(req.body).then(result => {
          res.json(result);
        });
      } else {
        if ((req.body.password).localeCompare(result[0].password) === 0) {
          res.redirect("/views/index.html");
        } else {
          res.json(result);
        }
      }
    });
});

*/
app.post("/submit", bodyParser.json(), (request, response) => {
  if(request.user){
    request.body.user = request.user
  collection.insertOne(request.body).then(result => {
    response.json(result.ops[0]);
  });
  }
});

app.post("/getAll", bodyParser.json(), (request, response) => {
  collection
    .find({user:request.user})
    .toArray()
    .then(result => response.json(result));
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const uri = `mongodb+srv://a3Admin:${process.env.DBPASS}@assignment3.x9at2.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
  collection = client.db("test").collection("dataset");
  
});

app.post("/delete", bodyParser.json(), (request, response)  => {
  collection
    .deleteOne({
      _id: mongo.ObjectID(request.body.id)
    })
    .then(result => {
      response.json(result);
    });
});

app.post("/edit", bodyParser.json(), (request, response) => {
  collection
    .updateOne(
      { _id: mongo.ObjectID(request.body.habit) },
      {
        $set: { ["days." + request.body.row + "." + request.body.col]: request.body.val }
      }
    )
    .then(result => {
      response.json(result);
    });
});
