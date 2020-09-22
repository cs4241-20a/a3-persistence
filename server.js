const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//app.use(function(req, res, next) {
//    next();
//})

app.use(express.static('public'))

app.post("/submit", bodyParser.json(), function(request, response) {
    //write post request code for a new item here
    let data = request.body;
    //CHANGE THIS WITH THE DATABASE ID
    data["id"] = Math.floor((Math.random() * 1000) + 1);
    console.log("Submit");
    console.log(data);
    response.json(data);
})

app.post("/edit", bodyParser.json(), function(request, response) {
    //write post request code for an edited item here
    console.log("Edit");
    console.log(request.body);
    response.sendStatus(200);
})

app.post("/delete", bodyParser.json(), function(request, response) {
    //write post request code for a deleted item here
    console.log("Delete");
    console.log(request.body);
    response.sendStatus(200);
})

app.post("/data", bodyParser.json(), function(request, response) {
    //write post request code for getting all data for a user
    console.log("Get Data");
    console.log(request.body);
    response.json({data: "true"});
})

app.listen(3000)