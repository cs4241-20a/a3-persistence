const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler')
const {MongoClient, ObjectId} = require('mongodb');

const app = express();
const mongouri = 'mongodb+srv://a3-server:a3-webware@cluster0.nxdrv.azure.mongodb.net/<dbname>?retryWrites=true&w=majority'
const databaseName = 'users'
const clientID = 'de371a63d4674912eafc';
const clientSecret = '0cfe3cdc188e63b810d09383c421f8579c260650';
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


MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) return console.log("Connection failed");
  console.log("Connection established");
});

app.use(cors());
app.use(helmet({contentSecurityPolicy: false,}));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(__dirname + '/public/assets/favicon.ico'))


app.post('/createAccount', (req, res) => {
	let data = Object.keys(req.body)[0];
	data = JSON.parse(data);

	bcrypt.genSalt(10).then(salt => {
		const hash = bcrypt.hash(data.password, salt).then(hash => {
			data.password = hash;

			MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
				if (err) return errorhandler(err, req, res, next);
				const db = client.db('users');
				db.collection('_webware').findOne({'user': data.user}, (err, doc) => {
					if (err) return errorhandler(err, req, res, next);
					if (!doc) {
						db.collection('_webware').insertOne(data, (err, response) => {
							if (err) return errorhandler(err, req, res, next);
							else res.send(response.ops[0]._id.toString());
						});
					} else {
						client.close();	
						res.send(doc._id);
					}
				});
			});
		}).catch(err => {console.log('Hashing failed');return errorhandler(err, req, res, next);});
	}).catch(err => {console.log('SaltGen failed');return errorhandler(err, req, res, next);});
});


app.post('/login', (req, res) => {
	let data = req.body;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) return errorhandler(err, req, res, next);;
		const db = client.db('users');
		const query = {'user': data.user_name};
		db.collection('_webware').findOne({'user': data.user_name}, (err, doc) => {
			if (err || !doc) return errorhandler(err, req, res, next);
			else {
				bcrypt.compare(data.password, doc.password)
				.then(same => {
					client.close();
					res.redirect(`/main.html?auth=login&id=${doc._id}&name=${doc.first+','+doc.last}&user=${doc.user}`);
				}).catch(err => {console.log('bcrypt compare'); return errorhandler(err, req, res, next);});
			}
		});
	});
});


/*** Game Function get requests (also interface with db) ***/
/*** TODO: FIX THIS SO IT ACTUALLY GETS NAMES ***/
app.get('/getScores', (req, res) => {
	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) return errorhandler(err, req, res, next);
		const db = client.db('users');
		db.collection('_scores').find().sort({score:-1}).limit(5).toArray((err, docs) => {
			if (err) return errorhandler(err, req, res, next);
			let retjson = {};

			docs.forEach(async (doc, ind) => {
				retjson[ind] = {'name': doc.user, 'score': doc.score};
				// if ((ind > 3) || (docs.length < 5 && ind === docs.length - 1))
			});

			res.send(JSON.stringify(retjson));
		});
	});
});


app.get('/guess', (req, res) => {
	let id = req.query.id;
	let user = req.query.user;
	let data = req.query.guess;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) return errorhandler(err, req, res, next);
		const db = client.db('users');

		const query = {'id': id};
		const options = {'upsert': true};
		db.collection('_currwords').findOne(query, (err, doc) => {
			if (err) return errorhandler(err, req, res, next);
			if (req.query.guess === doc.word) {
				db.collection('_scores').updateOne(query, {$inc: {'score': 1}, $set: {'id': id, 'user': user}}, options);
			}
			res.send((req.query.guess === doc.word).toString());
		});
	});
});


app.get('/currentWord', (req, res) => {
	let id = req.query.id;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) return errorhandler(err, req, res, next);
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
	let user = req.query.user;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) return errorhandler(err, req, res, next);
		const db = client.db('users');
		const query = {'id': id};
		const newScore = {'id': id, 'user': user, 'score': 0};
		let scores = 0;
		db.collection('_scores').findOne(query, (err, doc) => {
			if (err) return errorhandler(err, req, res, next);
			if (!doc) {
				db.collection('_scores').insertOne(newScore);
				res.send((0).toString());
			} else {
				res.send(doc.score.toString());
			}
		});
	});
});


app.get('/endGame', (req, res) => {
	id = req.query.id;

	MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) return errorhandler(err, req, res, next);
		const db = client.db('users');
		const query = {'id': id};

		db.collection('_currwords').findOne(query, (err, doc) => {
			if (err) return errorhandler(err, req, res, next);
			db.collection('_scores').updateOne(query, {$unset: {'id': ''}});
			res.sendStatus(200);
		});
	});
});


app.get('/deleteEverything', (req, res) => {
		MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
		if (err) return errorhandler(err, req, res, next);
		const db = client.db('users');
		db.collection('_scores').remove({}).then(success => {
			console.log('All scores deleted');
			res.sendStatus(200);
		});
	});
});


/*** github auth get handlers ***/

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
	.catch(err => errorhandler(err, req, res, next));
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
  .catch(err => errorhandler(err, req, res, next));
});


app.listen(process.env.PORT || port, () => {
  console.log('App listening on port', process.env.PORT || port);
});