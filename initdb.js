const {MongoClient, ObjectId} = require('mongodb');

const mongouri = 'mongodb+srv://a3-server:a3-webware@cluster0.nxdrv.azure.mongodb.net/<dbname>?retryWrites=true&w=majority'
const databaseName = 'unscramble'
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

MongoClient.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
	if (error) return console.log("Connection failed");
	console.log("Connection established");

	randomwords.forEach((val, ind) => {

		data = {'id': ind, 'val': val};

		const db = client.db('unscramble');
		db.collection('words').insertMany(data, (err, response) => {
			if (err) {
				console.log(err);
			}
			else console.log('word added');
		});
	});
	client.close();
});


