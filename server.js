const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const app = express();
const mongouri = 'mongodb+srv://a3-server:a3-webware@cluster0.nxdrv.azure.mongodb.net/<dbname>?retryWrites=true&w=majority'
const databaseName = 'users'
const clientID = '550b0bf64df6675c7bbb';
const clientSecret = 'd0fb64b9da9c8e06726af688aaeabdbc39646f5a';
const port = 3000;



MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
  if (error) return console.log("Connection failed");
  console.log("Connection established");
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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
	.catch(err => console.log(err));
});

app.post('/createAccount', (req, res) => {
	let data = Object.keys(req.body)[0];
	data = JSON.parse(data);
	bcrypt.genSalt(10).then(salt => {
		const hash = bcrypt.hash(data.password, salt).then(hash => {
			data.password = hash;

			MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
				if (err) console.log("Connection failed");
				const db = client.db('users');
				db.collection('_webware').insertOne(data, (err, response) => {
					if (err) {
						res.sendStatus(401);
					}
					else console.log('User Created');
					client.close();	
					res.sendStatus(200);
				});
			});
		}).catch(err => res.sendStatus(401));
	}).catch(err => res.sendStatus(401));
});

app.post('/login', (req, res) => {
	let data = Object.keys(req.body)[0];
	data = JSON.parse(data);

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) console.log("Connection failed");
		const db = client.db('users');
		const query = {'user': data.user_name};
		db.collection('_webware').findOne({'user': data.user_name}, (err, doc) => {
			if (err || !doc) res.sendStatus(401);
			else {
				bcrypt.compare(data.password, doc.password)
				.then(same => {
					console.log('User Found', doc);
					client.close();	
					console.log(same.toString());
					res.send(same.toString());
				}).catch(err => console.log('bcrypt compare', err));
			}
		});
	});
});

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