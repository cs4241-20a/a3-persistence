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
    response.json({Server:"Hi"});
})

app.listen(3000)