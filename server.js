// JavaScript source code
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const favicon = require('favicon');
const path = require('path');
const responseTime = require('response-time');
const cookieSession = require('cookie-session');
require('dotenv').config()
const mongodb = require('mongodb')

app.use(cookieSession({
    name: 'cookie lego',
    keys: ['i need a gf'],
    secret: process.env.COOKIE_SECRET
}))

app.use(express.static('public'))
app.use(bodyparser.json())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(responseTime((request, response, Time) => console.log(request.method, request.url, time + 'ms')))

//connectng to mongodb
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://dbuser:${process.env.DBPASSWORD}@cluster0.rtnhc.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

app.get('/geturl', (request, response) => {
    const path2 = request.protocol + '://' + request.get('host');
    const url = '';
    response.json(url);
})

async function gainAccess(code, id, secret) {
    const response = await fetch('', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id,
            secret,
            code
        })
    })
        .then(response => response.text());

    const params = new URLSearchParams(response);
    return params.get('access_token');
}


app.get('/appdata', (request, response) => {
    var array = [];
    collection.find({ "GHid": request.session.GHid }).forEach(doc => {
        array.push(doc);
    })
        .then(() => {
            response.json(array);
        })
})


app.get('/logout', (request, response) => {
    request.session = null;
    response.clearCookie();
    response.redirect('/');
})

app.post('/submit', (request, response) => {
    const json = {}
})

