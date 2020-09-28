let express = require("express");
let mongoDB = require('mongodb');
let app = express();

// middleware imports
let bodyParser = require('body-parser');

// directory to serve up files
app.use(express.static("./public"));

// constants and variable related to establishing a connection to the cluster
const uri = "mongodb+srv://webserver:webserver1@cluster0.gswqr.mongodb.net/website-data?retryWrites=true&w=majority";
const client = new mongoDB.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null;

// connect to the MongoDB cluster
client.connect().then( () => {
    // will only create collection if it doesn't exist
    return client.db('website-data').collection('guests');
}).then( __collection => {
    // store reference to collection
    collection = __collection
    return "Connected to guests collection on website-data DB";
}).then( console.log )

// add a guest
app.post('/add', bodyParser.json(), (request, response) => {
    // get the data
    let data = request.body;

    //constructing the document to be stored in the DB
    let document = {
        fullName: getFullName(data['firstName'], data['middleName'], data['lastName']),
        gender: data['gender'],
        birthday: data['birthday'],
        ableToDrink: getDrinkingValidity(data['birthday'])
    }

    // insert the document into the DB
    collection.insertOne(document).then(result => {
        collection.find({}).toArray(function (err, results) {
            response.json(results);
            console.log("INSERTED: " + document['fullName']);
        });
    });
});

// delete a guest
app.post('/delete', bodyParser.json(), (request, response) => {
    // get the data
    let data = request.body;

    // delete the record
    collection.deleteOne(data).then(() => {
        collection.find({}).toArray(function (err, results) {
            response.json(results);
            console.log("DELETED: " + data['fullName']);
        });
    });
});

// load all of the records
app.post('/load', (request, response) => {
    // get all of the records
    collection.find({}).toArray(function(err, results) {
        response.json(results);
        console.log("Retrieved All Documents from DB");
    });
});

// modify a record
app.post('/modify', bodyParser.json(), (request, response) => {
    // get the data from the request
    let data = request.body;

    collection.find(data).toArray().then((document) => {
        return document[0];
    }).then((document) => {
        let newVal = !document['ableToDrink'];
        collection.updateOne({'fullName': document['fullName']}, {$set: {'ableToDrink': newVal}});
        return {'fullName': document['fullName'],
                'ableToDrink': newVal};
    }).then((information) => {
        collection.find({}).toArray(function (err, results) {
            response.json(results);
            console.log("UPDATED DRINKING VALUE OF \'" + information['fullName'] + "\' to " + information['ableToDrink']);
        });
    })
});

// helper method to get full name of the guest
let getFullName = function( fName, mName, lName) {
    return fName + " " + mName + " " + lName;
};

// helper method to get the validity of the drinking age of the guest
let getDrinkingValidity = function (birthday) {
    let birthdayComponents = birthday.split("-");
    let birthDate = new Date(birthdayComponents[0], birthdayComponents[1], birthdayComponents[2]);
    let ageDifMs = Date.now() - birthDate.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch

    let ageYears = Math.abs(ageDate.getUTCFullYear() - 1970);

    return ageYears >= 21;
};

// set port to listen
let listener = app.listen(3000, () => {
    console.log("App is listening on port: " + listener.address().port);
});