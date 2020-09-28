// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

//passport config
require('./config/passport')(passport)

//DB config
const db = require('./config/keys.js').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//bodyparser
app.use(express.urlencoded({ extended: true}))

//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

//connect flash
app.use(flash())

//global vars
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next();
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/groceries', require('./routes/groceries'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = `
mongodb+srv://UserA3:${process.env.DBPASSWORD}@a3-cluster.gsvjm.azure.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true }, {useUnifiedTopology: true});

let collection = null;
client.connect(err => {
  collection = client.db("datatest").collection("test")
});

app.post("/add", bodyParser.json(), function(request, response) {
  console.log('body:', request.body);
  collection.insertOne( request.body ).then( dbresponse => {
    console.log( dbresponse )
    response.json(dbresponse.ops[0])
  })
})

app.post("/delete", bodyParser.json(), function(request, response){
  console.log('delete body:', request.body);
    collection
    .deleteOne({ _id:mongodb.ObjectID( request.body.id ) })
    .then( result => response.json( result ) )
})

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectID( req.body._id ) },
      { $set:{ item:req.body.item, price: req.body.price, dept: req.body.dept } }
    )
    .then( result => res.json( result ) )
})