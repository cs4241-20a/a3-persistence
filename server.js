const express = require("express");
const bodyParser = require("body-parser");
const slash = require("express-slash");
const favicon = require("serve-favicon");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const mongodb = require("mongodb");
const cookieSession = require("cookie-session");

const app = express();
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://${process.env.DBACC}:${process.env.DBPASSWORD}@persistence.9btm7.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;

// allow urls that end with or without a slash to be the same thing: https://github.com/ericf/express-slash
app.enable("strict routing");
app.use(slash());

// creating the cookie to tell if people are logged in:
// http://expressjs.com/en/resources/middleware/cookie-session.html
app.use(
  cookieSession({
    name: "session",
    secret: "superDuperSecret",
    keys: ["aaaaa"],
    httpOnly: false
  })
);
app.get("/gimme-a-cookie", (req, res) => {
  req.session.foo = "bar";
  res.redirect("/api/foo");
});

app.get("/api/foo", (req, res) => {
  const foo = req.session.foo;
  console.log(foo);
  res.send("foo: " + foo);
});

// logging accesses with morgan: http://expressjs.com/en/resources/middleware/morgan.html
// reminder to occasionally clear this to not take up much space, command "> access.log" in terminal.
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a"
});
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Middleware to show favicon: http://expressjs.com/en/resources/middleware/serve-favicon.html
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
//app.use(express.static("views"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  //send the user to login cuz thats just easier I don't want to deal with putting the redirect if cookie exist code in a function.
  // js is weird man aaaaa
  //ok nvm im just copying and pasting it, yay for bad code
  console.log("from /index: " + request.session.u);
  if (request.session.u != null) {
    /*&& (request.session.u != undefined))*/ console.log(
      "should be sending index from / "
    );
    response.sendFile(__dirname + "/views/index.html");
  } else {
    console.log("Should be sending login from /");
    response.redirect("/login");
  }
});
app.get("/index", (request, response) => {
  //if the user is not logged in send them to registration. registration and login both need links to eachother.
  console.log("from /index: " + request.session.u);
  if (request.session.u != null) {
    /*&& (request.session.u != undefined))*/ console.log(
      "should be sending index from /index"
    );
    response.sendFile(__dirname + "/views/index.html");
  } else {
    console.log("Should be sending login from /index");
    response.redirect("/login");
  }
});
app.get("/login", (request, response) => {
  // TODO: if the user is logged in send them home.
  console.log("Sent login");
  response.sendFile(__dirname + "/views/login.html");
});
app.get("/register", (request, response) => {
  // TODO: if the user is already logged in this should probably just send them back home.
  response.sendFile(__dirname + "/views/register.html");
});
app.get("/logout", (request, response) => {
  // log the user out, make the cookie fields null, then send to index
  //request = updateCookie(request, null);
  request.session.u = null;
  response.redirect("/login");
});

client.connect(err => {
  collection = client.db("datatest").collection("data");
  // perform actions on the collection object

  //client.close();
});

app.post("/register", bodyParser.json(), function(request, response) {
  console.log(request.body);
  let username = request.body.username,
    password = request.body.password,
    usernameExistsQuery = { user: username };
  //check database to see if any users exist with this username
  collection.find(usernameExistsQuery).toArray(function(err, data) {
    //https://stackoverflow.com/questions/45118957/node-js-mongodb-collection-find-toarray-returns-nothing
    if (err) {
      // Reject the Promise with an error
      throw err;
    } else if (data.length >= 1) {
      //the username already exists, do something with that information
      // send a message to the client saying the username already exists, client should clear fields and allow the user to retry
      response.json({ result: "exists" });
      console.log("That username already exists!");
    } else {
      // user doesn't exist, create them.
      // create a database document with fields for: username, password, and an array of entries
      // format: {'user':username, 'pass':password, 'list':[]} [] is empty array
      // this functions like a promise I think
      collection
        .insertOne({ user: username, pass: password, list: [] })
        .then(
          // set cookie
          //request = updateCookie(request, username)
          (request.session.u = username)
        )
        .then(function() {
          // send a message to the client saying the account was made, client will redirect to main page
          console.log("there should be a new database entry");
          response.json({ result: "success" });
        });
    }
  });
});

app.post("/login", bodyParser.json(), (request, response) => {
  console.log(request.body);
  let username = request.body.username,
    password = request.body.password,
    goodLoginQuery = { user: username, pass: password };
  //check database to see if any users exist with this username/password combo
  collection.find(goodLoginQuery).toArray(function(err, data) {
    //https://stackoverflow.com/questions/45118957/node-js-mongodb-collection-find-toarray-returns-nothing
    if (err) {
      // Reject the Promise with an error
      throw err;
    } else if (data.length === 1) {
      //user logged in sucesfully, send them home
      console.log("username recieved: " + username);
      //request = updateCookie(request, username);
      console.log("from /login: " + request.session.u);
      request.session.u = username;
      console.log("from /login 2: " + request.session.u);
      console.log("should be redirecting to index from login");
      //response.redirect("/index");
      response.json({ result: "pass" });
    } else {
      // user doesn't exist, notify and send an error
      console.log(
        "someone tried to log in to account " + username + "and failed"
      );
      response.json({ result: "fail" });
    }
  });
});

/*function updateCookie(request, username) {
  request.session.u = username;
  console.log("cookie:" + request.session["u"]);
  return request;
}*/

app.post("/add", bodyParser.json(), function(req, res) {
  console.log("add" + req.body);
  let user = req.session.u,
    list = [],
    userQuery = { user: user };
  collection.find(userQuery).toArray(function(err, data) {
    if (err) {
      throw err;
    }
    //the data we found should contain an array
    list = data[0].list;
    list.push(req.body.dream);
    collection.update(userQuery, {
      $set: { list: list }
    });
  });
  res.json({ dream: req.body.dream });
});

app.post("/delete", bodyParser.json(), function(req, res) {
  let user = req.session.u,
    userQuery = { user: user },
    entryText = req.body.dream,
    list = [];
  console.log("rem " + entryText);
  collection.find(userQuery).toArray(function(err, data) {
    if (err) {
      throw err;
    }
    //the data we found should contain an array
    list = data[0].list;
    var index = list.indexOf(entryText);
    if (index >= 0) {
      list.splice(index, 1);
    }
    collection.update(userQuery, {
      $set: { list: list }
    });
  });
  res.json({ dream: req.body.dream });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  let user = request.session.u,
    userQuery = { user: user },
    list = [];
  collection.find(userQuery).toArray(function(err, data) {
    if (err) {
      throw err;
    }
    //the data we found should contain an array
    list = data[0].list;
    console.log(list);
     response.json(list);
  });
});

app.post("/edit", bodyParser.json(), function(req, res) {
  let user = req.session.u,
    userQuery = { user: user },
    oldText = req.body.oldText,
      newText = req.body.newText,
    list = [];
  console.log("ed " + oldText + " to " + newText);
  collection.find(userQuery).toArray(function(err, data) {
    if (err) {
      throw err;
    }
    //the data we found should contain an array
    list = data[0].list;
    var index = list.indexOf(oldText);
    if (index >= 0) {
      list[index] = newText;
    }
    collection.update(userQuery, {
      $set: { list: list }
    });
  });
  res.json({ dream: req.body.dream });
});



