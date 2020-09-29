const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const responseTime = require('response-time')
var timeout = require('connect-timeout')
const path = require('path')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
var passport = require('passport');
var Strategy = require('passport-github').Strategy;

app.use(timeout('5s'))//, {respond: false}))

//Favicon works, shows up in Chrome, but does not seem to show up in edge unless you pin it
app.use(favicon(path.join(__dirname + '/public/image/favicon.png')))
app.use(haltOnTimedout)

function haltOnTimedout (req, res, next) {
  //console.log("Checking if timed out")
  if (!req.timedout) 
    next()
  else {
    console.log("You timed out!")
    res.status(503).send('Service unavailable. Please retry.');
  }
}

/*
app.use(responseTime(function(request, response, time) {
  console.log(time)
}))*/

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const uri = `mongodb+srv://nchintada:${process.env.DBPASSWORD}@cluster0.impei.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null

client.connect(err => {
  collection = client.db("todoDB").collection("userinfo");
  //console.log(collection)
  // perform actions on the collection object
  //client.close();
}); 

app.use(express.static('public'))

/*
passport.use(new Strategy({
    clientID: process.env['GITHUB_CLIENT_ID'],
    clientSecret: process.env['GITHUB_CLIENT_SECRET'],
    callbackURL: '/return'//"http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
*/

app.use(cookieParser())
app.use(haltOnTimedout)
/*
app.use(cookieSession({
  name: 'session',
  keys: [],
  
  maxAge: 24 * 60 * 60 * 1000 //Lasts for 24 hours
}))*/

const userinfo = []

var login = []

app.use(bodyParser.json())
app.use(haltOnTimedout)

app.get('/', (request, response) => {
  response.clearCookie('Current User:')
  response.sendFile(path.join(__dirname + '/public/index.html'))
})

app.post('/signin', bodyParser.json(), (request, response) => {
  //console.log(__dirname + '/public/newpage.html')
  console.log(request.body)
  login.push(request.body.user)
  var user = { user: request.body.user, password: request.body.password }
  if(request.body.check == true) {
    collection.insertOne(user)
    .then(dbresponse => {
      console.log(dbresponse)
    })
    response.cookie('Current User:', request.body.user)
    response.json({value: true})
  }
  else {
    collection.findOne({user: request.body.user })
    .then(docs => {
      if(docs != null) {
      if(docs.password == request.body.password ) {
        response.cookie('Current User:', request.body.user)
        response.json({value: true})
      }
      else {
        console.log("Wrong Password! Try again")
        response.json({value: false})
      }
      }
      else{
        console.log("User doesn't exist")
        response.json({value: null})
      }
    })
  }
})

function openNewPage(response) {
  response.sendFile(path.join(__dirname + '/public/newpage.html'))
}

app.get('/signin', (request, response) => {
  response.sendFile(__dirname + '/public/newpage.html')
})

app.get('/userpage', bodyParser.json(), (request, response) => {
  //response.send({username: login[login.length-1], })
  var user = request.cookies['Current User:']
  console.log(user)
  response.json(user)
})

app.get('/tableData', bodyParser.json(), (request, response) => {
  collection.find({username: request.cookies['Current User:']}).toArray()
    .then(docs => {
    response.json(docs)
  })
  app.use(responseTime(function(request, response, time) {
    //Gives us an idea of how long it takes to load the table
    console.log("Table loading: " + time)
  }))
  app.use(haltOnTimedout)
})

// User field changes

app.post('/add', bodyParser.json(), (request, response) => {
  console.log(request.body)
  userinfo.push(request.body)
  collection.insertOne(request.body)
  .then(dbresponse => {
    //console.log(dbresponse)
    response.json(dbresponse.ops[0])
  })
})

app.post('/edit', bodyParser.json(), (request, response, time) => {
  console.log(request.body)
  collection
    .updateOne({ _id:mongodb.ObjectID( request.body._id ) },
      { $set:{ task:request.body.task, 
              duedate:request.body.duedate, 
              priority:request.body.priority }
      }
    )
    .then( result => {
      //console.log(result)
      response.json( result ) 
  })
})

app.post('/delete', bodyParser.json(), (request, response) => {
  console.log("Delete: ", request.body)
  collection
    .deleteOne({ _id:mongodb.ObjectID( request.body.id ) })
    .then( result => {
      response.json( result ) 
  })
})

app.get('/signout', bodyParser.json(), (request, response) => {
  response.clearCookie('Current User:')
  response.send("We're signed out")
})

const listener = app.listen(process.env.PORT, () => {
  console.log("The application is listening on port " + listener.address().port)
})