const express = require('express');
const githubAPI = require('github-oauth-express');
const axios = require('axios')
const MongoClient = require('mongodb').MongoClient;
const app = express();

const mongouri = 'mongodb+srv://a3-server:a3-webware@cluster0.nxdrv.azure.mongodb.net/<dbname>?retryWrites=true&w=majority'
const databaseName = 'users'
const clientID = '550b0bf64df6675c7bbb';
const clientSecret = 'd0fb64b9da9c8e06726af688aaeabdbc39646f5a';
const port = 3000;



MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
  if (error) {
    return console.log("Connection failed for some reason");
  }
  console.log("Connection established - All well");
});

app.use(express.static("public"));

app.get('/githubUserName', (req, res) => {
	const accessToken = req.query.access_token;
	axios({
		method: 'GET', 
		url: 'http://api.github.com/user',
		headers: {
			Authorization: 'token ' + accessToken
		}
	})
	.then(response => res.send(response.data))
	// .then(response => response.json())
	.catch(err => console.log(err));
})

app.get('/auth/github/callback/', (req, res) => {
  const requestToken = req.query.code;
  axios({
    method: 'POST',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
         accept: 'application/json'
    }
  }).then(response => res.redirect(`/main.html?access_token=${response.data.access_token}`))
  .catch(err => console.log(err));
});

app.listen(process.env.PORT || port, () => {
  console.log('App listening on port', process.env.PORT || port);
});