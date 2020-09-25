const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan"); // 1
const exphbs = require("express-handlebars"); // 2
const app = express();
const session = require("express-session"); // 3
const passport = require("passport");
const User = require(__dirname + "/models/User.js");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // 5
var errorhandler = require('errorhandler')
var notifier = require('node-notifier')

app.use(express.urlencoded( {extended: false} ));
app.use(express.json());

app.use(errorhandler({ log: errorNotification }))

// Error handling (comment out for prod)
function errorNotification (err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url

  notifier.notify({
    title: title,
    message: str
  })
}

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// morgan logging
app.use(morgan("dev"));

// handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

connectDB();

// load config
dotenv.config({ path: "./config/config.env" });

// passport config
require("./config/passport.js")(passport);

const PORT = process.env.PORT;


// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/runs', require('./routes/runs'));
app.use('/users', require('./routes/users'));

// listen for requests :)
const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
