const { Store } = require("express-session");

require("dotenv").config();
const express = require("express"),
  serveStatic = require("serve-static"), //1
  path = require("path"),
  assert = require("assert"),
  serveFavicon = require("serve-favicon"), //2
  app = express(),
  ObjectId = require("mongodb").ObjectId,
  MongoClient = require("mongodb").MongoClient,
  { spawn } = require("child_process"),
  session = require("express-session"), //3
  bodyParser = require("body-parser"), //4
  passport = require("passport"), //5
  fs = require('fs'),
  multer = require("multer"), //6
  storage = multer.diskStorage({
    destination: function(req, file, done){
      done(null, 'public/temp/')
    },
    filename: function(req, file, done){
      console.log(file.originalname)
      done(null, Date.now() + path.extname(file.originalname))
    }
  })
  upload = multer({storage: storage})
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcrypt"),
  mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@a3.xvhzl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  header = { "Content-Type": "application/json" };

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();
app.use(bodyParser.json({'limit': '50mb'}));

const userReg = (username, password, email) => {
  return new Promise((resolve, reject) => {
    console.log(username, password, email);
    if (!username || !password || !email) {
      resolve({
        error: "Missing Fields",
      });
    }
    const collection = client
      .db(process.env.DB_NAME)
      .collection(process.env.DB_COLLECTION);
    collection
      .findOne({ username: username })
      .then((result) => {
        if (!!result) {
          resolve({
            error: "User Exists",
          });
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              console.log(err);
              reject({
                error: "Salt Error",
              });
            } else {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                  console.log(err);
                  reject({
                    error: "Encryption Error",
                  });
                } else {
                  const user = {
                    username,
                    email,
                    password: hash,
                  };

                  collection
                    .insertOne(user)
                    .then((result) => {
                      console.log("Insert");
                      console.log(result.ops[0]);
                      resolve(result.ops[0]);
                    })
                    .catch((err) => {
                      console.log(err);
                      reject({
                        error: "Could Not Add User",
                      });
                    });
                }
              });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        reject({
          error: "Issue with MongoDB",
          systemError: err,
        });
      });
  });
};

const userLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    if (!username || !password) {
      resolve({
        error: "Missing Fields",
      });
    } else {
      const collection = client
        .db(process.env.DB_NAME)
        .collection(process.env.DB_COLLECTION);
      collection
        .findOne({ username: username })
        .then((result) => {
          if (!result) {
            resolve({
              error: "No User Exists",
            });
          } else {
            bcrypt
              .compare(password, result.password)
              .then((loggedIn) => {
                resolve(result);
              })
              .catch((err) => {
                resolve({
                  error: "Incorrect Password",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          reject({
            error: "Issue with the DB Query",
          });
        });
    }
  });
};
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((userId, done) => {
  client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION)
    .findOne({ _id: ObjectId(userId) })
    .then((user) => {
      if (!!user) {
        done(null, user);
      } else {
        done({ error: "User Not Found" }, null);
      }
    })
    .catch((err) => {
      console.log(err);
      done(err, false);
    });
});

passport.use(
  "local-login",
  new LocalStrategy({ passReqToCallback: true, session: true }, function (
    req,
    username,
    password,
    done
  ) {
    userLogin(username, password)
      .then((result) => {
        if (result.error) {
          done(
            {
              error: result.error,
            },
            null
          );
        } else {
          done(null, result);
        }
      })
      .catch((err) => {
        console.log("DB Issue");
        console.log(err);
        done(
          {
            error: "Issue with Mongo",
            systemError: err.error,
          },
          null
        );
      });
  })
);

passport.use(
  "local-registration",
  new LocalStrategy({ passReqToCallback: true, session: true }, function (
    req,
    username,
    password,
    done
  ) {
    userReg(username, password, req.body.email)
      .then((result) => {
        if (result.error) {
          done(
            {
              error: result.error,
            },
            null
          );
        } else {
          done(null, result);
        }
      })
      .catch((err) => {
        console.log(err);
        done(
          {
            error: "Server Issue",
            systemError: err,
          },
          null
        );
      });
  })
);

app.use(serveFavicon(path.join(__dirname, "public/statics", "favicon.ico")));

app.post("/register", (req, res, next) => {
  if (!req.body.password || !req.body.username || !req.body.email) {
    res.writeHead(400, { header });
    res.end(
      JSON.stringify({
        errorMessage: "Invalid Registration",
        error: "Missing Fields",
        errorCode: 400,
      })
    );
  } else {
    passport.authenticate(
      "local-registration",
      {
        session: true,
      },
      function (err, user, info) {
        if (err) {
          if (err.systemError) {
            res.writeHead(500, { header });
            res.end(
              JSON.stringify({
                errorMessage: "There was an issue with the server",
                error: err.systemError,
                errorCode: 500,
              })
            );
          } else {
            res.writeHead(400, { header });
            res.end(
              JSON.stringify({
                errorMessage: "Invalid Registration",
                error: err.error,
                errorCode: 400,
              })
            );
          }
        } else {
          req.login(user, function (err) {
            if (err) {
              console.log(err);
              res.writeHead(500);
              res.end(
                JSON.stringify({
                  errorMessage: "Session Issue",
                  error: err,
                  errorCode: 500,
                })
              );
            }
            res.writeHead(200);
            res.end(JSON.stringify({ Success: "YeetLogin" }));
          });
        }
      }
    )(req, res, next);
  }
});

app.get("/user", (req, res) => {
  if(req.isAuthenticated()){
    res.writeHead(200, { header })
    res.end(JSON.stringify(req.user))
  }
  else {
    res.writeHead(402, "Unauthorized")
    res.end(JSON.stringify({
      error: "You are not logged in"
    }))
  }
})

app.post("/deleteSong", (req, res) => {
  if(req.isAuthenticated()){
    res.writeHead(200, { header })
    res.end(JSON.stringify(req.user))
  }
  else {
    res.writeHead(402, "Unauthorized")
    res.end(JSON.stringify({
      error: "You are not logged in"
    }))
  }
})

app.get('/authStatus', (req, res) => {
    res.writeHead(200, {
        header
    })
    res.end(JSON.stringify({
        authStatus: req.isAuthenticated()
    }))
})

app.post("/logout", (req, res) => {
  req.logout();
  res.writeHead(200);
  res.end(JSON.stringify({ Success: "Logout" }));
});

app.post("/login", function (req, res, next) {
  if (!req.body.password || !req.body.username) {
    res.writeHead(400, { header });
    res.end(
      JSON.stringify({
        errorMessage: "Invalid Registration",
        error: "Missing Fields",
        errorCode: 400,
      })
    );
  } else {
    passport.authenticate(
      "local-login",
      {
        session: true,
      },
      function (err, user, info) {
        if (err) {
          if (err.systemError) {
            res.writeHead(500, { header });
            res.end(
              JSON.stringify({
                errorMessage: "There was an issue with the server",
                error: err.systemError,
                errorCode: 500,
              })
            );
          } else {
            res.writeHead(400, { header });
            res.end(
              JSON.stringify({
                errorMessage: "Invalid Login",
                error: err.error,
                errorCode: 400,
              })
            );
          }
        } else {
          req.login(user, function (err) {
            if (err) {
              console.log(err);
              res.writeHead(500);
              res.end(
                JSON.stringify({
                  errorMessage: "Session Issue",
                  error: err,
                  errorCode: 500,
                })
              );
            }
            // res.redirect("/index.html")
            res.end(JSON.stringify({ Success: "YeetLogin" }));
          });
        }
      }
    )(req, res, next);
  }
});

app.post("/uploadXML", upload.single('xmlFile'), (req, res) => {
  console.log(req.file.path)
  // const collection = client
  // .db(process.env.DB_NAME)
  // .collection(process.env.DB_COLLECTION)
  // const agg = [
  //   {
  //     '$addFields': {
  //       'songs': []
  //     }
  //   }
  // ];
  // collection.aggregate(agg, (cmdErr, result) => {
  //   console.log(result)
  //   console.log(cmdErr)
  //   assert.strictEqual(null, cmdErr);
  // });
  parseXML(req.file.path).then((result) => {
    fs.unlink(req.file.path, (err) => {
      console.log(err)
      if(err){
        res.writeHead(500)
        res.end(JSON.stringify({
          error: err
        }))
      }
      else {
        console.log(req.user)
        if(req.user){
          const collection = client
          .db(process.env.DB_NAME)
          .collection(process.env.DB_COLLECTION);

          collection.updateOne({ _id: ObjectId(userId) }, {
            $push: {
              songs: result
            }
          }).then((success) => {
            console.log(success)
            res.writeHead(200)
            res.end(JSON.stringify({
           abcString: result
        }))
          })
        }
      }
    })
    
  })
  .catch((err) => {
    fs.unlink(req.file.path, (error) => {
      if(error){
        console.log(error)
      }
      res.writeHead(500)
      res.end(JSON.stringify({
        error: err
      }))
    })
  })
  // .catch((err) => {
  //   console.log("err found")
  //   fs.unlink(req.file.path).then((success) => {
  //     res.writeHead(500)
  //     res.end(JSON.stringify({
  //       error: err
  //     }))
  //   }).catch((err) => {
  //     res.writeHead(500)
  //     res.end(JSON.stringify({error: err}))
  //   })
  // })
})
// Running a python script in the console

const parseXML = (filePath) => {
  let xmlParseResult = '';
  return new Promise((resolve) => {
    errres = '';
    const python = spawn('python3', ['./lib/xml2abc.py', filePath])
    python.stdout.on('data', function(data) {
      console.log("success")
        xmlParseResult += data.toString()
    })
    python.stderr.on('data', function(data) {
      errres += data
    })
    python.on('close', (code) => {
      const final = xmlParseResult.trim()
        resolve(final)
    })
  })
}

app.use(
    serveStatic(path.join(__dirname, "public/statics"), {
      index: "index.html",
      extensions: ["html"],
    })
);


app.listen(3000);
//XML upload => python run local => abc string => abcjs
//In abcjs call synth.getMidiFile(abcstring, {midiOutputType = 'binary'})
//Load this into tonejs with const midi = new Midi(midiData)


//SECRETS TO PASSPORT
//Check for proxy
//Session usage is weird
//If you implement a custon callback on an authenticate, you need to call req.login()