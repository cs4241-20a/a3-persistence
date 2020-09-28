// ---------------------------------------------------------------------
// External modules and config variables
// ---------------------------------------------------------------------
const express = require("express"),
  app = express(),
  port = 3000,
  // db related
  MongoClient = require("mongodb").MongoClient,
  Cache = require("persistent-cache"),
  cache = Cache({ base: "cache" }),
  chokidar = require("chokidar"),
  sanitizer = require("sanitizer"),
  tableify = require("tableify"),
  // login related
  LocalStrategy = require("passport-local"),
  bcrypt = require("bcryptjs"),
  Q = require("q");

// express modules
const morgan = require("morgan"),
  compression = require("compression"),
  helmet = require("helmet"),
  bodyParser = require("body-parser"),
  { expressYupMiddleware } = require("express-yup-middleware"),
  // login related
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  methodOverride = require("method-override"),
  exphbs = require("express-handlebars"),
  passport = require("passport");

// ---------------------------------------------------------------------
// My modules
// ---------------------------------------------------------------------
// module to automatically compile Sass on file changes
require("./compileSass.js")(cache);
chokidar.watch("./sass").on("all", (event, path) => {
  compileSass();
});
// import all schemas
require("./schemas.js")();

// ---------------------------------------------------------------------
// Connect to MongoDb database
// ---------------------------------------------------------------------
const uri =
  "mongodb+srv://dbUser:RSTJeQutld5mJWrd@cluster0.vqf7c.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const clientConn = client.connect().catch((err) => {});
// remember to call client.close
function getCollection() {
  return new Promise((resolve, reject) => {
    const collection = client.db("test").collection("posts");
    resolve(collection);
  });
}
// remember to call client.close
function getCollectionUsers() {
  return new Promise((resolve, reject) => {
    const collection = client.db("test").collection("users");
    resolve(collection);
  });
}

// ---------------------------------------------------------------------
// Post setup / helper functions
// ---------------------------------------------------------------------

