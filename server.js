const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const mongouri = 'mongodb+srv://a3-server:a3-webware@cluster0.nxdrv.azure.mongodb.net/<dbname>?retryWrites=true&w=majority'
const databaseName = 'users'
const clientID = '550b0bf64df6675c7bbb';
const clientSecret = 'd0fb64b9da9c8e06726af688aaeabdbc39646f5a';
const port = 3000;

const randomwords = ['size','pipe','show','toy','zipper','throne','baby','seat','river','ocean','spade',
		'pump','cakes','skate','cat','vegetable','nut','furniture','tendency','car','sleet','truck','basket','writer',
		'fish','rock','ants','border','experience','kitty','flesh','servant','hydrant','planes','week','office',
		'dog','art','yak','distance','stocking','snails','playground','knot','curtain','wrench','daughter','seashore',
		'side','channel','cow','surprise','team','partner','paper','leg','arch','produce','bell','language','hope',
		'women','angle','cream','jar','respect','pigs','loaf','fly','time','uncle','move','earth','pies','flame',
		'door','place','wing','fact','cherries','need','knee','ground','key','farm','direction','crayon','authority',
		'idea','cake','winter','copper','son','cactus','caption','road','slope','trouble','finger','comparison'];

const scramble = (word) => {
	let scrambled = word.split('');

	for (let i = scrambled.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * i);
		let temp = scrambled[i];
		
		scrambled[i] = scrambled[j];
		scrambled[j] = temp;
	}
	return scrambled.join('');
};


MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
  if (error) return console.log("Connection failed");
  console.log("Connection established");
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


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
	let data = req.body;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) console.log("Connection failed");
		const db = client.db('users');
		const query = {'user': data.user_name};
		db.collection('_webware').findOne({'user': data.user_name}, (err, doc) => {
			if (err || !doc) res.sendStatus(401);
			else {
				bcrypt.compare(data.password, doc.password)
				.then(same => {
					client.close();
					res.redirect(`/main.html?auth=login&id=${doc._id}&name=${doc.first+','+doc.last}`);
				}).catch(err => console.log('bcrypt compare', err));
			}
		});
	});
});


app.get('/getScores', (req, res) => {
	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) console.log("Connection failed");
		const db = client.db('users');
		db.collection('_scores').find().sort({score:-1}).limit(5).toArray((err, docs) => {
			let retjson = {};

			docs.forEach((doc, ind) => {
				db.collection('_webware').findOne({'_id': doc.id}, (err, docNames) => {
					if (err) console.log(err);
					if (!docNames) retjson[ind] = {'name': '???', 'score': doc.score};
					else retjson[ind] = {'name': docNames.first, 'score': doc.score};
				});
			});
			console.log((retjson));
			res.send(JSON.stringify(retjson));
		});
	});
});


app.get('/guess', (req, res) => {
	let id = req.query.id;
	let data = req.query.guess;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) console.log("Connection failed");
		const db = client.db('users');

		const query = {'id': id};
		const options = {'upsert': true};

		db.collection('_currwords').findOne(query, (err, doc) => {
			if (req.query.guess === doc.word) {
				db.collection('_scores').updateOne(query, {$inc: {'score': 1}, $set: {'id': id}}, options);
			}
			res.send((req.query.guess === doc.word).toString());
		});
	});
});


app.get('/currentWord', (req, res) => {
	let id = req.query.id;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) console.log("Connection failed");
		const db = client.db('users');
		const word = randomwords[Math.floor(Math.random() * randomwords.length)];
		const query = {'id': id};
		const update = { $set: {'id': id, 'word': word}};
		const options = {'upsert': true}
		db.collection('_currwords').updateOne(query, update, options);
		res.send(word);
	});
});


app.get('/getCurrScore', (req, res) => {
	let id = req.query.id;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) console.log("Connection failed");
		const db = client.db('users');
		const query = {'id': id};
		const newScore = {'id': id, 'score': 0};
		let scores = 0;
		db.collection('_scores').findOne(query, (err, doc) => {
			if (err) console.log(err);
			if (!doc) {
				db.collection('_scores').insertOne(newScore);
				res.send((0).toString());
			} else {
				res.send(doc.score.toString());
			}
		});
		// db.collection('_scores').updateOne(query, update, options);
		// res.send((1).toString());
	});
});


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


app.get('/auth/github/callback/', (req, res) => {
  const requestToken = req.query.code;
  axios({
    method: 'POST',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
         accept: 'application/json'
    }
  })
  .then(response => res.redirect(`/main.html?auth=git&access_token=${response.data.access_token}`))
  .catch(err => console.log(err));
});


app.listen(process.env.PORT || port, () => {
  console.log('App listening on port', process.env.PORT || port);
});