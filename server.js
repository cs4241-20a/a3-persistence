const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//app.use(function(req, res, next) {
//    next();
//})

app.use(express.static('public'))

app.post("/submit", bodyParser.json(), function(request, response) {
    //write post request code here
    console.log(request.body);
    response.json(request.body);
})

app.listen(3000)