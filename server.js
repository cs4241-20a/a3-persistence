const express = require('express')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const helmet = require("helmet")
require('dotenv').config()


// DB config
const db = process.env.MONGO_URI

// DB Connect
mongoose.connect(db, { 
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex: true
})
.then(() => console.log('MongoDB Connected.'))
.catch(err => console.log(err))

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

// Passport config
require('./config/passportLocal')(passport)
require('./config/passportGithub')(passport)

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)

app.use(passport.initialize())
app.use(passport.session())

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Flash
app.use(flash())

// Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

app.use((req, res, next) => {
    res.locals.successmsg = req.flash('successmsg')
    res.locals.errormsg = req.flash('errormsg')
    next()
})


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})