// persistent ID counter for post IDs
// if running multiple servers, rewrite this to use redis / mongodb
cache.get("idCounter", (err, val) => {
  if (err) {
    console.log(err);
  }
  if (!val) {
    cache.put("idCounter", 1, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});

function getTable(req, filter) {
  return new Promise(function (resolve, reject) {
    getCollection().then((collection) => {
      collection.find().toArray(function (err, posts) {
        if (err) {
          return reject(err);
        }
        // transform _id.id to _id
        posts = posts.map((x) => {
          x._id = x.id;
          delete x.id;
          return x;
        });
        if (filter) {
          posts = posts.filter((x) => {
            return x.username === req.user.username;
          });
        }
        return resolve(posts);
      });
    });
  });
}

function getPostsRequestResponse(req, filter) {
  return new Promise((resolve, reject) => {
    getTable(req, filter).then(
      function (posts) {
        posts_html = tableify(posts);
        msg = JSON.stringify({ posts: { html: posts_html, json: posts } });
        // console.log(msg);
        resolve(msg);
      },
      function (err) {
        reject(err);
      }
    );
  });
}

// ---------------------------------------------------------------------
// Login stuff
// ---------------------------------------------------------------------

localReg = function (username, password) {
  var deferred = Q.defer();
  console.log("Creating user!!!");
  getCollectionUsers().then((collection) => {
    collection.findOne({ username: username }).then(function (result) {
      if (null != result) {
        console.log("USERNAME ALREADY EXISTS:", result.username);
        deferred.resolve(false); // username exists
      } else {
        var hash = bcrypt.hashSync(password, 8);
        var user = {
          username: username,
          password: hash,
          avatar:
            "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG",
        };

        console.log("CREATING USER:", username);

        collection.insertOne(user).then(function () {
          deferred.resolve(user);
        });
      }
    });
  });

  return deferred.promise;
};

localAuth = function (username, password) {
  var deferred = Q.defer();
  getCollectionUsers().then((collection) => {
    collection.findOne({ username: username }).then(function (result) {
      if (null == result) {
        console.log("USERNAME NOT FOUND:", username);
        deferred.resolve(false);
      } else {
        var hash = result.password;
        console.log("FOUND USER: " + result.username);
        if (bcrypt.compareSync(password, hash)) {
          deferred.resolve(result);
        } else {
          console.log("AUTHENTICATION FAILED");
          deferred.resolve(false);
        }
      }
    });
  });
  return deferred.promise;
};

passport.use(
  "local-signin",
  new LocalStrategy(
    { passReqToCallback: true }, //allows us to pass back the request to the callback
    function (req, username, password, done) {
      localAuth(username, password)
        .then(function (user) {
          if (user) {
            console.log("LOGGED IN AS: " + user.username);
            req.session.success =
              "You are successfully logged in " + user.username + "!";
            done(null, user);
          }
          if (!user) {
            console.log("COULD NOT LOG IN");
            req.session.error = "Could not log user in. Please try again."; //inform user could not log them in
            done(null, user);
          }
        })
        .fail(function (err) {
          console.log(err.body);
        });
    }
  )
);
passport.use(
  "local-signup",
  new LocalStrategy(
    { passReqToCallback: true }, //allows us to pass back the request to the callback
    function (req, username, password, done) {
      localReg(username, password)
        .then(function (user) {
          if (user) {
            console.log("REGISTERED: " + user.username);
            req.session.success =
              "You are successfully registered and logged in " +
              user.username +
              "!";
            done(null, user);
          }
          if (!user) {
            console.log("COULD NOT REGISTER");
            req.session.error =
              "That username is already in use, please try a different one."; //inform user could not log them in
            done(null, user);
          }
        })
        .fail(function (err) {
          console.log(err.body);
        });
    }
  )
);
passport.serializeUser(function (user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// ---------------------------------------------------------------------
// Express stuff
// ---------------------------------------------------------------------

app.use(morgan("combined"));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(
  session({ secret: "supernova", saveUninitialized: true, resave: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

var hbs = exphbs.create({
  defaultLayout: "index",
  layoutsDir: "./public",
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "public");

app.post(
  "/local-reg",
  expressYupMiddleware({ schemaValidator: registerSchema })
);
app.post(
  "/local-reg",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.post(
  "/login",
  passport.authenticate("local-signin", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/logout", function (req, res) {
  if (req.user) {
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username);
  }
  req.logout();
  res.redirect("/");
  req.session.notice = "You have successfully been logged out !";
});

app.get("/", function (req, res) {
  res.render("index", { user: req.user });
});

// ---------------------------------------------------------------------
// Express get and post
// ---------------------------------------------------------------------

app.use(express.static("public"));

app.get("/posts", (req, res) => {
  if (!req.isAuthenticated()) {
    req.session.error = "Please sign in!";
    res.redirect("/");
    return;
  }
  getPostsRequestResponse(req, false)
    .then((msg) => {
      res.end(msg);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/userposts", (req, res) => {
  if (!req.isAuthenticated()) {
    req.session.error = "Please sign in!";
    res.redirect("/");
    return;
  }
  getPostsRequestResponse(req, true)
    .then((msg) => {
      res.end(msg);
    })
    .catch((err) => {
      console.error(err);
    });
});

function postByUser(id, user) {
  return new Promise((resolve, reject) => {
    let uname = user.username;
    id = parseInt(id);
    getCollection().then((collection) => {
      collection.findOne({ username: uname, id: id }).then(function (result) {
        if (null == result) {
          console.log("POST NOT FOUND:", uname);
          resolve(false);
        } else {
          console.log("POST FOUND:", uname);
          resolve(true);
        }
      });
    });
  });
}

app.post("/submit", expressYupMiddleware({ schemaValidator: commentSchema }));
app.post("/submit", (req, res) => {
  if (!req.isAuthenticated()) {
    req.session.error = "Please sign in!";
    res.redirect("/");
    console.log("arstarstart");
    console.log("arstarstart");
    console.log("arstarstart");
    return;
  }
  return new Promise((resolve, reject) => {
    let data = req.body;

    // input sanitization
    Object.keys(data).forEach((key) => {
      data[key] = sanitizer.sanitize(data[key]);
    });
    Date.prototype.yyyymmdd = function () {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
      return [
        this.getFullYear(),
        "/",
        (mm > 9 ? "" : "0") + mm,
        "/",
        (dd > 9 ? "" : "0") + dd,
      ].join("");
    };
    data.date = String(new Date().yyyymmdd());
    data.words = data.message.split(" ").length;
    cache.get("idCounter", (err, val) => {
      cache.put("idCounter", val + 1, (err) => {
        if (err) {
          console.log(err);
        }
      });
      if (err) {
        console.log(err);
      }
      data.id = val;
      getCollection().then((collection) => {
        collection.insertOne(data, { w: 1 }, function (err, result) {
          if (err) {
            return reject(err);
          }
          getPostsRequestResponse()
            .then((msg) => {
              res.writeHead(200, "OK", {
                "Content-Type": "text/plain",
              });
              res.end(msg);
              resolve();
            })
            .catch((err) => {
              console.error(err);
            });
          resolve();
        });
      });
    });
  }).catch((err) => {
    console.log(err);
    reject(err);
  });
});

app.post("/delete", expressYupMiddleware({ schemaValidator: deleteSchema }));
app.post("/delete", (req, res) => {
  if (!req.isAuthenticated()) {
    req.session.error = "Please sign in!";
    res.redirect("/");
    return;
  }

  return new Promise((resolve, reject) => {
    let data = req.body;
    const myQuery = { id: data.id };

    postByUser(data.id, req.user)
      .then((postByUser) => {
        if (!postByUser) {
          res.end();
          return resolve();
        }

        getCollection()
          .then((collection) => {
            collection.removeOne(myQuery, { w: 1 }, function (err, result) {
              if (err) {
                return reject(err);
              }
              getPostsRequestResponse()
                .then((msg) => {
                  res.writeHead(200, "OK", {
                    "Content-Type": "text/plain",
                  });
                  res.end(msg);
                  resolve();
                })
                .catch((err) => {
                  console.error(err);
                });
              resolve();
            });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
});

app.post("/edit", expressYupMiddleware({ schemaValidator: editSchema }));
app.post("/edit", (req, res) => {
  if (!req.isAuthenticated()) {
    req.session.error = "Please sign in!";
    res.redirect("/");
    return;
  }
  return new Promise((resolve, reject) => {
    let data = req.body;
    // input sanitization
    Object.keys(data).forEach((key) => {
      data[key] = sanitizer.sanitize(data[key]);
    });
    const myQuery = { id: parseInt(data.id) };
    updated = {
      $set: {
        title: data.title,
        message: data.message,
        isSpoiler: data.isSpoiler,
        isBug: data.isBug,
        isFluff: data.isFluff,
      },
    };

    postByUser(data.id, req.user)
      .then((postByUser) => {
        if (!postByUser) {
          res.end();
          return resolve();
        }

        getCollection().then((collection) => {
          collection.updateOne(myQuery, updated, function (err, result) {
            if (err) {
              return reject(err);
            }

            getPostsRequestResponse()
              .then((msg) => {
                res.writeHead(200, "OK", {
                  "Content-Type": "text/plain",
                });
                res.end(msg);
                resolve();
              })
              .catch((err) => {
                console.error(err);
              });
            resolve();
          });
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  }).catch((err) => {
    console.log(err);
    reject(err);
  });
});

app.listen(process.env.PORT || port);
