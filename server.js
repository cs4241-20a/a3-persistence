const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('flash')
const session = require('express-session')
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

app.use( express.static( 'public' ) )

// Passport config
require('./config/passportLocal')(passport)
require('./config/passportGithub')(passport)

// Bodyparser
app.use(bodyParser.urlencoded({
    extended: true
  }))
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

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})