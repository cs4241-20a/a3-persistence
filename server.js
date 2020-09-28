// JavaScript source code
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const favicon = require('favicon');
const path = require('path');
const responseTime = require('response-time');
const cookieSession = require('cookie-session')
require('dotenv').config()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(responseTime((request, response, Time) => console.log(request.method, request.url, time + 'ms')))
app.use(morgan('tiny'));


//connectng to mongodb
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://dbuser:${process.env.DBPASSWORD}@cluster0.rtnhc.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const collection = null;
client.connect(err => {
    collection = client.db("bilbo").collection("swaggins");
    // perform actions on the collection object
});

const client_id = process.env.GITHUB_CLIENT_ID
const cliend_secret = process.env.GITHUB_CLIENT_SECRET
const cookie_secret = process.env.COOKIE_SECRET

app.use(cookieSession({
	secret: cookie_secret;
}));

pp.get( '/', (request, response) => {
  if(request.session.githubid) {
    response.sendFile( __dirname + '/public/inv.html' ) 
  } else {
    response.sendFile( __dirname + '/public/login.html' )
  }

  app.get('/geturl', (request, response) => {
  const path = request.protocol + '://' + request.get('host');
  const url = 'https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${path}/login/github/callback';
  response.json(url);

async function getAccessToken(code ) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      client_id,
      client_secret,
      code
    })
  })
  const data = await response.text()
  
  const params = new URLSearchParams(data);
  return params.get('access_token');
}

  async function getGHUser(accessToken) {
  const request = await fetch('https://api.github.com/user', {
    headers: { Authorization: `bearer ${accessToken}`}
  })
  const data = await req.json();
  return data;
}

app.get('/login/github/callback', async (request, response) => {
  const atoken = await getAccessToken(request.query.code, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
  const GHData = await getGHUser(atoken);
  
  if(GHData) {
    //console.log("GHData.id: "+GHData.id)
    request.session.githubid = GHData.id;
    request.session.token = GHData.token;
    response.redirect("/")
  } else {
    console.log('Error while logging in');
    response.redirect("/login.html")
  }
})

/*

app.post("/submit", bodyParser.json(), function(request, response) => {
let data = request.body;

collection.insertOne(data, function(err, obj){
if(err){
	response.sendStatus(500);
}
else{
	response.json(data);
}
})
})

app.post("/delete", bodyParser.json(), function(request, response) => {
	collection.deleteOne({_id: new mongodb.ObjectID(request.body.id)}, function(err, obj) {
	if(err){
		response.sendStatus(500);
	}
	else{
		response.sendStatus(200);
	}
	})
})

app.post("/edit", bodyParser.json(), function(request, response) => {
	let keys = Object.keys(request.body);
	let temp = {};
	for(let i = 0; i<keys.length; i++){
		const index = keys[i];
		if( index != "id"){
			temp[index] = request.body[index];
		}
	}

	collection.updateOne({_id: new mongodb.ObjectID(request.body.ID)}, function(err, obj) {
		if(err){
			response.sendStatus(500);
		}
		else{
			response.sendStatus(200);
		}
	})
})

app.post("/appdata", bodyParser.json(), function(request, response){
	collection.find({ username: request.body.username}).toArray().then(result => response.json(result))
})
*/