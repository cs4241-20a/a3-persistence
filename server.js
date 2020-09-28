const express = require('express'),
      fetch = require('node-fetch'),
      bodyparser = require('body-parser'),
      cookie = require('cookie-session'),
      mongodb = require('mongodb'),
      app = express()

const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET
const cookie_secret = process.env.COOKIE_SECRET
const dbpass = process.env.DBPASSWORD

var responseTime = require('response-time')
var StatsD = require('node-statsd')
var favicon = require('serve-favicon')
var stats = new StatsD()
var path = require('path')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

stats.socket.on('error', function (error) {
  console.error(error.stack)
})

app.use(responseTime())

app.use(
  cookie({
    secret: cookie_secret
  })
);
 
app.use(bodyparser.json())

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://liumxiris:${dbpass}@cluster0.lgqqz.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

app.use(responseTime(function (req, res, time) {
  console.log(`${req.method} ${req.url} ${time}`);
}))

//handling the get request
app.get('/', function(request, response) {
  console.log('GET: ',request.url)
  if(request.session.githubId){
    response.sendFile( __dirname + '/public/index.html' )
  }else{
    response.sendFile(__dirname + '/public/login.html') 
  }
})


app.get('/githubid',function(request,response){
  if(request.session.githubId){
    response.send(JSON.stringify(request.session.githubId))
    console.log("sent githubId:" + request.session.githubId)
  }else{
    response.send("User is not authorzied")
  }
})

//User login
app.get('/login/github',(request,response) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri = http://localhost:3000/login/github/callback`
  response.redirect(url)
})

app.use(express.static('public'))

async function getAccessToken(code){
  const token_url = 'https://github.com/login/oauth/access_token'
  const res = await fetch(token_url,{
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
        client_id,
        client_secret,
        code
    })
  })
  const data = await res.text()
  const params = new URLSearchParams(data)
  return params.get('access_token')
}

async function getGithubUser(access_token){
  const req = await fetch('https://api.github.com/user',{
    headers:{
      Authorization: `bearer ${access_token}`
    }
  })
  const data = await req.json()
  return data
}

app.get('/login/github/callback',async (request,response) => {
  console.log('GET: ',request.url)
  const code = request.query.code
  const token = await getAccessToken(code)
  const githubdata = await getGithubUser(token)
  //check if user is authorized
  if(githubdata){
    request.session.githubId = githubdata.id
    request.session.token = token
    response.redirect('/')
  }else{
    response.send("Error: not authorized")
  }
})

app.post('/logout',(request,response) =>{
  request.session = null
  response.clearCookie()
  response.redirect('/login.html')
  console.log("log out in server")
})


const listener = app.listen( process.env.PORT || 3000, function() {
  console.log( 'Your app is listening on port ' + listener.address().port )
})

let collection = null
client.connect(err => {
  collection = client.db("datapass").collection("pass");
});


app.get('/update',function(request,response){
  //var dataString = []
  collection.find({
    "githubid":request.session.githubId
  }).toArray()
  .then(dbresponse=>{
    response.json(dbresponse)
  })
})

app.post('/add',bodyparser.json(),function(request,response){ 
  collection.insertOne(request.body)
    .then(dbresponse =>{
      response.json(dbresponse.ops[0])
    })
})

app.post('/delete',bodyparser.json(),function(request,response){
  collection
    .deleteOne({ _id:mongodb.ObjectID( request.body.id ) })
    .then( result => response.json( result ) )
})

app.post( '/modify', (request,response) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectID( request.body.id ) },
      { $set:
        { 
          name:request.body.name,
          major:request.body.major,
          collegeyear:request.body.collegeyear,
          number:request.body.number,
          password:request.body.password,
        } 
      }
    )
    .then( result => response.json( result ) )
})